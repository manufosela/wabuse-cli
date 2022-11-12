import language from '../lib/language';

export class CommonTpl {
  constructor() {
    this.data = {};
    this.language = {};
    this.defaultLang = window.navigator.language;
    this.LANG = this.defaultLang;
  }

  static setData(data) {
    this.data = data;
  }
  static setLanguage(language) {
    this.language = language;
    this.LANG = this.language.lang;
  }
  static detectLanguage() {
    const { pathname } = document.location;
    const regExpAnalyzeUrl = /(\/?)(?<lang>[\w_-]*)\//;
    const result = pathname.match(regExpAnalyzeUrl);
    let { lang } = result.groups;
    lang = (lang === '') ? 'es' : lang;
    this.setLanguage({ lang });
    return lang;
  }

  static titleTpl(header) {
    return /*html*/`
      <header>
        <h1>${header.title}</h1>
        <img src="${header.img}" />
      </header>
    `;
  }
}
