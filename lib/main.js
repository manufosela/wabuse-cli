import 'dotenv/config';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';
import { createPageCmd, createWcCmd, scafoldingCmd, buildPageCmd, buildCmd } from './commands.js';
import { buildPage, build } from './build.js';
import { startServer } from './server.js';
import { answerThisQuestion, showErrorMsg, checkAndChangeDirectory } from './utils.js';
import fs from 'fs';

const argv = yargs(hideBin(process.argv)).argv;
let appDir = process.cwd();
let command;
let languages = '';
let yes = false;
let workDir;

const commands = {
  'create-page': createPageCmd,
  'create-wc': createWcCmd,
  scafolding: scafoldingCmd,
  'build-page': buildPageCmd,
  build: buildCmd,
};

/**
 * Process the arguments
 */
function processArgs() {
  if (argv.help || argv.h) {
    how2use();
    process.exit();
  }

  command = argv._[0];
  languages = argv.languages || '';  // es,en
  yes = argv.yes || argv.y || false;

  if (Object.keys(commands).includes(command)) {
    commands[command]();
  } else {
    how2use();
    process.exit();
  }
}

/**
 * Display usage information
 */
function how2use() {
  console.log('USE: wabuse [command] [options]\n');
  console.log('Commands:');
  console.log(`\n\t- ${chalk.bold('build')}: to build all pages`);
  console.log(`\n\t- ${chalk.bold('create-page')}: to generate all files related with a new page [INPROGRESS]`);
  console.log(`\n\t- ${chalk.bold('create-wc')}: to generate all files related with a new web component`);
  console.log(`\n\t- ${chalk.bold('scafolding')}: to generate all initial files to create a Wabuse static site`);
  console.log(`\n\t- ${chalk.bold('env-vars')}: to process env vars and replace them in all js files [INPROGRESS]`);
  console.log(`\n\t- ${chalk.bold('pwa')}: to generate sw.js ans insert into index.html [INPROGRESS]`)
  console.log(`\n\t- ${chalk.bold('image-peformance')}: to generate images width different sizes and formats [INPROGRESS]`);
}

const fn = {
  'create-page': createPageCmd,
  'build': build,
  'build-page': buildPage,
  'create-wc': createWcCmd,
  'scafolding': scafoldingCmd,
};

/**
 * Initializes the application by processing the command line arguments
 * and executing the corresponding command.
 */
export async function init() {
  processArgs();
  const question = `The ${chalk.bold(chalk.cyan(command))} command will be executed in the "${chalk.bold(chalk.cyan(workDir))}" directory.\n\nDo you want to proceed? (y/${chalk.cyan('N')})`;
  if (!yes) {
    const response = await answerThisQuestion(question);
    if (response.toUpperCase() === 'Y' || response.toUpperCase() === 'YES') {
      fn[command]();
    } else {
      console.log(chalk.bold(chalk.red('Command aborted.')));
      process.exit(0);
    }
  } else {
    fn[command]();
  }
}

init();
