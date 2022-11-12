import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';
import multiInput from 'rollup-plugin-multi-input';
import {
  terser
} from 'rollup-plugin-terser';

export default {
  preserveSymlinks: true,
  input: ['../src/js/*.js'],
  output: {
    dir: '../dist/js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    resolve(),
    babel(),
    multiInput({ relative: 'js/' }),
    terser({
      output: {
        comments: false,
      },
    }),
    copy({
      targets: [{
        src: 'favicon.png',
        dest: '../dist'
      },
      {
        src: 'assets/**/*',
        dest: '../dist/assets'
      },
      {
        src: 'css/**/*',
        dest: '../dist/css'
      },
      {
        src: 'json/**/*',
        dest: '../dist/json'
      }]
    })
  ]
};