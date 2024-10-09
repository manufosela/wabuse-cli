/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */
/* eslint-disable no-console */
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import shell from 'shelljs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import readline from 'readline';
import events from 'events';
import { spawnSync } from 'child_process';
import 'dotenv/config';
import { generateVSColor } from '../scripts/generateVSColor.js';
import { getPackageDependencies } from './dependencies.js';
import chalk from 'chalk';
import { createServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const argv = yargs(hideBin(process.argv)).argv;
let appDir = process.cwd();

events.EventEmitter.defaultMaxListeners = 100;

let command;
let pageName;
let port;
let env;
let workDir;
let currentDir;
let distdir;
let wcName;
let WcName;
// eslint-disable-next-line camelcase
let wc_Name;
let siteName;
let languages = '';
let yes = false;
const FilesLIST = [];

/** COMMON */

/**
 * @param {string} question - Question to show
 * @returns {Promise<string>} - Output of the question
 */
function answerThisQuestion(question, defaultValue = '') {
  return new Promise(resolve => {
    let response = defaultValue;
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(question, (resp) => {
      response = resp || defaultValue;
      rl.close();
    });

    rl.on("close", () => {
      resolve(response);
    });

    rl.on('SIGINT', () => {
      console.log(`\n\n***********************************************************\n${chalk.bold(chalk.red('Terminando wabuse...'))}\n`);
      rl.close();
      process.exit(0); // Termina el proceso con estado de salida 0 (éxito)
    });
  });
}

/**
 *  HOW TO USE
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

/**
 * @param {string} errorMsg - Error message to show
 */
function showErrorMsg(errorMsg) {
  console.error(`\nERROR - ${errorMsg}\n\n`);
  process.exit();
}

/**
 *  CREATE PAGE COMMAND
 */
function createPageCmd() {
  if (argv._.length > 1) {
    pageName = argv._[1];
  }
}

/**
 *  CREATE WC COMMAND
 */
function createWcCmd() {
  currentDir = path.join(appDir, 'components');
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
 *  SCAFOLDING COMMAND
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
 *  CREATE PAGE COMMAND
 */
function buildPageCmd() {
  if (argv._.length > 1) {
    pageName = argv._[1];
    port = argv.port || argv.p || 8081;
    env = argv.env || argv.e || 'dev';
    workDir = argv.workDir || argv.d || appDir;
    distdir = path.join(workDir, '..', 'dist');
  } else {
    showErrorMsg();
    console.error('ERROR - command "build-page" must be a second parameter with page name');
    process.exit();
  }
}

/**
 *  BUILD COMMAND
 */
function buildCmd() {
  port = argv.port || argv.p || 8081;
  env = argv.env || argv.e || 'dev';
  workDir = argv.workDir || argv.d || appDir;
  distdir = path.join(workDir, '..', 'dist');
}

/**
 *  ENV-VARS COMMAND
 */
function envVarsCmd() {
  distdir = path.join(workDir, 'dist');
  // TODO: processEnvVars();
}

/**
 *  PWA COMMAND
 */
function pwaCmd() {
  distdir = path.join(workDir, 'dist');
  // TODO: prepareServiceWorker();
}

/**
 * IMAGE-PERFORMANCE COMMAND
 */
function imagePerformanceCmd() {
  distdir = path.join(workDir, 'dist');
  // TODO: imagePerformance();
}

const commands = {
  'create-page': createPageCmd,
  'create-wc': createWcCmd,
  scafolding: scafoldingCmd,
  'build-page': buildPageCmd,
  build: buildCmd,
  'env-vars': envVarsCmd,
  pwa: pwaCmd,
  'image-performance': imagePerformanceCmd
};

/**
 *  Process the arguments
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
 * @returns {Promise<void>}
 */
// function startServer() {
//   const config = {
//     port,
//     env,
//     appIndex: 'index.html',
//     nodeResolve: true,
//     rootDir: workDir
//   };
//   console.log('Servidor arrancado...');
//   return startDevServer({ config });
// }

async function startServer(headless = false) {
  const server = await createServer({
    config: {
      root: './',
      server: {
        watch: {
          usePolling: true,
          interval: 100
        }
      },
    },
    server: {
      port,
      open: !headless,
    }
  });

  await server.listen();
  return server;
}


/**
 * create a directory
 * 
 * @param {string} dir - Directory to be processed
 */
function createDir(dir) {
  const [pathDir, level] = [...dir];
  // console.log('pathDir', pathDir, 'level', level);
  const levelStr = `  ${'|___'.padStart(level * 3 + 1, '   ')}`;
  const dirStr = pathDir.split('/').pop();
  if (!fs.existsSync(pathDir)) {
    fs.mkdirSync(pathDir);
  }
  console.log(`${levelStr}${dirStr}`);
}

/**
 * 
 * @param {string} directory - Directory to be processed
 */
function checkAndChangeDirectory(directory) {
  const fullPath = path.join(process.cwd(), directory);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath);
    console.log(`El directorio ${directory} no existía y ha sido creado.`);
  } else {
    console.log(`El directorio ${directory} ya existe. `);
  }
  process.chdir(fullPath);
  console.log(`Se ha cambiado el directorio de trabajo a ${fullPath}`);
}

