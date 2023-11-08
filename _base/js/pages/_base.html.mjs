import data from '../../json/_base.json.js'; /* FUENTE DE DATOS JSON */
import {CommonTpl} from './common.html.mjs';

CommonTpl.detectLanguage();
const lang = CommonTpl.LANG;

const pageData = data._base[lang];


const HTMLbody = /* html */`
    <main role="main" class="homepage">
      <h1>${pageData.header.title}</h1>
      <img src="${pageData.header.img}" alt="${pageData.header.title}">
    </main>
    <footer>
      &copy;wabuse - ${new Date().getFullYear()}
    </footer>
`;

document.body.innerHTML = `
<div id="loading" class="loading">CARGANDO....</div>  
<div id="main">
  ${HTMLbody}
</div>`;