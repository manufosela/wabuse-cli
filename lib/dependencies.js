const devDependencies = [
  "@babel/core",
  "@babel/plugin-proposal-class-properties",
  "@babel/plugin-proposal-decorators",
  "@webcomponents/webcomponentsjs",
  "@web/dev-server",
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
  "rollup",
  "@rollup/plugin-babel",
  "rollup-plugin-copy",
  "rollup-plugin-multi-input",
  "@rollup/plugin-node-resolve",
  "rollup-plugin-terser",
  "@wabuse/wabuse",
];

const dependencies = [
  "lit"
];

/**
 * Get the dependencies for the package
 * @returns {Object} devDependencies and dependencies
 * @example
 * const { devDependencies, dependencies } = getPackageDependencies();
 * console.log(devDependencies);
 */
function getPackageDependencies() {
  return { devDependencies, dependencies };
}

exports.getPackageDependencies = getPackageDependencies;
