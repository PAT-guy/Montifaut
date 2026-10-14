(() => {
  const C = window.GITE_CONFIG;
  const $ = (s) => document.querySelector(s);

  const el = (tag, props = {}, ...kids) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (k === "class") n.className = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) n.setAttribute(k, v);
    }
    kids.flat().forEach((c) => n.append(c));
    return n;
  };

  /* ---------- Dates ---------- */
  const pad = (n) => String(n).padStart(2, "0");
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const today = iso(new Date());
  const longDate = (s) => parse(s).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
  const money = (n) => n.toLocaleString("fr-FR", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }) + " " + P().currency;
  const P = () => C.pricing;

  /* ---------- Tarifs ---------- */
  function seasonFor(dateIso) {
    const md = dateIso.slice(5);
    return P().seasons.find((s) => (s.from <= s.to ? md >= s.from && md <= s.to : md >= s.from || md <= s.to));
  }
  const nightlyFor = (d) => (seasonFor(d) || {}).nightly ?? P().defaultNightly;
  const minNightsFor = (d) => (seasonFor(d) || {}).minNights ?? P().minNights;

  function nightsBetween(a, b) {
    const out = [];
    for (let d = parse(a); iso(d) < b; d = addDays(d, 1)) out.push(iso(d));
    return out;
  }

  function quote(start, end, guests) {
    const nights = nightsBetween(start, end);
    const lodging = nights.reduce((sum, d) => sum + nightlyFor(d), 0);
    const extra = Math.max(0, guests - P().baseGuests) * P().extraGuestPerNight * nights.length;
    const tax = P().touristTaxPerPersonNight * guests * nights.length;
    const total = lodging + extra + P().cleaningFee + tax;
    return { nights, lodging, extra, tax, cleaning: P().cleaningFee, total };
  }

  /* ---------- Disponibilités ---------- */
  const blocked = new Set(); // nuits occupées (date de la nuit)

  async function loadAvailability() {
    const notice = $("#avail-notice");
    try {
      const res = await fetch("data/availability.json", { cache: "no-store" });
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      (data.blocked || []).forEach((b) => nightsBetween(b.start, b.end).forEach((n) => blocked.add(n)));
      if (data.updated) {
        notice.textContent = "Calendrier mis à jour le " + new Date(data.updated).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" }) + ".";
        notice.hidden = false;
      }
    } catch (e) {
      notice.textContent = "Le calendrier n'a pas pu être chargé : les dates affichées comme libres ne sont pas garanties. Contactez-nous pour confirmer.";
      notice.hidden = false;
    }
  }

  const rangeFree = (a, b) => nightsBetween(a, b).every((n) => !blocked.has(n));

  /* ---------- Contenu statique ---------- */
  function renderStatic() {
    document.title = C.name + " | Location de vacances";
    $("#brand").textContent = C.name;
    const h1 = $("#hero-title");
    if (C.titleLight && C.titleStrong) h1.append(C.titleLight + " ", el("span", { class: "hl" }, C.titleStrong));
    else h1.textContent = C.name;
    $("#hero-tagline").textContent = C.tagline;
    $("#hero").style.setProperty("--hero", `url("${new URL(C.heroImage, location.href).href}")`);

    const s = C.stay;
    [`${s.capacity} personnes`, `${s.bedrooms} chambres`, `${s.bathrooms} salles d'eau`, `${s.surface} m²`]
      .forEach((t) => $("#hero-facts").append(el("li", {}, t)));

    C.description.forEach((p) => $("#description").append(el("p", {}, p)));
    C.amenities.forEach((a) => $("#amenities").append(el("li", {}, a)));
    C.rooms.forEach((r) => $("#rooms").append(el("div", { class: "card" }, el("h4", {}, r.title), el("p", {}, r.text))));

    const info = (item) => el("div", { class: "card" },
      el("span", { class: "dist" }, item.distance), el("h4", {}, item.title), el("p", {}, item.text));
    C.activities.forEach((a) => $("#activities").append(info(a)));
    C.visits.forEach((v) => $("#visits").append(info(v)));

    C.rules.forEach((r) => $("#rules").append(el("div", {}, el("dt", {}, r.title), el("dd", {}, r.text))));

    const L = C.location, K = C.contact;
    $("#address").textContent = L.address;
    $("#access").textContent = L.access;
    $("#route").href = `https://www.openstreetmap.org/directions?to=${L.lat}%2C${L.lng}`;
    $("#route").textContent = "Calculer l'itinéraire";
    const dLat = 0.012, dLng = 0.02;
    $("#map").src = `https://www.openstreetmap.org/export/embed.html?bbox=${L.lng - dLng}%2C${L.lat - dLat}%2C${L.lng + dLng}%2C${L.lat + dLat}&layer=mapnik&marker=${L.lat}%2C${L.lng}`;

    $("#contact-lead").textContent = `${K.owner} vous répond généralement sous 24 heures.`;
    const phone = $("#c-phone"); phone.href = "tel:" + K.phone.replace(/\s/g, "");
    phone.append(el("small", {}, "Téléphone"), K.phone);
    const mail = $("#c-mail"); mail.href = "mailto:" + K.email;
    mail.append(el("small", {}, "Courriel"), K.email);
    $("#footer-text").textContent = `© ${new Date().getFullYear()} ${C.name}. Arrivée ${s.checkIn}, départ ${s.checkOut}.`;

    // Galerie et visionneuse
    const lb = $("#lightbox"), lbImg = lb.querySelector("img");
    let cur = 0;
    const show = (i) => { cur = (i + C.photos.length) % C.photos.length; lbImg.src = C.photos[cur].src; lbImg.alt = C.photos[cur].alt; };
    C.photos.forEach((p, i) => $("#gallery").append(
      el("button", { type: "button", "data-caption": p.alt, "aria-label": "Agrandir : " + p.alt, onclick: () => { show(i); lb.showModal(); } },
        el("img", { src: p.src, alt: p.alt, loading: "lazy" }))));
    lb.querySelector(".lb-close").onclick = () => lb.close();
    $("#lb-prev").onclick = () => show(cur - 1);
    $("#lb-next").onclick = () => show(cur + 1);
    lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
    lb.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") show(cur - 1); if (e.key === "ArrowRight") show(cur + 1); });

    // Menu mobile
    const nav = $("#nav"), toggle = document.querySelector(".menu-toggle");
    toggle.onclick = () => toggle.setAttribute("aria-expanded", nav.classList.toggle("open"));
    nav.addEventListener("click", () => { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); });

    // Éléments propres au thème Domaine (masqués par les autres thèmes)
    $("#u-addr").textContent = L.address;
    $("#u-tel").textContent = K.phone; $("#u-tel").href = "tel:" + K.phone.replace(/\s/g, "");
    const ICONS = {
      tree: '<circle cx="24" cy="18" r="11"/><path d="M24 29v13M24 36l-6-5M24 34l6-5"/>',
      house: '<path d="M6 24 24 8l18 16M11 21v20h26V21"/><path d="M20 41V30h8v11"/>',
      compass: '<circle cx="24" cy="24" r="16"/><path d="M31 17l-5 10-10 5 5-10z"/>',
      key: '<circle cx="16" cy="24" r="8"/><path d="M24 24h18M36 24v7M42 24v5"/>'
    };
    (C.highlights || []).forEach((h) => {
      const icon = el("span", { class: "ico" });
      icon.innerHTML = `<svg viewBox="0 0 48 48" aria-hidden="true">${ICONS[h.icon] || ""}</svg>`;
      $("#features-grid").append(el("div", { class: "feat" }, icon,
        el("div", { class: "ft" }, h.light, el("b", {}, h.strong)), el("hr"), el("p", {}, h.text)));
    });
    const facts = [`${s.capacity} personnes`, `${s.bedrooms} chambres, ${s.beds} lits`, `${s.bathrooms} salles d'eau`, `${s.surface} m²`, `Arrivée ${s.checkIn}`, `Départ ${s.checkOut}`];
    $("#keyfacts").append(el("ul", {}, facts.map((t) => el("li", {}, t))),
      el("div", { class: "btns" }, el("a", { class: "btn", href: "#reservation" }, "Voir les disponibilités"), el("a", { class: "btn ghost", href: "#contact" }, "Nous contacter")));
    const ph = C.photos[1] || C.photos[0];
    if (ph) $("#gite-banner").append(el("img", { src: ph.src, alt: ph.alt, loading: "lazy" }));

    renderRates();
  }

  function renderRates() {
    const md = (s) => new Date(2000, +s.slice(0, 2) - 1, +s.slice(3)).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
    const t = $("#rates");
    t.append(el("thead", {}, el("tr", {}, ["Période", "Prix par nuit", "Séjour minimum"].map((h) => el("th", {}, h)))));
    const body = el("tbody");
    P().seasons.forEach((s) => body.append(el("tr", {}, el("td", {}, `${s.name} (du ${md(s.from)} au ${md(s.to)})`), el("td", {}, money(s.nightly)), el("td", {}, `${s.minNights} nuits`))));
    body.append(el("tr", {}, el("td", {}, "Autres périodes"), el("td", {}, money(P().defaultNightly)), el("td", {}, `${P().minNights} nuits`)));
    t.append(body);
    $("#rates-notes").textContent =
      `Prix pour ${P().baseGuests} personnes, supplément de ${money(P().extraGuestPerNight)} par personne et par nuit au-delà. ` +
      `Frais de ménage : ${money(P().cleaningFee)}. Taxe de séjour : ${money(P().touristTaxPerPersonNight)} par personne et par nuit.`;
  }

  /* ---------- Calendrier ---------- */
  const state = { start: null, end: null, offset: 0 };
  const MAX_OFFSET = 18;

  function renderCalendar() {
    const wrap = $("#months");
    wrap.replaceChildren();
    const base = new Date(); base.setDate(1); base.setMonth(base.getMonth() + state.offset);
    for (let m = 0; m < 2; m++) {
      const first = new Date(base.getFullYear(), base.getMonth() + m, 1);
      const grid = el("div", { class: "grid" });
      ["L", "M", "M", "J", "V", "S", "D"].forEach((w) => grid.append(el("div", { class: "wd" }, w)));
      const lead = (first.getDay() + 6) % 7;
      for (let i = 0; i < lead; i++) grid.append(el("div", { class: "day empty" }));
      const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
      for (let d = 1; d <= days; d++) {
        const day = iso(new Date(first.getFullYear(), first.getMonth(), d));
        const cls = ["day"];
        const isStart = day === state.start, isEnd = day === state.end;
        if (day < today) cls.push("past");
        else if (isStart) cls.push("start");
        else if (isEnd) cls.push("end");
        else if (state.start && state.end && day > state.start && day < state.end) cls.push("range");
        else if (blocked.has(day)) cls.push("booked");
        const btn = el("button", { type: "button", class: cls.join(" "), "aria-label": longDate(day) + (blocked.has(day) ? ", occupé" : ""), onclick: () => pick(day) }, String(d));
        if (day < today) btn.disabled = true;
        grid.append(btn);
      }
      wrap.append(el("div", { class: "month" }, el("h4", {}, first.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })), grid));
    }
    $("#prev").disabled = state.offset <= 0;
    $("#next").disabled = state.offset >= MAX_OFFSET;
  }

  function pick(day) {
    const hint = $("#hint");
    hint.textContent = "";
    const fresh = !state.start || state.end;
    if (fresh) {
      if (blocked.has(day)) return;
      state.start = day; state.end = null;
    } else if (day <= state.start) {
      if (blocked.has(day)) return;
      state.start = day;
    } else if (rangeFree(state.start, day)) {
      state.end = day;
    } else if (!blocked.has(day)) {
      state.start = day;
      hint.textContent = "Des nuits sont déjà réservées sur cette période. Nouvelle arrivée choisie.";
    } else {
      hint.textContent = "Des nuits sont déjà réservées sur cette période.";
      return;
    }
    update();
  }

  function validity() {
    if (!state.start || !state.end) return "";
    const n = nightsBetween(state.start, state.end).length;
    const min = minNightsFor(state.start);
    if (n < min) return `Séjour minimum de ${min} nuits pour cette période.`;
    return "";
  }

  function update() {
    renderCalendar();
    $("#sum-in").textContent = state.start ? longDate(state.start) : "à choisir";
    $("#sum-out").textContent = state.end ? longDate(state.end) : "à choisir";
    if (state.start && !state.end && !$("#hint").textContent) {
      $("#hint").textContent = `Choisissez maintenant la date de départ (minimum ${minNightsFor(state.start)} nuits).`;
      $("#hint").style.color = "var(--muted)";
    } else $("#hint").style.color = "";
    const problem = validity();
    if (problem) $("#hint").textContent = problem;
    renderPrice(problem);
  }

  function renderPrice(problem) {
    const box = $("#price-lines");
    box.replaceChildren();
    if (!state.start || !state.end || problem) return;
    const guests = +$("#guests").value;
    const q = quote(state.start, state.end, guests);
    const row = (label, value, cls = "") => box.append(el("div", { class: "row " + cls }, el("span", {}, label), el("span", {}, value)));
    row(`Hébergement (${q.nights.length} nuits)`, money(q.lodging));
    if (q.extra) row(`Voyageurs supplémentaires`, money(q.extra));
    row("Frais de ménage", money(q.cleaning));
    row("Taxe de séjour", money(q.tax));
    row("Total estimé", money(q.total), "total");
  }

  /* ---------- Formulaire ---------- */
  function setupForm() {
    const sel = $("#guests");
    for (let i = 1; i <= C.stay.capacity; i++) sel.append(el("option", { value: i }, i + (i > 1 ? " personnes" : " personne")));
    sel.value = String(Math.min(P().baseGuests, C.stay.capacity));
    sel.addEventListener("change", update);
    $("#prev").onclick = () => { state.offset = Math.max(0, state.offset - 1); renderCalendar(); };
    $("#next").onclick = () => { state.offset = Math.min(MAX_OFFSET, state.offset + 1); renderCalendar(); };

    $("#booking-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = e.target, status = $("#form-status");
      const say = (t, ok) => { status.textContent = t; status.className = "status " + (ok ? "ok" : "err"); };
      if (f.website.value) return; // piège anti-robot
      if (!state.start || !state.end) return say("Choisissez vos dates sur le calendrier.", false);
      const problem = validity();
      if (problem) return say(problem, false);
      if (!f.name.value.trim() || !/^\S+@\S+\.\S+$/.test(f.email.value)) return say("Indiquez votre nom et une adresse mail valide.", false);

      const guests = +f.guests.value;
      const q = quote(state.start, state.end, guests);
      const body = [
        `Demande de réservation pour ${C.name}`,
        `Arrivée : ${longDate(state.start)}`,
        `Départ : ${longDate(state.end)} (${q.nights.length} nuits)`,
        `Voyageurs : ${guests}`,
        `Total estimé : ${money(q.total)}`,
        `Nom : ${f.name.value}`,
        `Mail : ${f.email.value}`,
        `Téléphone : ${f.phone.value || "non renseigné"}`,
        `Message : ${f.message.value || "aucun"}`
      ].join("\n");

      if (!C.contact.formEndpoint) {
        location.href = `mailto:${C.contact.email}?subject=${encodeURIComponent("Demande de réservation du " + state.start + " au " + state.end)}&body=${encodeURIComponent(body)}`;
        return say("Votre messagerie s'ouvre avec la demande préremplie : il ne reste qu'à l'envoyer.", true);
      }
      const btn = f.querySelector("button[type=submit]");
      btn.disabled = true;
      try {
        const res = await fetch(C.contact.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ name: f.name.value, email: f.email.value, phone: f.phone.value, message: body })
        });
        if (!res.ok) throw new Error(res.status);
        say("Demande envoyée. Nous vous répondons rapidement par mail.", true);
        f.reset(); state.start = state.end = null; update();
      } catch (err) {
        say(`L'envoi a échoué. Écrivez-nous directement à ${C.contact.email}.`, false);
      } finally { btn.disabled = false; }
    });
  }

  /* ---------- Aperçu des thèmes (visible avec ?themes dans l'adresse) ---------- */
  function themeSwitcher() {
    const q = new URLSearchParams(location.search);
    if (!q.has("themes") && !q.has("theme")) return;
    const names = { domaine: "Domaine", sologne: "Sologne", chasse: "Chasse", tradition: "Tradition", champetre: "Champêtre" };
    const cur = document.documentElement.dataset.theme;
    const bar = el("div", { class: "theme-bar" }, el("span", {}, "Thème :"),
      Object.entries(names).map(([k, v]) => el("a", { href: `?theme=${k}`, class: k === cur ? "on" : "" }, v)));
    document.body.append(bar);
  }

  /* ---------- Transitions au défilement ---------- */
  function scrollReveal() {
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("motion");
    document.querySelectorAll(".hero-text > *").forEach((n, i) => n.style.setProperty("--h", i));
    const groups = [".wrap > h2", ".wrap > h3", ".wrap > .lead", ".two-col > *", ".gite-banner", ".feat", ".cards .card", ".gallery button",
      ".booking > *", ".rules > div", ".table-wrap", "#map", ".contact-cards > *"];
    const seen = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const n = e.target;
        io.unobserve(n);
        n.classList.add("rv-in");
        setTimeout(() => n.classList.remove("rv", "rv-in", "rv-img"), 1500); // rend la main aux effets de survol du thème
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    groups.forEach((sel) => document.querySelectorAll(sel).forEach((n) => {
      if (seen.has(n)) return;
      seen.add(n);
      const sibs = n.parentElement ? [...n.parentElement.children].filter((c) => c.matches(sel)) : [n];
      n.style.setProperty("--i", Math.min(sibs.indexOf(n), 5));
      n.classList.add("rv");
      if (n.matches(".gallery button, .gite-banner")) n.classList.add("rv-img");
      io.observe(n);
    }));
  }

  /* ---------- Démarrage ---------- */
  themeSwitcher();
  renderStatic();
  setupForm();
  renderCalendar();
  loadAvailability().then(update);
  scrollReveal();
})();
