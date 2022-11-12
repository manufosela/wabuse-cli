# LiNuxt Site

LiNuxt es una herramienta para generar sites estáticos y su entorno de desarrollo utilizando los estándares HTML5, CSS, ES6+ y Web components usando la libreria LitElement.
El proyecto, una vez terminadas las tareas de construcción (build) genera páginas web estáticas con enlaces a ficheros js y css que se guardan en la carpeta `dist`.

**A destacar**

Una vez generado el site:

- No utiliza 'magia' para cargar contenidos.
- Genera 1 página html por contenido, no carga dinamicamente ningún contenido.
- Todos los archivos js y css están perfectamente referenciados en la página de manera estandar

**A tener en cuenta**

Durante el proceso de desarrollo:

- Hace carga dinámica del contenido, para facilitar el desarrollo
- Es facilmente identificable donde se encuentra cada cosa, ya que no usa librerias ni 'magia'.
- Los sites estáticos se pueden alimentar de un json de datos.
- Una vez generado el scafolding con la estructura del proyecto se puede subir a producción tal cual, sin dependencias ni requerimientos.

## Estructura del proyecto

El proyecto consta de la siguiente estructura de carpetas:

```
  |__ dist (si se ha generado la build)
  |__ recursos
  |__ src
  |   |__assets
  |   |__components
  |   |__css
  |       |__ index.css
  |       |__ main.css
  |   |__js
  |   |   |__lib
  |   |   |__pages
  |   |       |__ index.html.mjs
  |   |   |__tpl
  |   |       |__ index.tpl.js
  |   |__json
  |__ index.html
```

### Carpeta `dist`

Carpeta que se genera en el proceso de `build` y que contiene todos los archivos que se subiran a producción.

### Carpeta `resources`

Carpeta donde almacenamos los ficheros como robots.txt y sitemap.xml, que luego se copiarán en la carpeta dist en el proceso de build.

### Carpeta `src`. Codigo fuente

El código fuente se organiza en la carpeta `src`. Dentro de esta, existen diferentes subcarpetas por funcionalidad:

1. `assets`: contiene fuentes e imagenes

2. `components`: contiene el código de todos los Web components realizados con `lit-element`.

3. `css`: contiene todo el css dividido por estilos relativos a cada página HTML con el mismo nombre. Y donde será necesario utilizar la metodología BEM para crear el css. Además hay un fichero main.css que contiene toda la parte común de las paǵinas (grid, fuentes, tamaños...)

4. `js`: contiene todo el código JS. A nivel raiz se encuentra un fichero js por cada página. Además se organiza en subcarpetas que contienen las plantillas y los string literals del js para generar el contenido.

5. `json`: contiene el contenido de las páginas en formato json.js generado por `strapi`

## Generar scafolding de una nueva página

Para generar una nueva página en blanco se ejecuta el comando **create-page** de `linuxt`

```
$ linuxt create-page HTML-PAGE-NAME
```

Esto genera el scafolding completo de una páginas por idioma, con todos los ficheros necesarios para su correcto funcionamiento.

## Generar scafolding de un nuevo componente

Para generar un nuevo web-component al que añadir la maquetación y funcionalidad se ejecuta el comando generate-wc de `linuxt`

```
$ linuxt generate-wc WEB-COMPONENT-NAME
```

Esto genera el scafolding completo de un web-component, con sus tareas de construcción y carpetas de demo y test, para que posteriormente si se desea, se pueda publicar en un cátalogo de componentes
