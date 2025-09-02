
// ===== Local-only Comments =====
(function(){
  const LS_KEY = 'adv_comments_v1';

  // Comentários iniciais (se não houver nada no localStorage)
  const seed = [
    {id: id(), name:'Wilma Dewon', text:'Thank you for this valuable information, this spray helped me so much. It really saved me and my lungs.', ts: agoMin(39), likes:4, replies:[]},
    {id: id(), name:'Doris Skylar', text:"I bought mine for the full price and now are 30% off? That's not fair!", ts: agoMin(51), likes:4, replies:[]},
    {id: id(), name:'Skyler Greig', text:'How long does shipping take?', ts: agoHr(1), likes:6, replies:[
      {id: id(), name:'Marie Cambell', text:'Hey Skyler, got mine after a week.', ts: agoMin(24), likes:2, replies:[]}
    ]},
    {id: id(), name:'Anna Boyd', text:"I took the package from the post-office yesterday, everything's all right. I'm starting to use it. Waiting for the results :)", ts: agoHr(1), likes:7, replies:[]},
    {id: id(), name:'Emma Emerson', text:"I've been using this spray for about 5 weeks and I'm just thrilled with the result, the picture below is the best proof of the change.", ts: agoHr(2), likes:11, replies:[]},
    {id: id(), name:'Alfred Johnson', text:'Did you buy one, how long does it take to get it', ts: agoHr(2), likes:14, replies:[
      {id: id(), name:'Edith Ashton', text:'For me 5 business days.', ts: agoMin(50), likes:6, replies:[]}
    ]},
    {id: id(), name:'Debra Peyton', text:"I was just about to order it! With the level of pollution in the modern urban environment, everyone sooner or later starts to have lung problems... Motivated for active actions!", ts: agoHr(3), likes:19, replies:[]},
    {id: id(), name:'Paula Remington', text:'My pulmonologist recommended this spray to me :)', ts: agoHr(3), likes:21, replies:[]},
    {id: id(), name:'Agnes Graeme', text:'I ordered, now I look forward to my package :)', ts: agoHr(3), likes:25, replies:[]}
  ];

  // Utilidades de tempo
  function agoMin(m){ return Date.now() - m*60*1000; }
  function agoHr(h){ return Date.now() - h*60*60*1000; }
  function rel(ts){
    const s = Math.max(1, Math.floor((Date.now()-ts)/1000));
    if (s < 60) return `${s} sec`;
    const m = Math.floor(s/60); if (m < 60) return `${m} min`;
    const h = Math.floor(m/60); if (h < 24) return `${h} h`;
    const d = Math.floor(h/24); return `${d} d`;
  }
  function id(){ return Math.random().toString(36).slice(2,10); }

  // Estado
  let data = load() || seed; save();

  // DOM refs
  const listEl = document.getElementById('comments-list');
  const formEl = document.getElementById('comment-form');
  const nameEl = document.getElementById('c-name');
  const emailEl = document.getElementById('c-email');
  const textEl = document.getElementById('c-text');

  // Render
  function render(){
    listEl.innerHTML = '';
    data.forEach(c => listEl.appendChild(renderItem(c)));
  }

  function renderItem(item, depth=0){
    const wrap = document.createElement('article');
    wrap.className = 'comment';
    wrap.dataset.id = item.id;

    const avatar = document.createElement('div');
    avatar.className = 'comment__avatar';
    avatar.textContent = initials(item.name);
    wrap.appendChild(avatar);

    const body = document.createElement('div');
    body.className = 'comment__body';
    body.innerHTML = `
      <div class="comment__header">
        <span class="comment__name">${esc(item.name)}</span>
        <span class="comment__meta">• ${rel(item.ts)}</span>
      </div>
      <div class="comment__text">${linkify(esc(item.text))}</div>
      <div class="comment__actions">
        <button class="comment__btn js-like" type="button">Like • <span>${item.likes||0}</span></button>
        <button class="comment__btn js-reply" type="button">Reply</button>
      </div>
    `;
    wrap.appendChild(body);

    // replies
    if (item.replies && item.replies.length){
      const r = document.createElement('div');
      r.className = 'replies';
      item.replies.forEach(child => r.appendChild(renderItem(child, depth+1)));
      wrap.appendChild(r);
    }

    return wrap;
  }

  // Eventos delegados: like / reply
  listEl.addEventListener('click', (e) => {
    const art = e.target.closest('.comment');
    if (!art) return;
    const cid = art.dataset.id;

    if (e.target.closest('.js-like')){
      updateComment(cid, (c)=>{ c.likes = (c.likes||0)+1; });
      const span = e.target.closest('.js-like').querySelector('span');
      span.textContent = parseInt(span.textContent,10)+1;
      return;
    }

    if (e.target.closest('.js-reply')){
      toggleReplyForm(art, cid);
      return;
    }
  });

  function toggleReplyForm(container, cid){
    // se já existe, remove
    const existing = container.parentElement.querySelector(`.reply-form[data-parent="${cid}"]`);
    if (existing){ existing.remove(); return; }

    // novo form inline
    const f = document.createElement('form');
    f.className = 'reply-form';
    f.dataset.parent = cid;
    f.innerHTML = `
      <div class="row">
        <input type="text" name="name" placeholder="Your name" required>
        <input type="email" name="email" placeholder="Email (optional)">
      </div>
      <textarea name="text" rows="3" placeholder="Write a reply…" required></textarea>
      <button type="submit" class="btn">Reply</button>
    `;
    container.after(f);

    f.addEventListener('submit', (ev)=>{
      ev.preventDefault();
      const fd = new FormData(f);
      const reply = {
        id: id(),
        name: (fd.get('name')||'Anonymous').toString().trim(),
        text: (fd.get('text')||'').toString().trim(),
        ts: Date.now(), likes:0, replies:[]
      };
      if (!reply.text) return;
      updateComment(cid, (c)=>{ (c.replies ||= []).push(reply); });
      render();
    });
  }

  // Form principal: novo comentário
  formEl?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = (nameEl.value || 'Anonymous').trim();
    const text = (textEl.value || '').trim();
    if (!text) return;

    data.unshift({
      id: id(), name, text, ts: Date.now(), likes:0, replies:[]
    });
    save(); render();
    formEl.reset();
    nameEl.focus();
  });

  // Helpers de estado
  function load(){
    try{ return JSON.parse(localStorage.getItem(LS_KEY)||''); }catch{ return null; }
  }
  function save(){
    try{ localStorage.setItem(LS_KEY, JSON.stringify(data)); }catch{}
  }
  function updateComment(targetId, fn){
    const walk = (arr)=>{
      for (const c of arr){
        if (c.id === targetId){ fn(c); save(); return true; }
        if (c.replies && walk(c.replies)) return true;
      }
      return false;
    };
    walk(data);
  }

  // utilidades visuais
  function initials(name){
    const parts = name.trim().split(/\s+/).slice(0,2);
    return parts.map(p=>p[0]?.toUpperCase()||'U').join('');
  }
  function esc(s){ return s.replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])); }
  function linkify(s){
    return s.replace(/(https?:\/\/[^\s)]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
  }

  render();
})();


