'use strict';

module.exports = function (less, pluginManager, options) {
  // ............................................................

  let tree = less.tree,
    MixinCall = tree.mixin.Call,
    DetachedSet = tree.DetachedRuleset,
    mergeRules = less.visitors.ToCSSVisitor.prototype._mergeRules,
    rootRegistry = less.functions.functionRegistry,
    overridable = overridableFunc(options),
    builtinGet = rootRegistry.get,
    stackDepth = 0,
    root;

  installRootHook(pluginManager);

  // plugin.install can be used several times per less session
  // (e.g. Grunt compiling multiple files per task), hence ensure
  // we hook to real built-ins instead of an earlier hook:
  let id = '__pluginFuncsHook';
  if (builtinGet[id]) builtinGet = builtinGet[id].builtin;
  rootRegistry.get = options.globalsOnly ? fastLookup : eagerLookup;
  rootRegistry.get[id] = { builtin: builtinGet };

  // ........................................................
  // global scope only lookup:

  function fastLookup(name) {
    // this = <function-registry object>
    // jshint validthis: true
    if (!overridable(name)) return builtinGet.call(this, name);

    // FIXME/TODO, the evaluated (copy of) `root` should actually be used here,
    // see test/expanded-definition.less for obvious example
    // (though this can be tricky as it can use the funcs during eval too, hmm...)

    let selector = mixinSelector(name),
      scope = { context: { frames: [root] } }; // hmm, fixme, is there a better way?

    function f(i) {
      return function () {
        // this = <function-caller object>
        scope.index = this.index;
        scope.currentFileInfo = this.currentFileInfo;
        return callMixin(scope, selector[i], arguments);
      };
    }

    for (let i = 0; i < selector.length; i++)
      if (root.find(selector[i]).length > 0) return f(i);

    // no mixins found, fallback to a built-in Less function:
    return builtinGet.call(this, name);
  }

  // ........................................................
  // scope-wise lookup:

  function eagerLookup() {
    return function () {
      // this = <function-caller object>
      let name = this.name;
      if (overridable(name)) {
        let frames = this.context.frames,
          selector = mixinSelector(name);
        // before callMixin we need to try to find if such mixin exist on our own, otherwise
        // MixinCall.eval will throw 'undefined' (if no such mixin) and it's hard to fallback.
        // (it's possible to catch hardcoded-error-message and continue, but this would be doh!).
        // So here callMixin goes only if mixin(s) exists for sure (search results are cached
        // so it should be not that bad from perf. point of view):
        // 加一个try-cache保证能回退到自带的函数
        try {
          for (let i = 0; i < selector.length; i++)
            for (let j = 0; j < frames.length; j++)
              if (
                frames[j].rules && // <- see less/less.js#2574
                frames[j].find(selector[i]).length > 0
              )
                return callMixin(this, selector[i], arguments);
        } catch (error) {
          // console.log(error);
        }
      }

      // no mixins found, fallback to a built-in Less function:
      // (may be scope-wise since Less 2.5.0)
      // using global registry for now, but to be compatible with `@plugin`
      // it should run through all frames[0...n].functionRegistry, TODO:
      let f = builtinGet.call(rootRegistry, name);
      return f && f.apply(this, arguments);
    };
  }

  // ........................................................

  function callMixin(scope, selector, args) {
    // scope = <function-caller object>

    // TODO: find a way to throw this at highest depth to not print 1000 errors :)
    assert(
      stackDepth < 10,
      'possible infinite recursion detected' + ' (nested function calls > 10)',
    );
    // console.dir(selector);
    let value,
      rules = tryCallMixin(
        scope.context,
        new MixinCall(
          selector.elements,
          convertArgs(args),
          scope.index,
          scope.currentFileInfo,
        ),
      );

    if (!rules) return;
    if (mergeRules) mergeRules(rules); // first merge any `return+:` stuff
    for (let i = 0; i < rules.length; i++) {
      let r = rules[i];
      if (r.name && !r.variable) {
        assert(
          r.name === 'return',
          'unexpected property `' +
            r.name +
            '`, functions may not generate CSS properies',
        );
        value = r.value;
      }
    }

    assert(
      value,
      "can't deduce return value, either no" +
        ' mixin matches or return statement is missing',
    );

    // FIXME: when a plain value assigned to a property, e.g. `return: red;`
    // the compiler does not bother to actually parse it and passes such
    // value as Anonymous. But here we have a problem when such value is
    // later used in further expressions (which can never happen in the core).
    // This should be fixed either in the core OR by using `@return` instead of `return` :(,
    // but so far here a dirty kludge goes :(
    if (value.type === 'Anonymous') return reparse(value.value);

    return value;
  }

  // ........................................................

  function tryCallMixin(context, mixinCall) {
    let r;
    ++stackDepth;
    /* Hack to allow functions to return DRs.
           This is the most ugly hack ever of course,
           TODO: propose to remove the
           'Rulesets cannot be evaluated on a property' error,
           it does not work for complex expressions and won't
           be compatible with `#ns[property]` feature anyway:
        */
    DetachedSet.prototype.type = 'NotDetachedRuleset';
    try {
      r = mixinCall.eval(context);
    } catch (e) {
      error(e);
    }
    DetachedSet.prototype.type = 'DetachedRuleset';
    --stackDepth;
    return r;
  }

  function mixinSelector(name) {
    let Element = tree.Element,
      Selector = tree.Selector;
    return [
      new Selector([
        new Element('', '.function'),
        new Element(' ', '.' + name),
      ]),
      new Selector([new Element('', '.function-' + name)]),
    ];
  }

  function reparse(value) {
    // eslint-disable-next-line no-param-reassign
    return (value = value.split(',').map(function (value) {
      // eslint-disable-next-line no-param-reassign
      return (value = value
        .trim()
        .split(/[\s]+/)
        .map(function (value) {
          return reparse_(value);
        })).length > 1
        ? new tree.Expression(value)
        : value[0];
    })).length > 1
      ? new tree.Value(value)
      : value[0];
  }

  function reparse_(value) {
    let r;
    if (/^#([a-f0-9]{6}|[a-f0-9]{3})$/i.test(value))
      // ref: functions.color
      return new tree.Color(value.slice(1));
    if ((r = /^([+-]?\d*\.?\d+)(%|[a-z]+)?$/i.exec(value)))
      // ref: Parser.dimension
      return new tree.Dimension(r[1], r[2]);
    if (/^[_a-z-][\w-]*$/i.test(value))
      return tree.Color.fromKeyword(value) || new tree.Keyword(value);
    return new tree.Anonymous(value);
  }

  // ........................................................

  function installRootHook(pluginManager) {
    pluginManager.addVisitor({
      isPreEvalVisitor: true,
      run: function (root_) {
        return (root = root_);
      },
    });
  }

  // ............................................................
}; // ~ end of module.exports

// ............................................................

function overridableFunc(options) {
  if (options.alwaysOverride)
    return function () {
      return true;
    };
  let list = require('./no-overrides.js');
  return function (name) {
    return !list[name];
  };
}

// ............................................................

function convertArgs(src) {
  // convert function arguments to mixin arguments
  // (can't have named args support)
  let i,
    n = src.length,
    dst = new Array(n);
  for (i = 0; i < n; i++) dst[i] = { name: null, value: src[i] };
  return dst;
}

// ............................................................

function error(e) {
  // no reason to set file info here since tree.Call will override it anyway
  let id = '[plugin-functions] ';
  // eslint-disable-next-line no-param-reassign
  if (typeof e === 'string') e = { type: 'Runtime', message: e };
  // TODO: try to find better formatting for a nested calls error
  e.message = '\n  ' + id + e.message;
  throw e;
}

function assert(condition, msg) {
  return condition || error(msg);
}

// ............................................................
