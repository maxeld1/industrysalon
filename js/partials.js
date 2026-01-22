// // /js/partials.js
// (function () {
//   const isSubpage = /\/pages\//.test(location.pathname);
//   const P = isSubpage ? '../' : '';
//
//   function inject(selector, file) {
//     const el = document.querySelector(selector);
//     if (!el) return;
//     fetch(P + 'partials/' + file)
//       .then(r => r.text())
//       .then(html => {
//         // replace {{P}} placeholders with proper prefix
//         html = html.replaceAll('{{P}}', P);
//         el.outerHTML = html;
//       })
//       .catch(err => console.error('Include failed:', file, err));
//   }
//
//   // run after DOM is ready
//   if (document.readyState !== 'loading') {
//     inject('[data-include="header"]', 'header.html');
//     inject('[data-include="footer"]', 'footer.html');
//   } else {
//     document.addEventListener('DOMContentLoaded', function(){
//       inject('[data-include="header"]', 'header.html');
//       inject('[data-include="footer"]', 'footer.html');
//     });
//   }
// })();
//
// async function includePartials() {
//   const nodes = document.querySelectorAll("[data-include]");
//
//   for (const el of nodes) {
//     const name = el.getAttribute("data-include"); // "header" or "footer"
//     const url = `/partials/${name}.html`;          // root-relative
//
//     const res = await fetch(url, { cache: "no-store" });
//
//     if (!res.ok) {
//       console.error(`Failed to load ${url}:`, res.status);
//       continue;
//     }
//
//     el.innerHTML = await res.text();
//   }
//
//   // If #year lives in the footer partial, set it after includes load
//   const yearEl = document.getElementById("year");
//   if (yearEl) yearEl.textContent = new Date().getFullYear();
// }
//
// includePartials();

// /js/partials.js
(function () {
  async function inject(targetSelector, file) {
    const mount = document.querySelector(targetSelector);
    if (!mount) return;

    const url = `/partials/${file}`; // root-relative always works
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const html = await res.text();
      mount.outerHTML = html;
    } catch (err) {
      console.error("Include failed:", url, err);
    }
  }

  async function run() {
    await inject('[data-include="header"]', 'header.html');
    await inject('[data-include="footer"]', 'footer.html');

    // If #year is inside the footer partial, set it after injection
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  if (document.readyState !== 'loading') run();
  else document.addEventListener('DOMContentLoaded', run);
})();

