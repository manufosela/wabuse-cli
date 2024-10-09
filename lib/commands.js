import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import path from 'path';
import fs from 'fs';
import shell from 'shelljs';
import { showErrorMsg, checkAndChangeDirectory } from './utils.js';

const argv = yargs(hideBin(process.argv)).argv;
let appDir = process.cwd();

export let pageName;
export let wcName;
export let workDir;
export let siteName;
export let distdir;

/**
 * Sets the page name from the command line arguments.
 */
function createPageCmd() {
  if (argv._.length > 1) {
    pageName = argv._[1];
  }
}

/**
 * Sets the web component name from the command line arguments and validates it.
 * If the name is invalid, an error message is displayed and the process exits.
 */
function createWcCmd() {
  const currentDir = path.join(appDir, 'components');
  if (argv._.length > 1) {
    wcName = argv._[1];
    if (!wcName.match(/-/)) {
      showErrorMsg('command "create-component" must be a second parameter with a valid web-component name');
    }
  } else {
    showErrorMsg('command "create-component" must be a second parameter with web-component name');
  }
}

/**
 * Sets the site name and working directory from the command line arguments.
 * If no site name is provided, it uses the current directory name as the site name.
 */
function scafoldingCmd() {
  if (argv._.length > 1) {
    siteName = argv._[1];
    workDir = path.join(appDir, siteName);
    checkAndChangeDirectory(siteName);
  } else {
    const dirParts = appDir.split('/');
    workDir = appDir;
    siteName = dirParts.pop();
    appDir = path.join(...dirParts);
  }
}

/**
 * Sets the page name, port, environment, and working directory from the command line arguments.
 * If no page name is provided, an error message is displayed and the process exits.
 */
function buildPageCmd() {
  if (argv._.length > 1) {
    pageName = argv._[1];
    const port = argv.port || argv.p || 8081;
    const env = argv.env || argv.e || 'dev';
    workDir = argv.workDir || argv.d || appDir;
    distdir = path.join(workDir, '..', 'dist');
  } else {
    showErrorMsg('ERROR - command "build-page" must be a second parameter with page name');
  }
}

/**
 * Sets the port, environment, and working directory from the command line arguments.
 */
function buildCmd() {
  const port = argv.port || argv.p || 8081;
  const env = argv.env || argv.e || 'dev';
  workDir = argv.workDir || argv.d || appDir;
  distdir = path.join(workDir, '..', 'dist');
}

export {
  createPageCmd,
  createWcCmd,
  scafoldingCmd,
  buildPageCmd,
  buildCmd,
};
