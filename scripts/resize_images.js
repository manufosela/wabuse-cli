const sharp = require('sharp');
const fs = require('fs');

// Obtiene la ruta de la imagen desde los argumentos de la línea de comandos
const imagePath = process.argv[2];
const imageType = process.argv[3] || 'webp';

// Define los tamaños que deseas generar
const sizes = [600, 900, 1200, 1800];
const sizes2 = ['600w', '900w', '1200w'];

// Crea una función para redimensionar la imagen y guardarla en disco
const resizeImage = async (size) => {
  const filename = imagePath.split('/').pop().split('.').slice(0, -1).join('.');
  const outputDirectory = `${imagePath.split('.').slice(0, -1).join('.')}-sizes`;
  await fs.promises.mkdir(outputDirectory, { recursive: true });
  const image = await sharp(imagePath)
    .resize({ width: size })
    .toFormat(imageType)
    .toFile(`${outputDirectory}/${filename.split('/').pop()}-${size}px.${imageType}`);
  console.log(`Resized to ${size} and converted to ${imageType}`);
  return image;
};

// Ejecuta la función para cada tamaño definido
const resizeImages = async () => {
  const promises = sizes.map((size) => resizeImage(size));
  await Promise.all(promises);
  console.log('Finished resizing images');
};

resizeImages();

// Crea la etiqueta <picture> con los diferentes tamaños de imagen
const createPictureElement = (filename, altText) => {
  const sources = sizes.map((size) => {
    const sourcePath = `${filename}-sizes/${filename}-${size}px.${imageType}`;
    const sourceSize = `${size}w`;
    return `<source srcset="${sourcePath}" sizes="${sourceSize}" type="image/${imageType}">`;
  }).join('\n');

/*
<picture>
  <source
    sizes="(min-width: 600px) 100vw, 600px,
           (min-width: 1200px) 100vw, 1200px"
    srcset="image-wide.jpg 600w,
            image-ultrawide.jpg 1200w"
    type="image/jxl">
  <source
    sizes="(min-width: 600px) 100vw, 600px,
           (min-width: 1200px) 100vw, 1200px"
    srcset="image-wide.avif 600w,
            image-ultrawide.avif 1200w"
    type="image/avif">
  <source
    sizes="(min-width: 600px) 100vw, 600px,
           (min-width: 1200px) 100vw, 1200px"
    srcset="image-wide.webp 600w,
            image-ultrawide.webp 1200w"
    type="image/webp">
  <source
    sizes="(min-width: 600px) 100vw, 600px,
           (min-width: 1200px) 100vw, 1200px"
    srcset="image-wide.jpg 600w,
            image-ultrawide.jpg 1200w"
    type="image/jpeg">
  <!-- The <img> tag is a fallback image (required in the <picture> tag) -->
  <img 
    fetchpriority="high"
    decoding="sync"
    src="image.jpg"
    height="300"
    width="200"
    alt="Awesome image">
</picture>


<picture>
  <!-- WebP format -->
  <source
    type="image/webp"
    srcset="image-small.webp 600w,
            image-medium.webp 900w,
            image-large.webp 1200w,
            image-extra-large.webp 1800w">

  <!-- JPEG format -->
  <source
    type="image/jpeg"
    srcset="image-small.jpg 600w,
            image-medium.jpg 900w,
            image-large.jpg 1200w,
            image-extra-large.jpg 1800w">

  <!-- Fallback <img> tag -->
  <img
    src="image-small.jpg"
    sizes="(max-width: 600px) 100vw,
           (max-width: 900px) 66vw,
           (max-width: 1200px) 50vw,
           45vw"
    alt="Awesome image">
</picture>

*/


  const fallbackImage = `${filename}-sizes/${filename}-${sizes[sizes.length - 1]}px.${imageType}`;
  return `
          <picture>
            ${sources}
            <img src="${fallbackImage}" alt="${altText}">
          </picture>`;
};

// Obtiene el nombre del archivo de la imagen sin la extensión
const filename = imagePath.split('/').pop().split('.').slice(0, -1).join('.');
const altText = 'Ejemplo de imagen';
const pictureElement = createPictureElement(filename, altText);
console.log(pictureElement);