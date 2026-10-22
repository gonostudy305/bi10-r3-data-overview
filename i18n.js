// BI10 Round 3 · Universal Header & i18n Bridge
(function() {
  const LANG_KEY = 'bi10_r3_lang';
  
  function getInitialLang() {
    const params = new URLSearchParams(window.location.search);
    const paramLang = params.get('lang');
    if (paramLang && (paramLang === 'vi' || paramLang === 'en')) {
      try { localStorage.setItem(LANG_KEY, paramLang); } catch(e){}
      return paramLang;
    }
    try {
      const stored = localStorage.getItem(LANG_KEY);
      if (stored && (stored === 'vi' || stored === 'en')) return stored;
    } catch(e){}
    return 'vi'; // default Vietnamese
  }

  window.BI10_LANG = getInitialLang();

  window.setLanguage = function(lang) {
    if (lang !== 'vi' && lang !== 'en') return;
    window.BI10_LANG = lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch(e){}
    document.documentElement.lang = lang;
    
    // Update URL query param without reload
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url.toString());

    // Update navigation links to preserve lang
    updateNavLinks(lang);

    // Update lang switcher active state
    updateLangButtons(lang);

    // Dispatch global event for renderers
    window.dispatchEvent(new CustomEvent('bi10-lang-changed', { detail: { lang } }));
  };

  function updateNavLinks(lang) {
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('javascript:')) return;
      try {
        const u = new URL(href, window.location.href);
        if (u.origin === window.location.origin) {
          u.searchParams.set('lang', lang);
          // Preserve relative style
          if (href.startsWith('../')) {
            const relPath = href.split('?')[0];
            a.setAttribute('href', relPath + '?lang=' + lang);
          } else if (href.startsWith('./') || !href.includes('/')) {
            const relPath = href.split('?')[0];
            a.setAttribute('href', relPath + '?lang=' + lang);
          } else {
            a.setAttribute('href', u.pathname + '?lang=' + lang);
          }
        }
      } catch(e){}
    });
  }

  function updateLangButtons(lang) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const bLang = btn.dataset.lang;
      btn.classList.toggle('active', bLang === lang);
      btn.setAttribute('aria-pressed', String(bLang === lang));
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    document.documentElement.lang = window.BI10_LANG;
    updateNavLinks(window.BI10_LANG);
    updateLangButtons(window.BI10_LANG);
  });
})();
