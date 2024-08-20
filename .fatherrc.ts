import { defineConfig } from 'father';

export default defineConfig({
  // more father config: https://github.com/umijs/father/blob/master/docs/config.md
  // esm: { output: 'dist' },
  esm: {
    output: 'es',
    transformer: 'babel',
  },
  extraBabelPlugins: [
    require.resolve('babel-plugin-lodash'),
    [
      require.resolve('babel-plugin-import'),
      {
        libraryName: '@zil-design/base-antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
});
