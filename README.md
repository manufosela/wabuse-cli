# wabuse

**[wabuse](https://www.npmjs.com/package/wabuse)** is a set of tools to create static sites using standard javascript.
Web Applications Built Using Standards Everywhere Tool
Generate static web pages with links to js and css files that are stored in the `dist` folder.
Oriented to HTML5, CSS, ES6 + and Web components standards through Lit.
Based in conventions vs configurations.

All JavaScript code is executed on the client-side.

All JavaScript code located in the files within /js/pages named *.html.mjs is executed on the client-side but only in the development environment. This code dynamically generates the page content, and during the build process, an *.html file is generated that contains the content created by the JavaScript.

The JavaScript code that runs on the front-end will be in the *.js files within the /js and /js/lib directories.

Be careful where you place your JavaScript code. If you place it in the wrong file, it might not be displayed on the front-end, even if it works in the development environment.

## Tools

_[wabuse](https://www.npmjs.com/package/wabuse)_, the command line interface to generate static pages

## Install like global cli

```bash
    npm install -g @wabuse/wabuse-cli
```

## Usage

### Generate scafolding

```bash
    wabuse scafolding [--languages 'lang1','lang2'[,...]] [--commonfiles 'file1','file2'[,...]]
```

### Generate new Page

```bash
    wabuse create-page PAGENAME [--languages 'lang1','lang2'[,...]]
```

### Generate web-component

```bash
    wabuse create-wc WC-NAME
```

### Generate Build

To generate static HTML pages

```bash
    wabuse build [--port PORT] [--workdir WORKDIR]
```

## TREE DIR STRUCTURE

El proyecto consta de la siguiente estructura de carpetas:

```bash
    |__dist (after the build)
    |__resources
    |__src
    |__assets
    |__components
    |__css
    |__js
        |__lib
        |__pages
        |__tpl
    |__json
```

### Path `dist`

Path when the html pages are building after `npm run build`

### Path `recursos`

Path whith resources like robots.txt and sitemap.xml.
These files are copied into dist dir.
