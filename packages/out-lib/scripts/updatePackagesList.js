/**
 * 遍历并寻找所有的packages,并加入allPackages并写入es/packagelist.json，以前在别的项目link需要在package.json中手动指定,现在直接执行zil link --all即可
 */
const fs = require('fs-extra');
const path = require('path');

const destDirs = path.resolve(__dirname, '../../');
console.log('destDirs', destDirs);
const allPackages = [];
fileDisplay(destDirs);

/**
 * 遍历并寻找所有的packages,并加入allPackages并写入es/packagelist.json
 * @param filePath 需要遍历的文件路径
 */
function fileDisplay(filePath) {
  //根据文件路径读取文件，返回文件列表
  const datas = fs.readdirSync(filePath, { withFileTypes: true });
  datas.map((value) => {
    const { name: filename, path } = value;
    let isFile = false;
    try {
      isFile = value.isFile();
    } catch (error) {
      console.log(error);
    }
    if (
      !isFile &&
      (filename === 'es' ||
        filename === 'src' ||
        filename === 'node_modules' ||
        filename === 'dist')
    ) {
      return null;
    }

    if (isFile && filename !== 'package.json') {
      return null;
    }

    const newPath = filePath + '/' + filename;
    if (!isFile) {
      fileDisplay(newPath);
    } else {
      const packageJson = require(newPath);
      if (packageJson.name && packageJson.scripts && packageJson.scripts.link) {
        allPackages.push(packageJson.name);
      }
    }
    return null;
  });
}

try {
  fs.writeFileSync(
    path.resolve(__dirname, '../es/packagelist.json'),
    JSON.stringify(allPackages, null, 2),
  );
} catch (error) {
  console.log(__dirname);

  console.log('write packages error', error);
}
