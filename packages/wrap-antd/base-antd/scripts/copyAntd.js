const fs = require('fs-extra');
const path = require('path');

Promise.all(
  ['es', 'lib'].map(
    (dest) =>
      new Promise((resolve) => {
        fs.copy(
          path.resolve(__dirname, `../../../../node_modules/antd/${dest}`),
          path.resolve(__dirname, `../${dest}`)
        );
      })
  )
)
  .then(() => {
    console.log('copy antd complete!');
  })
  .catch((e) => {
    console.error('copy antd failed!');
    console.error(e);
  });
