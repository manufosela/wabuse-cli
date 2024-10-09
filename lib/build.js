import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { startServer } from './server.js';

/**
 * Get the content of the page
 * @param {string} file - File to process
 * @param {string} distPath - Path to the dist directory
 * @returns {Promise<void>}
 */
async function getPageContent(file, distPath = '') {
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
 * Process the page
 * @param {string} file - File to process
 * @param {string} dir - Directory to process
 * @returns {Promise<void>}
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
 * Build the page
 */
async function buildPage() {
  const headless = true;
  const server = await startServer(headless);
  await processPage();
  await server.close();
  process.exit();
}

/**
 * Prepare the dist directory
 * @returns {Promise<void>}
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
 * Process the path
 * @param {string} dir - Directory to process
 * @param {string} complementPath - Complement path
 * @returns {Promise<void>}
 */
function processPath(dir = workDir, complementPath = '') {
  return new Promise(async resolve => {
    const files = fs.readdirSync(dir, { encoding: 'utf8' });
    await processFiles(files, complementPath);
    resolve();
  });
}

/**
 * Process the files
 * @param {Array<string>} files - Files to process
 * @param {string} dir - Directory to process
 * @returns {Promise<void>}
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
    }

    Promise.all(filePromises)
      .then(() => {
        console.log(`Procesados ${fileList.join(', ')}`);
        resolve();
      }).catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}

/**
 * Build the site
 */
async function build() {
  const headless = true;
  const server = await startServer(headless);
  await prepareDist();
  await processPath();
  await server.close();
  process.exit();
}

export {
  buildPage,
  build,
};
