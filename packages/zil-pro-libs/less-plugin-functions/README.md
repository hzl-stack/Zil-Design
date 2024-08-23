# @g3-cscec/less-plugin-functions

[less-plugin-functions](https://github.com/seven-phases-max/less-plugin-functions)的复制版本，无须编译，一般也不需要改动

# 为什么要复制一份 less-plugin-functions?

`less-plugin-functions`是用来定义或者重写`less`函数的

在`docs/lib-react/theme.md`中已经有说明为什么要引入`less-plugin-functions`

原`less-plugin-functions`存在的问题是，重写方法后，无法继续使用原方法，比如下面重写`darken`函数

```less
// 重写了darken函数，调用darken失去了darken的效果
.function {
  .darken(@color, @percentage: 100%) {
    return: @color;
  }
}
```

理想情况是：

- 当`@color`参数是合法的颜色值时，使用正确的`darken`函数
- 当`@color`参数不是合法的颜色值时，比如我们的场景下会是`css`变量，使用重写的`darken`函数

于是有

```less
.function {
  .darken(@color, @percentage: 100%) {
    return: @color;
  }

  .darken(@color, @percentage: 100%) when(iscolor(@color)) {
    return: darken(@color, @percentage);
  }
}
```

原`less-plugin-functions`插件在上面的代码会报错，`darken`函数会陷入死循环

复制一份就是为了解决这个死循环问题

# 修改了哪些地方

- `71`行加了一个`try-cache`
- `101`行`stackDepth > 1000`改为了`stackDepth > 10`
