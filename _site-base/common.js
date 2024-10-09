// common imports to libs
import 'header-logomenu';
// __IMPORTS__

/******** SHOW BODY / HIDE LOADING ********/
window.addEventListener('load', () => {
  document.getElementById('loading').classList.add('fadeoff');
  document.querySelector('body').classList.add('fadein');
});
