/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs-extra');
const parser = require('@babel/parser');
const glob = require('glob');
const chalk = require('chalk');
const ora = require('ora');

let packageCoverCount = 0;
const packageData = {};

const componentData = {};

function getUsageDatafromFile(path) {
  const content = fs.readFileSync(path, { encoding: 'utf-8' });
  const { program: { body } = {} } = parser.parse(content, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript', 'decorators-legacy'],
  });

  const importDeclaration = body.filter(
    (item) => item.type === 'ImportDeclaration',
  );

  const zilImport = importDeclaration.filter(
    (item) => item.source.value.indexOf('@zil-design') >= 0,
  );
  packageCoverCount += zilImport.length > 0 ? 1 : 0;
  zilImport.forEach((item) => {
    const importedName = item.source.value;
    // 统计包的引用次数
    if (!packageData[importedName]) {
      packageData[importedName] = [];
    }
    packageData[importedName].push(path);

    // 统计包内组件的引用次数
    item.specifiers.forEach((spec) => {
      switch (spec.type) {
        case 'ImportDefaultSpecifier': {
          // import A from 'A'
          // do not support
          break;
        }
        case 'ImportSpecifier': {
          // import { a } from 'A'
          const importedComName = spec.imported.name;
          if (!componentData[importedComName]) {
            componentData[importedComName] = [];
          }
          componentData[importedComName].push(path);
          break;
        }
        case 'ImportNamespaceSpecifier': {
          // import * as A from 'A'
          // do not support
          break;
        }
        default:
          break;
      }
    });
  });
}

/**
 * 收集组件库使用数据
 * @param {string} name
 * @param {object} options
 */
const collect = async (options) => {
  const ignoreDir = options.exclude
    ? options.exclude.map((dir) => `**/${dir}/**/*`)
    : [];

  const spinner = ora(
    '开始统计zil-design组件库使用数据，可能需要一些时间...',
  ).start();
  glob(
    `${options.root}/**/*.+(js|jsx|ts|tsx)`,
    { nodir: true, ignore: [...ignoreDir] },
    (err, files) => {
      // console.log(files);
      files.forEach((file) => {
        getUsageDatafromFile(file);
      });
      spinner.stop();
      console.log(chalk.cyan('zil-design组件库使用数据如下:'));
      console.table([
        { name: '模块总数:', count: files.length },
        { name: 'zil-design覆盖模块数:', count: packageCoverCount },
      ]);
      console.log(chalk.cyan('zil-design包使用情况:'));
      console.table(
        Object.keys(packageData)
          .map((pkg) => ({ name: pkg, count: packageData[pkg].length }))
          .sort((a, b) => b.count - a.count),
      );
      console.log(chalk.cyan('zil-design组件使用情况:'));
      console.table(
        Object.keys(componentData)
          .map((com) => ({ name: com, count: componentData[com].length }))
          .sort((a, b) => b.count - a.count),
      );
      console.log(chalk.redBright('感谢您的支持！❤'));
    },
  );
};

module.exports = collect;
