/* ===== Google Ads Tracking (no-inline) ===== */
(function () {
    // >>>>>>>>>>>> CONFIGURE AQUI <<<<<<<<<<<<
    const CONFIG = {
      adsId: 'AW-17355173407',
      conversions: {
        pageview: 'AW-17355173407/CvA1COS_kYsbEJ_cy9NA', // PAGEVIEW conversion
        gotovsl:  'AW-17355173407/qF-HCNvFkYsbEJ_cy9NA'  // GoToVSL conversion (click)
      },
      // Quais links são "GoToVSL"? (sem precisar alterar HTML)
      // Regra: qualquer <a> cujo href contenha um destes domínios/padrões:
      vslHosts: [/^https?:\/\/vsl\.updateflux\.online/i],
      // Se quiser restringir aos CTAs, você pode acrescentar um seletor aqui:
      ctaSelector: 'a' // ou 'a.btn, a[data-ub], a.js-cta'
    };
  
    // --- helpers ---
    const hasGtag = () => typeof window.gtag === 'function';
    const debug = (...a) => { /* console.log('[GADS]', ...a); */ }; // habilite se quiser
  
    function hrefMatchesVSL(href) {
      try {
        const url = new URL(href, document.baseURI || location.origin);
        return CONFIG.vslHosts.some(rx => rx.test(url.href));
      } catch { return false; }
    }
  
    function buildUrlSafe(href) {
      // Integra com seu URL Builder (se existir), senão devolve o href original
      try { return window.UB ? UB.buildUrl(href) : href; } catch { return href; }
    }
  
    // --- PAGEVIEW conversion (opcional por regra) ---
    function firePageviewConversionIfEligible() {
      // Regra simples: dispare em páginas do advertorial (ajuste como preferir).
// aceita /pages/advertorial, /pages/advertorial01, /pages/advertorialXYZ etc.
const isAdvertorial = /\/pages\/advertorial/i.test(location.pathname);
      if (!isAdvertorial) return;
  
      if (hasGtag()) {
        debug('fire PAGEVIEW conversion');
        window.gtag('event', 'conversion', {
          send_to: CONFIG.conversions.pageview,
          value: 1.0,
          currency: 'BRL'
        });
      } else {
        debug('gtag not ready for PAGEVIEW');
      }
    }
  
    // --- GoToVSL: intercepta clique e dispara conversão antes de navegar ---
    function handleClick(e) {
      const a = e.target.closest(CONFIG.ctaSelector);
      if (!a) return;
  
      const rawHref = a.getAttribute('href') || '';
      if (!rawHref) return;
      if (!hrefMatchesVSL(rawHref)) return; // não é link para VSL → ignora
  
      // Monta URL final com UTMs/gclid antes de mandar o usuário
      const targetUrl = buildUrlSafe(a.href);
  
      // Para suporte a cmd/ctrl/shift (abrir em nova guia), não vamos bloquear:
      // Porém, a conversão com callback só funciona se impedirmos a navegação e redirecionarmos depois.
      // Estratégia: se for modified-click, deixa seguir normal e dispara conversão "sem callback".
      const isModified = e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1;
      if (isModified) {
        if (hasGtag()) {
          window.gtag('event', 'conversion', {
            send_to: CONFIG.conversions.gotovsl,
            value: 1.0,
            currency: 'BRL'
          });
        }
        return; // deixa o browser abrir nova aba/guia
      }
  
      // Clique normal: impede a navegação, dispara conversão com callback e depois navega
      e.preventDefault();
  
      const navigate = () => { window.location.href = targetUrl; };
  
      if (hasGtag()) {
        let navigated = false;
        const safeNav = () => { if (!navigated) { navigated = true; navigate(); } };
  
        window.gtag('event', 'conversion', {
          send_to: CONFIG.conversions.gotovsl,
          value: 1.0,
          currency: 'BRL',
          event_callback: safeNav
        });
  
        // Fallback caso o callback não ocorra (bloqueadores etc.)
        setTimeout(safeNav, 1200);
      } else {
        // Sem gtag, navega direto (não perde clique)
        navigate();
      }
    }
  
    // --- init ---
    function init() {
      // Dispara PAGEVIEW conversion conforme sua regra
      firePageviewConversionIfEligible();
  
      // Listener global de cliques (sem inline HTML)
      document.addEventListener('click', handleClick, true);
    }
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
      init();
    }
  })();
  