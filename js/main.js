// js/main.js
(function(){
  const log = (...a)=>console.log('[nav]', ...a);

  function norm(p){ return ("/"+p).replace(/\/+/g,"/").replace(/\/$/,""); }
  // Active link
  document.addEventListener('DOMContentLoaded', ()=>{
    const here = norm(location.pathname);
    document.querySelectorAll('header nav a').forEach(a=>{
      const href = a.getAttribute('href'); if(!href) return;
      const target = norm(new URL(href, location.href).pathname);
      if(here === target) a.classList.add('is-active');
    });
  });

  function init(){
    const header = document.querySelector('header');
    const menuBtn = document.querySelector('.menu-toggle');
    const nav = document.getElementById('mobile-menu') || document.querySelector('.site-nav');
    if(!header || !menuBtn || !nav){ log('waiting for header…'); return false; }

    // measure header for mobile offset
    const root = document.documentElement;
    const setH = () => root.style.setProperty('--header-h', (header.offsetHeight||72) + 'px');
    setH(); addEventListener('resize', setH, {passive:true}); addEventListener('orientationchange', setH);

    const lock = ()=>{ document.body.style.overflow='hidden'; };
    const unlock = ()=>{ document.body.style.overflow=''; };

    const toggle = (force)=>{
      const open = (typeof force==='boolean') ? force : !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      open ? lock() : unlock();
      setTimeout(setH, 50);
      log('menu', open ? 'opened' : 'closed');
    };

    menuBtn.addEventListener('click', ()=>toggle());
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>toggle(false)));
    document.addEventListener('keydown', e=>{ if(e.key==='Escape' && nav.classList.contains('is-open')) toggle(false); });
    document.addEventListener('click', e=>{
      if(!nav.classList.contains('is-open')) return;
      if(!nav.contains(e.target) && !menuBtn.contains(e.target)) toggle(false);
    });

    log('bound listeners');
    return true;
  }

  // Try immediately, then retry a few times in case partials load after
  if(!init()){
    let tries = 0;
    const t = setInterval(()=>{
      tries++; if(init() || tries>12) clearInterval(t); // retry up to ~3s
    }, 250);
  }

  // Pretty header shadow
  const hdr = document.querySelector('header');
  const onScroll = ()=>{ if(hdr) hdr.style.boxShadow = (scrollY>6) ? '0 10px 24px rgba(110,101,92,.06)' : 'none'; };
  onScroll(); addEventListener('scroll', onScroll, {passive:true});
})();
