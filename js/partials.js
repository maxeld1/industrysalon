// /js/partials
(function () {
  const PARTIAL_CACHE_PREFIX = "partial:";
  const PARTIAL_CACHE_VERSION = "2026-05-15";

  async function inject(targetSelector, file) {
    const mount = document.querySelector(targetSelector);
    if (!mount) return;

    const url = `/partials/${file}`; // root-relative always works
    const cacheKey = `${PARTIAL_CACHE_PREFIX}${PARTIAL_CACHE_VERSION}:${url}`;
    const fetchUrl = `${url}?v=${encodeURIComponent(PARTIAL_CACHE_VERSION)}`;

    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        mount.outerHTML = cached;
        return;
      }
    } catch (err) {
      console.warn("Partial cache read failed:", url, err);
    }

    try {
      const res = await fetch(fetchUrl, { cache: "no-cache" });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const html = await res.text();
      try {
        sessionStorage.setItem(cacheKey, html);
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

