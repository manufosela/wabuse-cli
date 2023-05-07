/**
 * Función que genera un color hexadecimal aleatorio
 * 
 * @returns {string} Color hexadecimal aleatorio
 */
function generarColorContraste() {
  // Se genera un número aleatorio para cada componente RGB
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  // Se calcula el valor de luminosidad relativa (L) según la fórmula de la W3C
  const luminosidad = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  // Se determina si el color es oscuro o claro según su luminosidad relativa
  const esOscuro = luminosidad < 0.5;

  // Se devuelve el color con el formato #RRGGBB
  return `#${  [r, g, b]
    .map(c => c.toString(16).padStart(2, '0'))
    .join('')
     }${esOscuro ? 'FF' : '00'}`;
}

// Variables de configuración de colores en settings.json
const settings = {
  "workbench.colorCustomizations": {
    "activityBar.background": "#0F7900",
    "titleBar.activeBackground": "#939393",
    "titleBar.activeForeground": "#F9FAFA",
    "titleBar.inactiveBackground": "#FFFFFF",
    "titleBar.inactiveForeground": "#F00",
    "activityBar.foreground": "#FFFFFF",
    "activityBar.dropBackground": "#FFFFFF",
    "activityBar.border": "#FFFFFF",
    "activityBar.button.background": "#FFFFFF",
    "activityBar.button.hoverBackground": "#FFFFFF",
    "activityBar.button.activeBackground": "#FFFFFF",
    "activityBar.dropBorder": "#FFFFFF",
    "activityBar.activeBorder": "#FFFFFF",
    "activityBar.inactiveForeground": "#FFFFFF",
    "activityBar.activeForeground": "#FFFFFF"
  }
};

/**
 *  Función que genera un color hexadecimal aleatorio y lo devuelve en formato JSON
 * 
 * @returns {json} Color hexadecimal aleatorio en formato JSON
 */
function generateVSColor() {
  // eslint-disable-next-line no-restricted-syntax
  for (const option in settings["workbench.colorCustomizations"]) {
    if (Object.prototype.hasOwnProperty.call(settings["workbench.colorCustomizations"], option)) {
      settings["workbench.colorCustomizations"][option] = generarColorContraste();
    }
  }
  return settings;
}

exports.generateVSColor = generateVSColor;
