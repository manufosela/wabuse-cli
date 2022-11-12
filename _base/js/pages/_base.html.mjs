import data from '../../json/_base.json.js'; /* FUENTE DE DATOS JSON */
import {CommonTpl} from './common.html.mjs';

const lang = CommonTpl.LANG;

const pageData = data._base[lang];
window.WabuseDATA.pageData = data._base[lang];


const HTMLbody = /* html */`
    ${CommonTpl.titleTpl(pageData.header)}
    <main role="main" class="homepage">
      <h1>CAMBIAR POR EL CONTENIDO HTML DE LA PÁGINA</h1>
      <mi-componente1></mi-componente1>
    </main>
    <footer>
      wabuse - ${new Date().getFullYear()}
    </footer>
`;

document.body.innerHTML = `
<div id="loading" class="loading">CARGANDO....</div>  
<div id="main">
  ${HTMLbody}
</div>`;