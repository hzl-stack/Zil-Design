import LessPluginFunctions from '@zil-design/less-plugin-functions';
import { defineConfig } from 'dumi';
import path from 'path';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

let useParser: any = {
  apiParser: {},
  resolve: {
    entryFile: './docs/doc_entries.tsx',
  },
};

export default defineConfig({
  ...useParser,
  svgr: {},
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'Zil-Design',
    nav: [
      { title: '介绍', link: '/guide' },
      { title: '组件', link: '/components' }, // components会默认自动对应到src文件夹
    ],
  },
  chainWebpack(config) {
    const lessRule = config.module.rule('less');

    ['css', 'css-modules'].forEach((rule) => {
      Object.values(lessRule.oneOf(rule).uses.entries()).forEach(
        (loader: any) => {
          if (loader.get('loader').includes('less-loader')) {
            loader.tap((opts) => {
              opts.lessOptions.modifyVars ??= {};
              opts.lessOptions.modifyVars['root-entry-name'] = 'variable';
              opts.lessOptions.plugins ??= [];
              opts.lessOptions.plugins.push(
                new LessPluginFunctions({ alwaysOverride: true }),
              );
              return opts;
            });
          }
        },
      );
      lessRule
        .oneOf(rule)
        .use('style-resources-loader')
        .loader('style-resources-loader')
        .options({
          patterns: [
            path.join(
              __dirname,
              'packages/lib-react/src/fixtures/less-functions-overrides.less',
            ),
            path.join(
              __dirname,
              'packages/lib-react/src/fixtures/antd-variables-overrides.less',
            ),
          ],
          injector: 'append',
        });
    });

    config.resolve
      .plugin('tsconfig-paths-webpack-plugin')
      .use(TsconfigPathsPlugin, [
        {
          configFile: path.resolve(__dirname, './tsconfig.json'),
        },
      ]);
  },
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: '@zil-design/base-antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
});
