/* ===== app.js (clean) ===== */
/* Somente utilidades globais leves (se quiser manter um log, ok remover) */
console.log("app.js loaded");

/* ===== URL Builder v5 (oficial) ===== */
(() => {
  const STORE_KEY = 'ub_params_v5';

  // helpers
  const qsToObj = (qs) => {
    const p = new URLSearchParams(qs || '');
    const o = {};
    p.forEach((v, k) => { if (v !== '') o[k] = v; });
    return o;
  };
  const load  = () => { try { return JSON.parse(sessionStorage.getItem(STORE_KEY) || '{}') || {}; } catch { return {}; } };
  const save  = (obj) => { try { sessionStorage.setItem(STORE_KEY, JSON.stringify(obj || {})); } catch {} };
  const sanitize = (href) => href && /\s/.test(href) ? encodeURI(href.trim()) : (href || '').trim();

  // 1) captura params da página e persiste (mantém anteriores)
  const incoming = qsToObj(location.search);
  const stored   = load();
  const params   = { ...stored, ...incoming };
  save(params);

  // 2) construtor público
  function buildUrl(base, extra = {}, { override = false } = {}) {
    try {
      const url = new URL(sanitize(base), document.baseURI || location.origin);
      const final = Object.fromEntries(url.searchParams.entries());
      const apply = (src) => Object.entries(src || {}).forEach(([k,v]) => {
        if (v == null || v === '') return;
        if (override || !(k in final)) final[k] = v;
      });
      apply(params);
      apply(extra);
      url.search = '';
      Object.entries(final).forEach(([k,v]) => url.searchParams.append(k, v));
      return url.toString();
    } catch { return base; }
  }

  // 3) expõe globalmente
  window.UB = { buildUrl, params };

  // 4) decora <a data-ub> automaticamente
  function decorate(a) {
    const raw = a.getAttribute('href') || '';
    if (!raw || /^#|mailto:|tel:|javascript:/i.test(raw)) return;
    try {
      const before = a.href;
      const after  = buildUrl(before);
      if (after !== before) a.href = after;
    } catch {}
  }
  function decorateAll(){ document.querySelectorAll('a[data-ub]').forEach(decorate); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', decorateAll, { once: true });
  } else {
    decorateAll();
  }

  // garante decoração antes do clique e para DOM dinâmico
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-ub]');
    if (a) decorate(a);
  }, true);
  new MutationObserver(decorateAll).observe(document.documentElement, { childList: true, subtree: true });

  // debug opcional:
  // console.log('[UB] ready', params);
})();
