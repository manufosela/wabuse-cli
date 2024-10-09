/**
 * CommonTpl class for handling template rendering and language detection.
 */
export class CommonTpl {
  /**
   * Creates an instance of CommonTpl.
   * Initializes data, language, default language, and current language.
   */
  constructor() {
    this.data = {};
    this.language = {};
    this.defaultLang = window.navigator.language;
    this.LANG = this.defaultLang;
  }

  /**
   * Sets the data for the template.
   * @param {Object} data - The data to set.
   */
  static setData(data) {
    this.data = data;
  }

  /**
   * Sets the language for the template.
   * @param {Object} language - The language object to set.
   * @param {string} language.lang - The language code to set.
   */
  static setLanguage(language) {
    this.language = language;
    this.LANG = this.language.lang;
  }

  /**
   * Detects the language from the URL path.
   * Sets the language if detected, otherwise defaults to 'es'.
   * @returns {string} The detected or default language code.
   */
  static detectLanguage() {
    const { pathname } = document.location;
    const regExpAnalyzeUrl = /(\/?)(?<lang>[\w_-]*)\//;
    const result = pathname.match(regExpAnalyzeUrl);
    let { lang } = result.groups;
    lang = (lang === '' || lang.length !== 2) ? 'es' : lang;
    this.setLanguage({ lang });
    return lang;
  }

  /**
   * Renders HTML content into a specified element.
   * Adds a loading message for main or index elements.
   * @param {string} id - The ID of the element to render the content into.
   * @param {string} HTMLContent - The HTML content to render.
   */
  static render(id, HTMLContent) {
    if (id === 'main' || id == 'index') {
      document.body.innerHTML = '<div id="loading" class="loading">CARGANDO....</div>' + document.body.innerHTML;
    }
    const currentScript = document.getElementById(id);
    const newDiv = document.createElement('div');
    newDiv.id = id;
    newDiv.innerHTML = HTMLContent;
    currentScript.parentNode.replaceChild(newDiv, currentScript);
  }
}
