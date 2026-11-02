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
    if (footer && !footer.querySelector(".footer-brand")) {
      const box = document.createElement("div");
      box.className = "footer-brand";
      const name = document.createElement("strong"); name.textContent = C.name;
      const sub = document.createElement("em"); sub.textContent = "& relais de chasse en Sologne";
      box.append(img("images/logo/embleme-or.svg", "footer-mark"), name, sub);
      footer.prepend(box);
    }
  }
  return { fill };
})();
