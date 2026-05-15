// Renders CMS-managed JSON content while keeping the existing HTML as fallback.
(function () {
  const CONTENT_ROOT = "/content";

  async function loadJson(file) {
    const response = await fetch(`${CONTENT_ROOT}/${file}`, { cache: "no-cache" });
    if (!response.ok) throw new Error(`${file}: ${response.status}`);
    return response.json();
  }

  function text(value) {
    return value == null ? "" : String(value);
  }

  function isSafeUrl(value) {
    if (!value) return false;
    if (value.startsWith("/")) return true;

    try {
      const url = new URL(value, window.location.href);
      return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol);
    } catch (err) {
      return false;
    }
  }

  function setHref(anchor, url) {
    if (anchor && isSafeUrl(url)) anchor.href = url;
  }

  function appendText(parent, value, tagName = "span", className) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    element.textContent = text(value);
    parent.appendChild(element);
    return element;
  }

  function instagramIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "team-ig-icon");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", "3");
    rect.setAttribute("y", "3");
    rect.setAttribute("width", "18");
    rect.setAttribute("height", "18");
    rect.setAttribute("rx", "5");

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", "12");
    circle.setAttribute("cy", "12");
    circle.setAttribute("r", "4.2");

    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", "17.2");
    dot.setAttribute("cy", "6.8");
    dot.setAttribute("r", "1");

    svg.append(rect, circle, dot);
    return svg;
  }

  function serviceLine(item, className = "service-lines") {
    const li = document.createElement("li");
    appendText(li, item.name);
    appendText(li, item.price);
    if (className === "service-price-list") li.className = "";
    return li;
  }

  function renderServicePanels(data) {
    const panels = document.querySelector(".services-page .services-panels");
    if (!panels || !Array.isArray(data.categories)) return;

    panels.replaceChildren();
    data.categories.forEach((category) => {
      const article = document.createElement("article");
      article.className = "service-panel";
      appendText(article, category.title, "h2");

      const list = document.createElement("ul");
      list.className = "service-lines";
      (category.items || []).forEach((item) => list.appendChild(serviceLine(item)));
      article.appendChild(list);

      if (category.note) appendText(article, category.note, "p", "card-note");
      panels.appendChild(article);
    });

    const intro = document.querySelector(".services-page .services-hero-inner p");
    if (intro && data.intro) intro.textContent = data.intro;

    const note = document.querySelector(".services-page .pricing-note");
    if (note && data.pricingNote) note.textContent = data.pricingNote;
  }

  function renderHomeServiceHighlights(data) {
    const container = document.querySelector(".home-main .services-highlights");
    if (!container || !Array.isArray(data.categories)) return;

    const featured = data.categories.filter((category) => category.featured);
    if (!featured.length) return;

    container.replaceChildren();
    featured.forEach((category) => {
      const details = document.createElement("details");
      details.className = "service-dropdown";

      const summary = document.createElement("summary");
      appendText(summary, category.title, "span", "service-dropdown-title");
      details.appendChild(summary);

      const list = document.createElement("ul");
      list.className = "service-price-list";
      (category.items || []).forEach((item) => list.appendChild(serviceLine(item, "service-price-list")));
      details.appendChild(list);
      container.appendChild(details);
    });
  }

  function renderServices(data) {
    renderServicePanels(data);
    renderHomeServiceHighlights(data);
  }

  function renderStylists(data) {
    const grid = document.querySelector(".stylists-page .team-grid");
    if (!grid || !Array.isArray(data.members)) return;

    const intro = document.querySelector(".stylists-page .stylists-hero p");
    if (intro && data.intro) intro.textContent = data.intro;

    grid.replaceChildren();
    data.members.forEach((member) => {
      const article = document.createElement("article");
      article.className = "card team-card";

      const row = document.createElement("div");
      row.className = "team-row";

      const media = document.createElement("div");
      media.className = "team-media";
      if (member.image) {
        const image = document.createElement("img");
        image.src = member.image;
        image.alt = member.imageAlt || `Headshot of ${member.name}`;
        image.loading = "lazy";
        image.decoding = "async";
        media.appendChild(image);
      }
      row.appendChild(media);

      const top = document.createElement("div");
      top.className = "team-top";
      appendText(top, member.name, "h3", "team-name");

      if (member.level !== undefined && member.level !== null && member.level !== "") {
        const levelWrap = document.createElement("div");
        levelWrap.className = "team-level-wrap";
        const levelCircle = document.createElement("div");
        levelCircle.className = "team-level-circle";
        appendText(levelCircle, "Level", "span", "level-label");
        appendText(levelCircle, member.level, "span", "level-number");
        levelWrap.appendChild(levelCircle);
        top.appendChild(levelWrap);
      }

      appendText(top, member.title, "div", "team-title");

      if (member.instagramUrl || member.instagramHandle) {
        const igRow = document.createElement("div");
        igRow.className = "team-ig-row";

        const iconLink = document.createElement("a");
        iconLink.className = "team-ig";
        setHref(iconLink, member.instagramUrl);
        iconLink.target = "_blank";
        iconLink.rel = "noopener";
        iconLink.setAttribute("aria-label", `${member.name} on Instagram`);
        iconLink.appendChild(instagramIcon());
        igRow.appendChild(iconLink);

        const handleLink = document.createElement("a");
        handleLink.className = "team-ig-handle";
        setHref(handleLink, member.instagramUrl);
        handleLink.target = "_blank";
        handleLink.rel = "noopener";
        handleLink.setAttribute("aria-label", `${member.name} on Instagram handle`);
        handleLink.textContent = member.instagramHandle || "Instagram";
        igRow.appendChild(handleLink);

        top.appendChild(igRow);
      }

      row.appendChild(top);
      article.appendChild(row);

      const bio = document.createElement("div");
      bio.className = "team-bio";
      (member.bio || []).forEach((paragraph) => appendText(bio, paragraph, "p"));
      article.appendChild(bio);

      grid.appendChild(article);
    });
  }

  function applySiteSettings(settings) {
    if (!settings) return;

    document.querySelectorAll('a[href*="CustomerPortal/login"]').forEach((anchor) => setHref(anchor, settings.bookingUrl));
    document.querySelectorAll('a[href*="CustomerPortal/egift"]').forEach((anchor) => setHref(anchor, settings.giftCardUrl));

    document.querySelectorAll('a[href^="tel:"]').forEach((anchor) => {
      if (!settings.phoneHref) return;
      anchor.href = `tel:${settings.phoneHref}`;
      if (anchor.textContent.trim().startsWith("(")) anchor.textContent = settings.phoneDisplay || settings.phoneHref;
    });

    document.querySelectorAll('a[href^="mailto:"]').forEach((anchor) => {
      if (!settings.email) return;
      anchor.href = `mailto:${settings.email}`;
      if (anchor.textContent.includes("@")) anchor.textContent = settings.email;
    });

    document.querySelectorAll('footer a[aria-label="Instagram"], .contact-info a[href*="instagram.com/industrysalonnewtownsquare"]').forEach((anchor) => {
      setHref(anchor, settings.instagramUrl);
      if (anchor.classList.contains("team-ig-handle") || anchor.textContent.trim().startsWith("@")) {
        anchor.textContent = settings.instagramHandle;
      }
    });

    const address = document.querySelector(".contact-page .contact-info .contact-item:first-of-type .contact-text");
    if (address && settings.address) address.textContent = settings.address;

    const hoursList = document.querySelector("footer .hours-list");
    if (hoursList && Array.isArray(settings.hours)) {
      const hoursSignature = JSON.stringify(settings.hours);
      if (hoursList.dataset.cmsHours === hoursSignature) return;
      hoursList.dataset.cmsHours = hoursSignature;
      hoursList.replaceChildren();
      settings.hours.forEach((hour) => {
        const row = document.createElement("div");
        row.className = "hours-row";
        appendText(row, hour.day);
        appendText(row, hour.time);
        hoursList.appendChild(row);
      });
    }
  }

  async function initSiteSettings() {
    let settings;
    try {
      settings = await loadJson("site.json");
    } catch (err) {
      console.warn("Site settings unavailable:", err);
      return;
    }

    applySiteSettings(settings);

    const observer = new MutationObserver(() => applySiteSettings(settings));
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), 5000);
  }

  async function initServices() {
    if (!document.querySelector(".services-page, .home-main")) return;
    try {
      renderServices(await loadJson("services.json"));
    } catch (err) {
      console.warn("Services content unavailable:", err);
    }
  }

  async function initStylists() {
    if (!document.querySelector(".stylists-page")) return;
    try {
      renderStylists(await loadJson("stylists.json"));
    } catch (err) {
      console.warn("Stylist content unavailable:", err);
    }
  }

  function init() {
    initSiteSettings();
    initServices();
    initStylists();
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
