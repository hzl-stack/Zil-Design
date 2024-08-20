import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'Zil-Design',
    nav: [
      { title: '介绍', link: '/guide' },
      { title: '组件', link: '/packages' }, // components会默认自动对应到src文件夹
    ],
  },
});
