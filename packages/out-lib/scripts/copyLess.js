const fs = require('fs-extra');
const path = require('path');

fs.copy(
  path.resolve(__dirname, '../src/fixtures'),
  path.resolve(__dirname, '../es/less'),
  {
    filter: (src) => {
      return !src.endsWith('.md');
    },
  },
).then(() => {
  console.log('copy less to es complete!');
});

// fs.copy(path.resolve(__dirname, '../src/fixtures'), path.resolve(__dirname, '../lib/less'), {
//   filter: (src) => {
//     return !src.endsWith('.md');
//   }
// }).then(() => {
//   console.log('copy less to lib complete!');
// });
