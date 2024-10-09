import { Wabuse } from '@wabuse/wabuse';
import data from '../../json/index.json.js'; /* FUENTE DE DATOS JSON */
import { CommonTpl } from './common.html.mjs';

/**
 * Detect the language from the URL and set it in the CommonTpl class.
 */
CommonTpl.detectLanguage();
const lang = CommonTpl.LANG;

/**
 * Extract page-specific data for the detected language.
 * @type {Object}
 */
const pageData = data.index[lang];

/**
 * Extract header and footer data from pageData.
 * @type {Object}
 */
const header = pageData.header;
const footer = pageData.footer;

/**
 * Set the language for header and footer.
 */
header.lang = lang;
footer.lang = lang;

/**
 * Set global window variables for header and footer data.
 */
window.WabuseDATA.header = header;
window.WabuseDATA.footer = footer;

/**
 * Generate HTML content for the body.
 * @type {string}
 */
const HTMLbody = /* html */`
    <template data-wabuse data-src="/templates/header.tpl.html" data-json="header"></template>
    <main role="main" class="homepage">
      <h1>Welcome to awesome Wabuse App</h1>
      <img src="${pageData.img}" alt="${pageData.header.title}">  
    </main>
    <template data-wabuse data-src="/templates/footer.tpl.html" data-json="footer"></template>
`;

/**
 * Render the HTML content to the element with id 'index'.
 * @param {string} id - The ID of the element to render the content into.
 * @param {string} HTMLContent - The HTML content to render.
 */
CommonTpl.render('index', HTMLbody);
