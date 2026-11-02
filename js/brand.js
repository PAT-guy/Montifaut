/* Logo du gîte : emblème dans l'en-tête, logo complet dans le pied de page. */
window.GiteBrand = (() => {
  const C = window.GITE_CONFIG;
  const img = (src, cls) => { const i = document.createElement("img"); i.src = src; i.alt = ""; i.className = cls; i.decoding = "async"; return i; };
  function fill(brand) {
    brand.replaceChildren(
      img("images/logo/embleme-vert.svg", "mark mark-vert"),
      img("images/logo/embleme-or.svg", "mark mark-or"),
      Object.assign(document.createElement("span"), { textContent: C.shortName || C.name })
    );
    brand.setAttribute("aria-label", C.name);
    const footer = document.querySelector("footer");
    if (footer && !footer.querySelector(".footer-logo")) {
      const l = img("images/logo/logo-principal-or.svg", "footer-logo");
      l.alt = C.name;
      footer.prepend(l);
    }
  }
  return { fill };
})();
