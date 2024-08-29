/**
 * 此文件命令为了方便后续的link操作。
 * 打包时写入packagelist.json，自动维护了所有的组件库。此时，直接执行zil link --all即可link所有组件库，无需各个项目维护一份
 * 如果是windows电脑，执行 npx zil link --all即可
 */
const child_process = require('child_process');

const allPackages = require('../es/packagelist.json');
const callback = (error, stdout, stderr, command) => {
  if (error) {
    console.log('exce error', error);
    return;
  }
  console.log('stdout', command, stdout);
};

const dealWithPackages = (command, options) => {
  const { _optionValues = {}, args = [] } = options;
  console.log('dealWithPackages', _optionValues, args, command);
  if (_optionValues.all || !_optionValues.package) {
    child_process.exec(
      `yarn ${command} ${allPackages.join(' ')}`,
      (error, stdout, stderr) => {
        callback(error, stdout, stderr, command);
      },
    );
    return;
  }
  if (_optionValues.package) {
    const tempArgs = args.map((val) => {
      if (!val.startsWith('@zil-design')) {
        return `@zil-design/${val}`;
      }
      return val;
    });
    child_process.exec(
      `yarn ${command} ${tempArgs.join(' ')}`,
      (error, stdout, stderr) => {
        callback(error, stdout, stderr, command);
      },
    );
  }
};

const run = (name, options) => {
  try {
    dealWithPackages(options._name, options);
  } catch (error) {
    console.log('link error', error);
  }
};

module.exports = run;
