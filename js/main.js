// ---------- JS (js/main.js) ----------

console.log("Industry Salon site loaded:", new Date().toISOString());

/* Active nav highlighting (robust with ../ and subpaths) */
(function(){
  const norm = p => ("/" + p).replace(/\/+/g, "/").replace(/\/$/, "");
  const here = norm(location.pathname);
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('header nav a').forEach(a=>{
      const href = a.getAttribute('href');
      if (!href) return;
      const url = new URL(href, location.href);   // resolves ../ etc.
      const target = norm(url.pathname);
      if (here === target) a.classList.add('is-active');
    });
  });
})();

/* Header shadow on scroll */
(function(){
  const header = document.querySelector('header');
  const onScroll = () => header && (header.style.boxShadow =
    (window.scrollY > 6) ? '0 10px 24px rgba(110,101,92,.06)' : 'none');
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});
})();

/* Mobile header/menu: measure height, toggle panel, scroll lock, ESC & click-outside */
(function initMobileNav(){
  const boot = () => {
    const header = document.querySelector('header');
    const root = document.documentElement;
    const menuBtn = document.querySelector('.menu-toggle');
    const nav = document.getElementById('mobile-menu') || document.querySelector('.site-nav');

    if (!header || !menuBtn || !nav) return;

    // Keep layout from jumping
    function setHeaderH(){
      const h = header.offsetHeight || 72;
      root.style.setProperty('--header-h', h + 'px');
    }
    setHeaderH();
    window.addEventListener('resize', setHeaderH, {passive:true});
    window.addEventListener('orientationchange', setHeaderH);

    // Body scroll lock helpers
    const lockBody = () => { document.body.style.overflow = 'hidden'; };
    const unlockBody = () => { document.body.style.overflow = ''; };

    // Toggle function
    const toggle = (forceOpen) => {
      const willOpen = (typeof forceOpen === 'boolean') ? forceOpen : !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', willOpen);
      menuBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      willOpen ? lockBody() : unlockBody();
      setTimeout(setHeaderH, 50);
    };

    // Click hamburger
    menuBtn.addEventListener('click', () => toggle());

    // Close after link click
    nav.querySelectorAll('a').forEach(a=>{
      a.addEventListener('click', () => toggle(false));
    });

    // Close on ESC
    document.addEventListener('keydown', (e)=>{
      if (e.key === 'Escape' && nav.classList.contains('is-open')) toggle(false);
    });

    // Click outside to close
    document.addEventListener('click', (e)=>{
      if (!nav.classList.contains('is-open')) return;
      const withinNav = nav.contains(e.target);
      const isBtn = menuBtn.contains(e.target);
      if (!withinNav && !isBtn) toggle(false);
    });
  };

  // If header/footer are injected via partials.js, wait for DOM, then a tick
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(boot, 0));
  } else {
    setTimeout(boot, 0);
  }
})();

console.log("Luxe Beige theme loaded");
