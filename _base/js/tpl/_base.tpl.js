// Datos y Plantillas
import { HTMLbody } from '../pages/_base.html.mjs';

document.body.innerHTML = `
<div id="loading" class="loading">CARGANDO....</div>  
<div id="main">
  ${HTMLbody}
</div>`;