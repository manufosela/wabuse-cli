const devDependencies = [
  "@babel/core",
  "@babel/plugin-proposal-decorators",
  "@babel/plugin-transform-class-properties",
  "@webcomponents/webcomponentsjs",
  "@open-wc/eslint-config",
  "chai",
  "eslint",
  "eslint-config-airbnb-base",
  "eslint-config-node",
  "eslint-config-prettier",
  "eslint-plugin-jsdoc",
  "eslint-plugin-lit",
  "eslint-plugin-lit-a11y",
  "eslint-plugin-markdown",
  "eslint-plugin-node",
  "eslint-plugin-prettier",
  "eslint-plugin-wc",
  "get-port",
  "lit-analyzer",
  "rollup",
  "@rollup/plugin-babel",
  "rollup-plugin-copy",
  "rollup-plugin-multi-input",
  "@rollup/plugin-node-resolve",
  "@rollup/plugin-terser",
  "vite",
  "vite-plugin-full-reload",
  "@wabuse/wabuse",
];

let dependencies = [
  "header-logomenu",
  "lit"
];

const firebaseUtilsDependencies = [
  "@firebase-utils/firebase-crud",
  "@firebase-utils/firebase-loginbutton"
];

/**
 * Get the dependencies for the package
 * @returns {Object} devDependencies and dependencies
 * @example
 * const { devDependencies, dependencies } = getPackageDependencies();
 * console.log(devDependencies);
 */
export function getPackageDependencies() {
  return { devDependencies, dependencies };
}

