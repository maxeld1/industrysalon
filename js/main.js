// ---------- JS (js/main.js) ----------
// Mobile nav toggle (optional enhancement later)
console.log("Industry Salon site loaded:", new Date().toISOString());

// Active nav based on pathname (works on GitHub Pages paths)
(function(){
  const path = location.pathname.replace(/\/+$/, '');
  document.querySelectorAll('header nav a').forEach(a=>{
    const href = a.getAttribute('href');
    if (!href) return;
    const target = new URL(href, location.origin + location.pathname).pathname.replace(/\/+$/, '');
    if (path.endsWith(target)) a.classList.add('is-active');
  });
})();

// Header shadow on scroll
(function(){
  const header = document.querySelector('header');
  const onScroll = () => header.style.boxShadow = (window.scrollY>6) ? '0 10px 24px rgba(110,101,92,.06)' : 'none';
  onScroll(); window.addEventListener('scroll', onScroll, {passive:true});
})();
console.log("Luxe Beige theme loaded");

(function(){
  // Cache elements
  const header = document.querySelector('header');
  const root = document.documentElement;
  const menuBtn = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');

  // Set --header-h based on actual header height (prevents jump)
  function setHeaderH(){
    const h = header ? header.offsetHeight : 72;
    root.style.setProperty('--header-h', h + 'px');
  }
  setHeaderH();
  window.addEventListener('resize', setHeaderH);
  window.addEventListener('orientationchange', setHeaderH);

  // Toggle mobile menu
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', ()=>{
      const open = nav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      // Recompute height when menu opens (header may grow by 1px border)
      setTimeout(setHeaderH, 50);
    });

    // Close menu when a link is tapped
    nav.querySelectorAll('a').forEach(a=>{
      a.addEventListener('click', ()=>{
        nav.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();