/**
 * Get the name of the directory
 * 
 * @returns {Array} - Array of directories of languages to create
 */
function getLanguagesDir() {
  const files = fs.readdirSync(workDir, { encoding: 'utf8' });
  const notProcessPaths = ['assets', 'components', 'css', 'js', 'json', 'node_modules'];
  const langDir = [];
  files.forEach((file) => {
    if (fs.lstatSync(path.join(workDir, file)).isDirectory()) {
      if (!notProcessPaths.includes(file)) {
        langDir.push(file);
      }
    }
  });
  return langDir;
}

/** **** IMAGE-PERFORMANCE */

/**
 * @param {string} file - File to process 
 */
function processImage(file) {
  const fileDir = path.dirname(file);
  const fileName = path.basename(file);
  const fileExt = path.extname(file);
  const fileBaseName = path.basename(file, fileExt);
  const fileDestDir = path.join(fileDir, 'images', 'min');
  const fileDest = path.join(fileDestDir, `${fileBaseName}.webp`);
  if (!fs.existsSync(fileDestDir)) {
    fs.mkdirSync(fileDestDir);
  }
  const fileSrc = path.join(fileDir, fileName);
  const fileSrcData = fs.readFileSync(fileSrc);
  // const fileDestData = sharp(fileSrcData).webp().toBuffer();
  fs.writeFileSync(fileDest, fileDestData);
}

/**
 * @param {string} _dir - Directory to process
 */
function imagePerformance(_dir) {
  const dir = _dir || workDir;
  return new Promise((resolve) => {
    const files = fs.readdirSync(dir, { encoding: 'utf8' });
    files.forEach(async (file) => {
      await processImage(file);
      resolve();
    });
  });
}


/** **** COMMAND BUILD-PAGE */

/**
 * @param {string} file - file to be processed
 * @param {string} distPath - path to the dist directory
 */
function getPageContent(file, distPath = '') {
  console.log(`Procesando ${file}...`);
  return new Promise(async (resolve, reject) => {
    const fixedDistPath = (distPath !== '') ? `${distPath}/` : '';
    const url = `http://localhost:${port}/${fixedDistPath}${file}${(env === 'dev') ? '' : '?env=prod'}`;
    console.log(url);
    const browser = await puppeteer.launch({ "headless": "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] }).catch((err) => {
      console.log('error happen at launch the page: ', err);
      reject();
    });
    const page = await browser.newPage();
    page.on('error', err => {
      console.log('error happen at the page: ', err);
      reject();
    });
    await page.goto(url);
    const pageContent = await page.content();
    await browser.close();
    fs.writeFileSync(path.join(distdir, distPath, file), pageContent);
    console.log(`------------- ${file} saved into ${path.join(distdir, distPath)}`);
    resolve();
  });
}

/**
 * @param {string} file - file to be processed
 * @param {string} dir - directory to be processed
 */
async function processPage(file = pageName, dir) {
  console.log('Procesando página ', file, '...', dir);
  if (path.extname(file) === '.html') {
    return new Promise(async resolve => {
      console.log('---->', file, dir);
      await getPageContent(file, dir);
      resolve();
    });
  }
  return new Promise(resolve => { resolve() });
}

/**
 *  Process the page
 */
async function buildPage() {
  const headless = true;
  const server = await startServer(headless);
  await processPage();
  await server.close();
  process.exit();
}

/** ** COMMAND BUILD */

/**
 * @param {object} files - files to be processed
 * @param {string} dir - directory to be processed
 */
