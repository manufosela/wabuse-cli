import readline from 'readline';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

/**
 * Asks a question in the console and returns the user's response.
 * @param {string} question - The question to display to the user.
 * @param {string} [defaultValue=''] - The default value to return if the user provides no response.
 * @returns {Promise<string>} - A promise that resolves with the user's response or the default value.
 */
export function answerThisQuestion(question, defaultValue = '') {
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
      process.exit(0);
    });
  });
}

/**
 * Logs an error message to the console and exits the process.
 * @param {string} errorMsg - The error message to display.
 */
export function showErrorMsg(errorMsg) {
  console.error(`\nERROR - ${errorMsg}\n\n`);
  process.exit();
}

/**
 * Checks if a directory exists, creates it if it doesn't, and changes the current working directory to it.
 * @param {string} directory - The directory to check and change to.
 */
export function checkAndChangeDirectory(directory) {
  const fullPath = path.join(process.cwd(), directory);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath);
    console.log(`El directorio ${directory} no existía y ha sido creado.`);
  } else {
    console.log(`El directorio ${directory} ya existe.`);
  }
  process.chdir(fullPath);
  console.log(`Se ha cambiado el directorio de trabajo a ${fullPath}`);
}
