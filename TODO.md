# TO DO

## Rename this tool

Opciones:

- Wabuse: Web applications built using standards everywhere
- YADF: Yes, Another Damn Framework
- YAFF: Yes, Another Fantastic Framework

## COLORS

- colores: #582546 #f2cd00 #7a7e80
- colores: #C3C9CC #7F8385 #434546 #B5C8D7 #DAF1F4
- colores: #1F3F43 #314F52 ?

## Actions to do

DONE! - Simplificar cada página, eliminando la carpeta **tpl** e incluyendo ese código en los ficheros de **page**

DONE! - Cambiar es-dev-server por vite

DONE! - Añadir los scripts de login.js y modal.js a /js/lib

DONE! - Dar opción de instalar firebase

- Pasar el proyecto de CJS a ESM

- Rehacer el scafolding de la arquitectura del proyecto. Que haya una carpeta por idioma en raiz quizás no sea lo más adecuado. Pero dentro de **pages** solo deben ir las paginas js dinamicas en desarrollo. A lo mejor dos tipos de directorios pages y pages-static. Quizás esta estructura:
  |___dist
  |___src
    |___assets
        |___fonts
        |___images
    |___components
    |___css
    |___js
        |___lib
        |___pages
    |___json
    |___templates
    |___pages
        |___index
          |___index.html
          |___index.html.mjs
          |___index.js
          |___index.css
        |___empleo
          |___empleo.html
          |___empleo.html.mjs
          |___empleo.js
          |___empleo.css
        |___proyectos
          |___proyectos.html
          |___proyectos.html.mjs
          |___proyectos.js
          |___proyectos.css
    |___index.html

- Revisar el resto de scafoldings

- Optimizar las imagenes usando <picture> y redimensionando las imagenes con el tamaño adecuado para cada dispositivo.

- Añadir tests y vitests para las pruebas unitarias

- Añadir boton de login con firebase en index.html.js si instala firebase

## TO STUDY

- Dar la posibilidad de hacer la aplicación PWA, pero cargando el HTML que reemplaza el tag &lt;main&gt;. Se diseñarían las paginas igual, pero con menos HTML y habría carga dinámica de dichas páginas.
