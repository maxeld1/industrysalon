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
