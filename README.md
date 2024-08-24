# Zil-Design

[![NPM version](https://img.shields.io/npm/v/Zil-Design.svg?style=flat)](https://www.npmjs.com/package/@zil-design/zil-ui)
[![NPM downloads](http://img.shields.io/npm/dm/Zil-Design.svg?style=flat)](https://www.npmjs.com/package/@zil-design/zil-ui)

React library by hzl

# Attention:

lerna 使用 8.1.8 版本,不需要设置 useWorkspaces 选项,否则报错,https://github.com/flexn-io/renative/issues/1240

## Usage

组件库采用 monorepo 结构，有多个组件包，wrap-antd 包主要对 ant-design 组件库进行二次封装，wrap-semi 主要对 semi 进行二次封装，zil-pro-libs 主要是一些 hooks、个人编写的组件等，out-lib 为出口包

```bash
# 启动本地开发调试 文档调试
yarn start

# 更新修订版本号
yarn version:patch

# 更新修订版本号
yarn version:minor

# 更新修订版本号
yarn version:major

# 推送到npm仓库
yarn pub
```

## Options

## Development

```bash
# install dependencies
$ yarn install

# develop library by docs demo
$ yarn start

# build library source code
$ yarn run build

# build library source code in watch mode
$ yarn run build:watch

# build docs
$ yarn run docs:build

# Locally preview the production build.
$ yarn run docs:preview

# check your project for potential problems
$ yarn run doctor
```

## LICENSE

MIT
