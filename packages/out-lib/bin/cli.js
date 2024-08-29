#! /usr/bin/env node
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */

const { Command } = require('commander');

const pkg = require('../package.json');

const program = new Command('zil');

/**
 * define version and usage
 */
program.version(pkg.version).usage('command [options]');

/**
 * define collect command
 * -f, --force, overwrite when target dir exist
 * --no-commit, do not commit when re-init git
 */
program
  .command('collect')
  .option('-r, --root <dir>', 'appoint specific source dir', 'src')
  .option('-e, --exclude <dir...>', 'appoint specific dir to be excluded')
  .description('collect out-lib data')
  .action((name, options) => {
    require('./collect')(name, options);
  });

program
  .command('link')
  .option('--all', 'link 组件库所有组件')
  .option('-p, --package', '手动指定要link的库')
  .description('link zil组件库,默认--all')
  .action((name, options) => {
    require('./link')(name, options);
  });

program
  .command('unlink')
  .option('--all', 'unlink 组件库所有组件')
  .option('-p, --package', '手动指定要unlink的库，多个库中间使用空格分隔')
  .description('unlink zil组件库，默认--all')
  .action((name, options) => {
    require('./link')(name, options);
  });

program.parse(process.argv);
