const { getPackagesDependencies } = require('../lib/packages-json.js');
const { devPackages, packages } = getPackagesDependencies();
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function checkPackages(currentWorkDir) {
  return new Promise((resolve, reject) => {
    const devPackagesJson = [];
    const packagesJson = [];

    console.log('Obteniendo las últimas versiones de los paquetes de devDepencies...');
    packages.forEach(pkg => {
      try {
        const latestVersion = execSync(`npm view ${pkg} version`).toString().trim();
        packagesJson.push(`"${pkg}": "${latestVersion}"`);
        console.log(`Encontrada versión de ${pkg}@${latestVersion}`)
      } catch (err) {
        console.error(`Error al obtener la última versión de ${pkg}: ${err.message}`);
        reject();
      }
    });

    console.log('Obteniendo las últimas versiones de los paquetes de depencies...');
    devPackages.forEach(pkg => {
      try {
        const latestVersion = execSync(`npm view ${pkg} version`).toString().trim();
        devPackagesJson.push(`"${pkg}": "${latestVersion}"`);
        console.log(`Encontrada versión de ${pkg}@${latestVersion}`)
      } catch (err) {
        console.error(`Error al obtener la última versión de ${pkg}: ${err.message}`);
        reject();
      }
    });

    const packageJsonPath = path.join(currentWorkDir, 'src', 'package.json');

    fs.readFile(packageJsonPath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error al leer el archivo ${packageJsonPath}: ${err}`);
        reject();
      }

      const devDepsRegex = /"devDependencies":\s*{[^}]*}/s;
      const depsRegex = /"dependencies":\s*{[^}]*}/s;
      const newDevDeps = `"devDependencies": {
        ${devPackagesJson.join(',\n    ')}
      }`;
      const newDeps = `"dependencies": {
        ${packagesJson.join(',\n    ')}
      }`;
      const newData = data.replace(devDepsRegex, newDevDeps);
      const newData2 = newData.replace(depsRegex, newDeps);

      // Escribir los cambios al archivo
      fs.writeFile(packageJsonPath, newData2, 'utf8', (err2) => {
        if (err2) {
          console.error(`Error al escribir en el archivo ${packageJsonPath}: ${err2}`);
          reject();
        }
        console.log(`Se ha actualizado la sección "devDependencies" y "depencies" en el archivo ${packageJsonPath}`);
        resolve();
      });
    });
  });
}
exports.checkPackages = checkPackages;








