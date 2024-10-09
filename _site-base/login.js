import globalState from './globalState.js';

async function loginReady() {
  if (globalState.fbCRUDReady && globalState.firebaseSigninReady && !globalState.menuReady) {
    document.dispatchEvent(new CustomEvent('start-app'));
  }
}

document.addEventListener('wc-ready', (ev) => {
  if (ev.detail.id === 'loginButton' && !globalState.firebaseSigninReady) {
    document.getElementById('firebasecrud')?.remove();
    globalState.fbCRUD = document.createElement('firebase-crud');
    globalState.fbCRUD.setAttribute('id', 'firebasecrud');
    globalState.fbCRUD.setAttribute('reference-id', 'loginButton');
    document.body.appendChild(globalState.fbCRUD);
  }
  if (ev.detail.id === 'firebasecrud' && !globalState.fbCRUDReady) {
    globalState.fbCRUDReady = true;
    setTimeout(() => { loginReady() }, 100);
  }
});

document.addEventListener('firebase-signin', (ev) => {
  globalState.firebaseLoginButton = document.querySelector('firebase-loginbutton');
  if (globalState.firebaseSigninReady) {
    return;
  }
  console.log('firebase-signin');
  globalState.firebaseSigninReady = true;
  loginReady();
});

document.addEventListener('firebase-signout', (ev) => {
  if (!globalState.firebaseSigninReady) {
    return;
  }
  console.log('firebase-signout');
  globalState.firebaseSigninReady = false;
  globalState.menuReady = false;
  globalState.fbCRUDReady = false;
  const main = document.querySelector('main');
  main.innerHTML = globalState.mainNoLoggedHTML[globalState.language];
});