/* ===== URL Builder v3 (robusto + debug) ===== */
(() => {
    const STORE_KEY = 'ub_params_v3';
    const SELECTOR = 'a[data-ub], a.ub, a.js-cta';
    const DEBUG = true; // ← mude para false quando terminar de testar
  
    const log = (...args) => { if (DEBUG) console.log('[UB]', ...args); };
  
    // Utils
    const qsToObj = (qs) => {
      const p = new URLSearchParams(qs || '');
      const o = {};
      for (const [k, v] of p) if (v !== '') o[k] = v;
      return o;
    };
    const load = () => {
      try { return JSON.parse(sessionStorage.getItem(STORE_KEY) || '{}') || {}; }
      catch { return {}; }
    };
    const save = (obj) => { try { sessionStorage.setItem(STORE_KEY, JSON.stringify(obj || {})); } catch {} };
  
    // Captura e persiste params da URL atual (UTMs, gclid, etc.)
    const incoming = qsToObj(location.search);
    const stored = load();
    const merged = { ...stored, ...incoming }; // o que veio agora tem prioridade
    save(merged);
    log('params stored:', merged);
  
    // Sanitiza HREF (resolve casos com espaços)
    function sanitizeHref(href) {
      if (!href) return href;
      const t = href.trim();
      // se tiver espaço sem codificar, tenta encode
      if (/\s/.test(t)) return encodeURI(t);
      return t;
    }
  
    // Builder
    function buildUrl(base, extra = {}, { override = false } = {}) {
      try {
        const safeBase = sanitizeHref(base);
        const url = new URL(safeBase, document.baseURI || location.origin); // suporta relativo
  
        // junta params: os já existentes na URL do link, depois os salvos, depois os extras
        const final = Object.fromEntries(url.searchParams.entries());
  
        const apply = (src) => {
          Object.entries(src || {}).forEach(([k, v]) => {
            if (v == null || v === '') return;
            if (override || !(k in final)) final[k] = v;
          });
        };
  
        apply(merged);
        apply(extra);
  
        url.search = '';
        Object.entries(final).forEach(([k, v]) => url.searchParams.append(k, v));
        return url.toString();
      } catch (err) {
        log('buildUrl failed for', base, err);
        return base; // não quebra navegação
      }
    }
  
    // expõe p/ uso manual
    window.UB = { buildUrl, params: merged };
  
    const isDecoratable = (a) => {
      const raw = a.getAttribute('href') || '';
      const href = raw.trim().toLowerCase();
      if (!href) return false;
      if (href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) return false;
      return true;
    };
  
    function decorateAnchor(a) {
      if (!isDecoratable(a)) { if (DEBUG) log('skip', a); return; }
  
      // extra via data-ub-pass="sub1,affid"
      const extra = {};
      (a.dataset.ubPass || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .forEach(k => {
          const v = a.dataset[k];
          if (v) extra[k] = v;
        });
  
      const override = a.dataset.ubOverride === 'true';
      const before = a.href;
      const after = buildUrl(before, extra, { override });
      if (after !== before) {
        a.href = after;
        log('decorated', a, '→', after);
      } else {
        log('no-change', a);
      }
    }
  
    function decorateAll() {
      document.querySelectorAll(SELECTOR).forEach(decorateAnchor);
    }
  
    // Decora agora
    decorateAll();
  
    // Garante decorar antes de sair (caso algo mude no meio)
    document.addEventListener('click', (e) => {
      const a = e.target.closest(SELECTOR);
      if (!a) return;
      decorateAnchor(a);
    }, true);
  
    // Observa DOM dinâmico
    const mo = new MutationObserver(decorateAll);
    mo.observe(document.documentElement, { childList: true, subtree: true });
  
    log('UB v3 ready');
  })();
  