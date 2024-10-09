import { describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { answerThisQuestion, showErrorMsg, checkAndChangeDirectory } from '../lib/utils';
import readline from 'readline';

describe('utils.js', () => {
  describe('answerThisQuestion', () => {
    it('should return the default value when no input is provided', async () => {
      const question = 'Enter your name: ';
      const defaultValue = 'Default Name';

      readline.createInterface().question.mockImplementationOnce((_, callback) => {
        callback('');
      });
      readline.createInterface().close.mockImplementationOnce(() => {});

      const response = await answerThisQuestion(question, defaultValue);
      expect(response).toBe(defaultValue);
    });

    it('should return the user input', async () => {
      const question = 'Enter your name: ';
      const userInput = 'John Doe';

      readline.createInterface().question.mockImplementationOnce((_, callback) => {
        callback(userInput);
      });
      readline.createInterface().close.mockImplementationOnce(() => {});

      const response = await answerThisQuestion(question);
      expect(response).toBe(userInput);
    });

    it('should exit the process on SIGINT', async () => {
      const question = 'Enter your name: ';
      const defaultValue = 'Default Name';
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {});

      const rlMock = readline.createInterface();
      rlMock.question.mockImplementationOnce(() => {});
      rlMock.on.mockImplementation((event, callback) => {
        if (event === 'SIGINT') {
          callback();
        }
      });

      const promise = answerThisQuestion(question, defaultValue);

      process.emit('SIGINT'); // Emitir SIGINT para simular la señal

      await promise;
      expect(exitSpy).toHaveBeenCalledWith(0);
    });
  });

  describe('showErrorMsg', () => {
    it('should log an error message and exit the process', () => {
      const errorMsg = 'An error occurred';
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {});

      showErrorMsg(errorMsg);

      expect(consoleSpy).toHaveBeenCalledWith(`\nERROR - ${errorMsg}\n\n`);
      expect(exitSpy).toHaveBeenCalled();
    });
  });

  describe('checkAndChangeDirectory', () => {
    it('should create the directory if it does not exist and change to it', () => {
      const directory = 'testDir';
      const fullPath = path.join(process.cwd(), directory);

      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      const mkdirSpy = vi.spyOn(fs, 'mkdirSync').mockImplementation(() => {});
      const chdirSpy = vi.spyOn(process, 'chdir').mockImplementation(() => {});

      checkAndChangeDirectory(directory);

      expect(mkdirSpy).toHaveBeenCalledWith(fullPath);
      expect(chdirSpy).toHaveBeenCalledWith(fullPath);
    });

    it('should change to the directory if it exists', () => {
      const directory = 'testDir';
      const fullPath = path.join(process.cwd(), directory);

      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      const mkdirSpy = vi.spyOn(fs, 'mkdirSync').mockImplementation(() => {});
      const chdirSpy = vi.spyOn(process, 'chdir').mockImplementation(() => {});

      checkAndChangeDirectory(directory);

      expect(mkdirSpy).not.toHaveBeenCalled();
      expect(chdirSpy).toHaveBeenCalledWith(fullPath);
    });
  });
});