function processFiles(files, dir = '') {
  return new Promise(async (resolve, reject) => {
    const notProcessPaths = ['assets', 'components', 'css', 'js', 'json', 'node_modules'];
    const filePromises = [];
    const fileList = [];
    for (const file of files) {
      console.log(file);
      if (fs.lstatSync(path.join(workDir, dir, file)).isDirectory()) {
        if (!notProcessPaths.includes(file)) {
          await processPath(path.join(workDir, file), file);
        }
      } else if (path.extname(file) === '.html' && dir !== 'templates') {
        fileList.push(file);
        FilesLIST.push(path.join(dir, file));
        filePromises.push(processPage(file, dir));
      }
    };
    console.log(filePromises);

    Promise.all(filePromises)
      .then(() => {
        console.log(`Procesados ${fileList.join(', ')}`);
        resolve();
      }).catch((err) => {
        console.log(err);
        reject(err);
      });
    console.log('LLEGAMOS AQUI');
  });
}

/**
 *
 */
function prepareDist() {
  return new Promise(async resolve => {
    if (fs.existsSync(distdir)) {
      fs.rmSync(distdir, { recursive: true });
      console.log(`${distdir} is deleted!`);
    }
    console.log(distdir);
    fs.mkdirSync(distdir);
    console.log(`Creado ${distdir}...`);

    const excludeDirs = ['node_modules', 'json', 'components', 'templates', 'pages'];
    const srcDirs = fs.readdirSync(workDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    const distDirs = srcDirs.filter(dir => !excludeDirs.includes(dir));
    distDirs.forEach((dir) => {
      console.log(path.join(distdir, dir));
      fs.mkdirSync(path.join(distdir, dir));
    });
    resolve();
  });
}

/**
 * @param {string} dir - work directory to be processed
 * @param {string} complementPath - to complement the path
 * @returns {Promise<void>}
 */
function processPath(dir = workDir, complementPath = '') {
  // const distPath = path.join(distdir, complementPath);
  return new Promise(async resolve => {
    const files = fs.readdirSync(dir, { encoding: 'utf8' });
    await processFiles(files, complementPath);
    resolve();
  });
}

/**
 *  Build the site
 */
async function build() {
  const headless = true;
  const server = await startServer(headless);
  await prepareDist();
  await processPath();
  await server.close();
  process.exit();
}

/** ***COMMAND ENV-VARS */

/**
 * @param {string} key - key to be processed
 * @param {string} value - value to be replaced
 */
function replaceEnvVar(key, value) {
  return new Promise(resolve => {
    const jsdistdir = path.join(distdir, 'js');
    const files = fs.readdirSync(jsdistdir, { encoding: 'utf8' });
    files.forEach(file => {
      const filePath = path.join(jsdistdir, file);
      const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
      const newContent = fileContent.replace(new RegExp(key, 'g'), value);
      if (fileContent !== newContent) {
        console.log(`Reemplazando ${key} por ${value} en ${filePath}`);
        fs.writeFileSync(filePath, newContent);
      }
    });
    resolve();
  });
}

/**
 *  Process the env vars
 */
function processEnvVars() {
  console.log('-----------------------------------');
  const keys = Object.keys(process.env);
  keys.forEach(key => {
    if (key.startsWith('CHANGE_VAR')) {
      console.log(key, process.env[key]);
      const [alias, value] = process.env[key].split('|');
      replaceEnvVar(alias, value);
    }
  });
}

/**
 * 
 */
function envVars() {
  processEnvVars();
  process.exit();
}

/** ***CREATE PWA */

/**
 * @returns {Array} - Array of files
 */
function getFilesToCache() {
  if (fs.existsSync(distdir)) {
    const distPath = path.join(distdir, 'es');
    const files = fs.readdirSync(distPath, { encoding: 'utf8' });
    let filesStr = ["'index.html'"];
    const languagesArr = getLanguagesDir();
    languagesArr.forEach((lang) => {
      console.log(lang);
      const filesTmp = files.map((file) => `'/${lang}/${file}'`);
      filesStr = [...filesStr, ...filesTmp];
    });
    return filesStr;
  }
  console.log('"dist" dir doesn\'t exists');
  return [];
}

/**
 * @param {string} swFileName - name of the sw file
 * @returns {Promise<void>}
 */
function saveSwFile(swFileName) {
  const swCode = /* html */`
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('${swFileName}').then((registration) => {
    console.log('ServiceWorker registration successful with scope:', registration.scope);
  }).catch((error) => {
    console.log('ServiceWorker registration failed:', error);
  });
}
  `;
  const commonJSFile = path.join(distdir, 'js', 'index.js');
  let message = 'created sw.js';
  let result = true;

  return new Promise((resolve) => {
    fs.access(commonJSFile, fs.F_OK, (err) => {
      if (err) {
        console.log(err);
        result = false;
        message = 'common.js doesn\'t exits';
      } else {
        const commonContent = fs.readFileSync(commonJSFile, 'utf8');
        const commonOutput = `
          ${commonContent}
          ${swCode}
        `;
        fs.writeFileSync(commonJSFile, commonOutput);
      }
      console.log(message);
      resolve(result);
    });
  });
}

/**
 *
 */
async function prepareServiceWorker() {
  // CREO LA LISTA DE FICHEROS .html A CACHEAR, BUSCANDO EN UNA CARPETA DE IDIOMAS
  const _FilesLIST = getFilesToCache();
  if (_FilesLIST.length > 0) {
    process.exit();
  }
  // CALCULO NOMBRE DE sw.js EN BASE A DIA/HORA
  const date = new Date();
  const marcaDiaHora = `${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}`;
  const swFileName = `sw${marcaDiaHora}.js`;

  // INYECTO EL CODIGO QUE INSTANCIA EL sw EN common.js ANTES DE QUE SEA MINIFICADO
  const insertedCommon = await saveSwFile(swFileName);

  if (insertedCommon) {
    // COPIO EL FICHERO sw.js EN dist RENOMBRANDOLO A 'sw_DIA/HORA.js'
    const swContentBase = fs.readFileSync(path.join(__dirname, '..', '_base', 'sw.js'), 'utf-8');
    const swContent = swContentBase.replace('/**URLS_CACHED**/', _FilesLIST.toString());
    fs.rm(path.join(distdir, 'js', 'sw*.js'));
    fs.writeFileSync(path.join(distdir, 'js', swFileName), swContent);
  }
}

/**
 *
 */
async function pwa() {
  await prepareServiceWorker();
  process.exit();
}

/** ***COMMAND CREATE-PAGE */

/**
 * @param {Array} langArr - Array of languages
 * @param {string} alternatePageName - Name of the alternate page
 * @returns {string} - Alternate paths of the page
 */
function _getAlternates(langArr, alternatePageName) {
  const alternate = langArr.reduce((result, language) => {
    result.push(`<link rel="alternate" hreflang="${language}" href="/${language}/${alternatePageName}.html" />`);
    return result;
  }, []);
  return alternate.join('\n');
}

/**
 * @param {string} scafoldingLanguages - languages scafolding separated by comma
 * @param {string} origin - path of the origin page
 * @param {string} pageDir - path of the page directory
 */
function createScafoldingLanguages(scafoldingLanguages, origin, pageDir) {
  const pageNameWithoutExtension = (path.extname(pageName) === '.html') ? `${pageName.replace('.html', '')}` : pageName;
  const langArr = scafoldingLanguages.split(',');
  langArr.forEach(lang => {
    fs.copyFileSync(path.join(origin, '_base.html'), path.join(pageDir, lang, `${pageNameWithoutExtension}.html`));
    const pathFileName = path.join(pageDir, lang, `${pageNameWithoutExtension}.html`);
    let content = fs.readFileSync(pathFileName, 'utf8');
    content = content.replace(/_base/gm, pageNameWithoutExtension);
    content = content.replace(/lang="es"/, `lang="${lang}"`);
    content = content.replace(/<!-- __ALTERNATES__ -->/, _getAlternates(langArr, pageNameWithoutExtension));
    fs.writeFileSync(pathFileName, content);
  });
}

/**
 *  Create the languages directory
 * 
 * @param {string} _languages - languages separated by comma
 */
function createLanguagesDir(_languages = '') {
  return new Promise(resolve => {
    if (_languages !== '') {
      const langArr = _languages.split(',');
      langArr.forEach(lang => {
        const langDir = path.join(workDir, 'src', lang);
        if (!fs.existsSync(langDir)) {
          fs.mkdirSync(langDir);
        }
        console.log(`${chalk.bold(chalk.green(`Creado ${langDir}...`))}`);
      });
    }
    resolve();
  });
}

/**
 *  Create the languages directory
 * 
 * @param {string} _pageName - name of the page
 * @param {string} pageDir - path to the page
 */
async function createPage(_pageName = '', pageDir = workDir) {
  const questionPageName = `Enter page name: `;
  if (_pageName === '') {
    const responsePageName = await answerThisQuestion(questionPageName);
    pageName = responsePageName;
    console.log('page name', responsePageName);
  }



  // const directories = new Map();
  // directories.set(path.join(pageDir,'css'), 1);
  // directories.set(path.join(pageDir,'js'), 1);
  // directories.set(path.join(pageDir,'js', 'pages'), 2);
  // // directories.set(path.join(pageDir,'js', 'tpl'), 2);
  // directories.set(path.join(pageDir,'json'), 1);

  // languages = getLanguagesDir().join(',');
  // if (languages.length > 0) {
  //   const langArr = languages.split(',');
  //   langArr.forEach(lang => {
  //     directories.set(path.join(pageDir, lang), 2);
  //   });
  // }
  // for (const dir of directories) {
  //   createDir(dir);
  // }
}

/**
 *  Create the page and its files
 * 
 * @param {string} _pageName - name of the page
 * @param {string} pageDir - path to the page
 */
function createPageAndFiles(_pageName = '', pageDir = workDir) {
  const pageNameWithoutExtension = _pageName.replace(path.extname(_pageName), '');
  const origin = path.join(__dirname, '..', '_base');
  const filesToProcess = [
    { 'filename': '_base.js', 'path': 'js', 'output': `${pageNameWithoutExtension}.js` },
    { 'filename': '_base.html.mjs', 'path': path.join('js', 'pages'), 'output': `${pageNameWithoutExtension}.html.mjs` },
    { 'filename': '_base.css', 'path': 'css', 'output': `${pageNameWithoutExtension}.css` },
    { 'filename': '_base.json.js', 'path': 'json', 'output': `${pageNameWithoutExtension}.json.js` }
  ];
  if (languages !== '') {
    const langArr = languages.split(',');
    if (langArr.length > 0) {
      langArr.forEach(lang => {
        filesToProcess.push({ 'filename': '_base.html', 'path': '.', 'output': `${lang}/${pageNameWithoutExtension}.html` });
      });
    }
  }
  if (pageNameWithoutExtension === 'index' || languages === '') {
    filesToProcess.push({ 'filename': '_base.html', 'path': '.', 'output': `${pageNameWithoutExtension}.html` });
  }

  for (const file of filesToProcess) {
    fs.copyFileSync(path.join(origin, file.path, file.filename), path.join(pageDir, file.path, file.output));
    const pathFileName = path.join(pageDir, file.path, file.output);
    let content = fs.readFileSync(pathFileName, 'utf8');
    content = content.replace(/_base/gm, pageNameWithoutExtension);
    fs.writeFileSync(pathFileName, content);
  }

  let content = fs.readFileSync(path.join(pageDir, 'json', `${pageNameWithoutExtension}.json.js`), 'utf8');
  content = content.replace(/_base/gm, pageNameWithoutExtension);
  fs.writeFileSync(path.join(pageDir, 'json', `${pageNameWithoutExtension}.json.js`), content);
  console.log(`\n\nPage "${pageDir}/${pageName}" and its js,css and json files related was created`);
}

/** *** COMMAND CREATE-WC */

/**
 * @param {string} componentDir - path to the component
 */
function createWc(componentDir = workDir) {
  const componentsDir = path.join(componentDir, 'components');
  const wcDir = path.join(componentsDir, wcName);
  shell.cd(componentsDir);
  shell.mkdir(wcDir);
  const directories = new Map();
  directories.set(path.join(wcDir, 'demo'), 1);
  directories.set(path.join(wcDir, 'src'), 1);
  directories.set(path.join(wcDir, 'test'), 1);

  console.log('\n\nWeb-Component created');
  console.log(`\n${componentDir}/${wcName}`);
  for (const dir of directories) {
    createDir(dir);
  }
  console.log('\n\n');

  WcName = wcName
    .split("-")
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  const wcNameParts = wcName.split("-");
  const wcNamePartsChars = [...wcNameParts[1]];
  wcNamePartsChars[0] = wcNamePartsChars[0].toUpperCase();
  wc_Name = wcNameParts[0] + wcNamePartsChars.join('');


  const originWc = path.join(__dirname, '..', '_wc-base');
  const filesToProcess = [
    { 'filename': '_gitignore', 'path': '.', 'output': '.gitignore' },
    { 'filename': 'wc-name.js', 'path': '.', 'output': `${wcName}.js` },
    { 'filename': 'wc-name.test.js', 'path': 'test', 'output': `${wcName}.test.js` },
    { 'filename': 'WcName.js', 'path': 'src', 'output': `${WcName}.js` },
    { 'filename': 'wc-name-style.js', 'path': 'src', 'output': `${wcName}-style.js` },
    { 'filename': 'babel.config.js', 'path': '.', 'output': 'babel.config.js' },
    { 'filename': 'index.html', 'path': '.', 'output': 'index.html' },
    { 'filename': 'LICENSE', 'path': '.', 'output': 'LICENSE' },
    { 'filename': 'package.json', 'path': '.', 'output': 'package.json' },
    { 'filename': 'README.md', 'path': '.', 'output': 'README.md' },
  ];
  for (const file of filesToProcess) {
    fs.copyFileSync(path.join(originWc, file.path, file.filename), path.join(wcDir, file.path, file.output));
    const pathFileName = path.join(wcDir, file.path, file.output);
    let content = fs.readFileSync(pathFileName, 'utf8');
    content = content.replace(/wc-name/gm, wcName);
    content = content.replace(/WcName/gm, WcName);
    content = content.replace(/wcName/gm, wc_Name);
    fs.writeFileSync(pathFileName, content);
  }
}

/** * COMMAND SCAFOLDING */

/**
 * @param {string} cmd - Command to execute
 * @param {Array} _params - Parameters to pass to the command
 */
function executeCommand(cmd, _params = '') {
  return new Promise((resolve) => {
    console.log(cmd, _params);
    const params = (Array.isArray(_params)) ? _params : [_params];
    spawnSync(cmd, params, { cwd: process.cwd(), detached: true, stdio: 'inherit' });
    resolve();
  });
}

/**
 *
 */
async function createScafolding() {
  shell.cd(workDir);

  // CREATE DIRECTORIES
  const directories = new Map();
  directories.set(path.join(workDir, 'resources'), 1);
  directories.set(path.join(workDir, 'src'), 1);
  directories.set(path.join(workDir, 'src', 'assets'), 2);
  directories.set(path.join(workDir, 'src', 'assets', 'fonts'), 3);
  directories.set(path.join(workDir, 'src', 'assets', 'images'), 3);
  directories.set(path.join(workDir, 'src', 'components'), 2);
  directories.set(path.join(workDir, 'src', 'css'), 2);
  directories.set(path.join(workDir, 'src', 'js'), 2);
  directories.set(path.join(workDir, 'src', 'js', 'lib'), 3);
  directories.set(path.join(workDir, 'src', 'js', 'pages'), 3);
  // directories.set(path.join(workDir, 'src', 'js', 'tpl'), 3);
  directories.set(path.join(workDir, 'src', 'json'), 2);
  directories.set(path.join(workDir, 'src', 'templates'), 2);
  if (languages !== '') {
    const langArr = languages.split(',');
    langArr.forEach(lang => {
      directories.set(2, path.join(workDir, 'src', lang));
    });
  }
  console.log(`\n\nSite structure created for: ${siteName}`);
  for (const dir of directories) {
    createDir(dir);
  }
  console.log('\n\n');

  // COPY FILES
  const filesToProcess = [
    { 'filename': '_eslintignore', 'path': 'src', 'output': '.eslintignore' },
    { 'filename': '_eslintrc.json', 'path': 'src', 'output': '.eslintrc.json' },
    { 'filename': '_gitignore', 'path': '.', 'output': '.gitignore' },
    { 'filename': 'README.md', 'path': '.', 'output': 'README.md' },
    { 'filename': 'package.json', 'path': 'src', 'output': 'package.json' },
    { 'filename': 'rollup.config.js', 'path': 'src', 'output': 'rollup.config.js' },
    { 'filename': 'vite.config.mjs', 'path': 'src', 'output': 'vite.config.mjs' },
    { 'filename': 'common.html.mjs', 'path': path.join('src', 'js', 'pages'), 'output': 'common.html.mjs' },
    { 'filename': 'main.css', 'path': path.join('src', 'css'), 'output': 'main.css' },
    { 'filename': 'language.js', 'path': path.join('src', 'js', 'lib'), 'output': 'language.js' },
    { 'filename': 'common.js', 'path': path.join('src', 'js', 'lib'), 'output': 'common.js' },
    { 'filename': 'login.js', 'path': path.join('src', 'js', 'lib'), 'output': 'login.js' },
    { 'filename': 'modal.js', 'path': path.join('src', 'js', 'lib'), 'output': 'modal.js' },
    { 'filename': 'wabuse.png', 'path': path.join('src', 'assets', 'images'), 'output': 'wabuse.png' },
    { 'filename': 'favicon.png', 'path': '.', 'output': 'favicon.png' },
    { 'filename': 'header.tpl.html', 'path': path.join('src', 'templates'), 'output': 'header.tpl.html' },
    { 'filename': 'footer.tpl.html', 'path': path.join('src', 'templates'), 'output': 'footer.tpl.html' },
    { 'filename': 'head.tpl.html', 'path': path.join('src', 'templates'), 'output': 'head.tpl.html' },
    { 'filename': 'header.json.js', 'path': path.join('src', 'json'), 'output': 'header.json.js' },
    { 'filename': 'footer.json.js', 'path': path.join('src', 'json'), 'output': 'footer.json.js' },
  ];
  for (const file of filesToProcess) {
    fs.copyFileSync(path.join(__dirname, '..', '_site-base', file.filename), path.join(workDir, file.path, file.output));
  }
  let contentCommon = fs.readFileSync(path.join(workDir, path.join('src', 'js', 'pages'), 'common.html.mjs'), 'utf8');
  contentCommon = contentCommon.replace(/_base/gm, 'siteName');
  fs.writeFileSync(path.join(workDir, path.join('src', 'js', 'pages'), 'common.html.mjs'), contentCommon);

  // USER
  const questionUser = `Enter github user? (${chalk.cyan('anonymous')})  `;
  const user = await answerThisQuestion(questionUser, 'anonymous');
  console.log(`${chalk.bold(chalk.green(`User: ${user}`))}`);

  // LICENSE
  const questionLicense = `Enter license? (${chalk.cyan('Apache-2.0')})  `;
  const responseLicense = await answerThisQuestion(questionLicense, 'Apache-2.0');
  console.log(`${chalk.bold(chalk.green(`License: ${responseLicense}`))}`);

  // DESCRIPTION
  const questionDescription = `Enter description (${chalk.cyan('My Wabuse SSG site')})?  `;
  let reponseDescription = await answerThisQuestion(questionDescription, 'My Wabuse SSG site');
  console.log(`${chalk.bold(chalk.green(`Description: ${reponseDescription}`))}`);

  // KEYWORDS
  const questionKeywords = `Enter keywords separated by commas (${chalk.cyan('wabuse,ssg,static site generator')})?  `;
  let responseKeywords = await answerThisQuestion(questionKeywords, 'wabuse,ssg,static site generator');
  console.log(`${chalk.bold(chalk.green(`Keywords: ${responseKeywords}`))}`);

  // FIX package.json
  let contentPackage = fs.readFileSync(path.join(workDir, 'src', 'package.json'), 'utf8');
  contentPackage = contentPackage.replace(/__SITENAME__/gm, siteName);
  contentPackage = contentPackage.replace(/__USER__/gm, user);
  contentPackage = contentPackage.replace(/__DESCRIPTION__/gm, reponseDescription);
  contentPackage = contentPackage.replace(/__REPONAME__/gm, siteName);
  contentPackage = contentPackage.replace(/__LICENSE__/gm, responseLicense);
  contentPackage = contentPackage.replace(/__KEYWORDS__/gm, responseKeywords);
  fs.writeFileSync(path.join(workDir, 'src', 'package.json'), contentPackage);

  // COPY files
  fs.copyFileSync(path.join(__dirname, '..', '_site-base', 'start-server.mjs'), path.join(workDir, 'src', 'start-server.mjs'));

  // CREATE LANGUAGE DIRECTORIES
  languages = '';
  if (!yes) {
    const questionLang = `Enter languages separated by commas o empty by default language? (${chalk.cyan('es,en')})  `;
    languages = await answerThisQuestion(questionLang, 'es,en');
    console.log(`${chalk.bold(chalk.green(`languages: ${languages}`))}`);
  }
  await createLanguagesDir(languages);

  pageName = 'index';
  await createPageAndFiles(pageName, path.join(workDir, 'src'));
  // createPage(pageName, path.join(workDir, 'src'));

  // CREATE Web-Component
  let responseWC = '';
  if (!yes) {
    const questionWC = `Do you want to create a sample web-component with lit? (y/${chalk.cyan('N')})  `;
    responseWC = await answerThisQuestion(questionWC);
  }
  if (responseWC.toUpperCase() === 'Y' || responseWC.toUpperCase() === 'YES' || yes) {
    wcName = 'sample-component';
    createWc(path.join(workDir, 'src'));
  }

  // INSTALL DEPENDENCIES
  const { devDependencies, dependencies } = getPackageDependencies();
  const questionFButilsDeps = `Do you want to install firebase-utils components? (y/${chalk.cyan('N')})  `;
  let responseFButilsDeps = '';
  if (!yes) {
    responseFButilsDeps = await answerThisQuestion(questionFButilsDeps);
  }
  if (responseFButilsDeps.toUpperCase() === 'Y' || responseFButilsDeps.toUpperCase() === 'YES' || yes) {
    dependencies.push('@firebase-utils/firebase-loginbutton');
    dependencies.push('@firebase-utils/firebase-crud');
    // ADD IMPORTS FIREBASE-UTILS TO common.js
    const commonJSFilePath = path.join(workDir, path.join('src', 'js', 'lib'), 'common.js');
    let contentCommon = fs.readFileSync(commonJSFilePath, 'utf8');
    contentCommon = contentCommon.replace(/\/\/ __IMPORTS__/gm, "// firebase-utils web-components\nimport '@firebase-utils/firebase-loginbutton';\nimport '@firebase-utils/firebase-crud';\n\n");
    const response = fs.writeFileSync(commonJSFilePath, contentCommon);
    console.log('common.js updated.');
  } else {
    // REMOVE IMPORTS FIREBASE-UTILS FROM common.js
    let contentCommon = fs.readFileSync(path.join(workDir, path.join('src', 'js', 'lib'), 'common.js'), 'utf8');
    contentCommon = contentCommon.replace(/\/\/__IMPORTS__/gm, "");
    fs.writeFileSync(path.join(workDir, path.join('src', 'js', 'lib'), 'common.js'), contentCommon);
  }

  createScafoldingLanguages(languages, path.join(__dirname, '..', '_base'), path.join(workDir, 'src'));

  // INSTALL DEPENDENCIES
  let responseDependencies = '';
  if (!yes) {
    const question = `Do you want to execute 'npm install'? (y/${chalk.cyan('N')})`;
    responseDependencies = await answerThisQuestion(question, 'n');
  }
  if (responseDependencies.toUpperCase() === 'Y' || responseDependencies.toUpperCase() === 'YES' || yes) {
    shell.cd(path.join(workDir, 'src'));
    await executeCommand('npm', ['install', '--save-dev', ...devDependencies]);
    // shell.cd(path.join(workDir,'src'));'
    await executeCommand('npm', ['install', '--save', ...dependencies]);

    // GENERATE .vscode/settings.json
    const vscodeSettings = generateVSColor();
    createDir([path.join(workDir, '.vscode'), 1]);
    fs.writeFileSync(path.join(workDir, '.vscode', 'settings.json'), JSON.stringify(vscodeSettings, null, 2));
  } else {
    // ADD DEPENDENCIES INTO package.json
    const packageJson = JSON.parse(fs.readFileSync(path.join(workDir, 'src', 'package.json'), 'utf8'));
    packageJson.devDependencies = devDependencies.reduce((result, dep) => {
      result[dep] = '*';
      return result;
    }
      , {});
    packageJson.dependencies = dependencies.reduce((result, dep) => {
      result[dep] = '*';
      return result;
    }
      , {});
    fs.writeFileSync(path.join(workDir, 'src', 'package.json'), JSON.stringify(packageJson, null, 2));

  }
}

const fn = {
  'create-page': createPage,
  'build': build,
  'build-page': buildPage,
  'create-wc': createWc,
  'scafolding': createScafolding,
  'pwa': pwa,
  'env-vars': envVars,
  'image-performance': imagePerformance
};

/* ********************************************************************************************************************* */

/**
 *
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
