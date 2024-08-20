module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {},
      },
    ],
    [
      '@babel/plugin-transform-runtime',
      {
        absoluteRuntime: false,
        corejs: false,
        helpers: true,
        regenerator: true,
        useESModules: true,
      },
    ],
    ['@babel/plugin-transform-class-properties'],
    ['@babel/plugin-transform-private-property-in-object'],
    ['@babel/plugin-transform-private-methods'],
    ['@babel/transform-object-rest-spread'],
    [
      'import',
      {
        libraryName: '@zil-design/base-antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
};
