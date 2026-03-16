// /js/partials
(function () {
  const PARTIAL_CACHE_PREFIX = "partial:";

  async function inject(targetSelector, file) {
    const mount = document.querySelector(targetSelector);
    if (!mount) return;

    const url = `/partials/${file}`; // root-relative always works

    try {
      const cached = sessionStorage.getItem(`${PARTIAL_CACHE_PREFIX}${url}`);
      if (cached) {
        mount.outerHTML = cached;
        return;
      }
    } catch (err) {
      console.warn("Partial cache read failed:", url, err);
    }

    try {
      const res = await fetch(url, { cache: "force-cache" });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const html = await res.text();
      try {
        sessionStorage.setItem(`${PARTIAL_CACHE_PREFIX}${url}`, html);
      } catch (err) {
        console.warn("Partial cache write failed:", url, err);
      }
      mount.outerHTML = html;
    } catch (err) {
      console.error("Include failed:", url, err);
    }
  }

  async function run() {
    await Promise.all([
      inject('[data-include="header"]', 'header.html'),
      inject('[data-include="footer"]', 'footer.html')
    ]);

    // If #year is inside the footer partial, set it after injection
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  if (document.readyState !== 'loading') run();
  else document.addEventListener('DOMContentLoaded', run);
})();

