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
  function periodFor(dateIso) {
    const sp = (P().specialDates || []).find((x) => dateIso >= x.from && dateIso <= x.to);
    if (sp) return { name: sp.name, nightly: sp.nightly, minNights: sp.minNights ?? P().minNights };
    const se = seasonFor(dateIso);
    if (se) return { name: se.name, nightly: se.nightly, minNights: se.minNights ?? P().minNights };
    return { name: P().defaultName || "Autres périodes", nightly: P().defaultNightly, minNights: P().minNights };
  }
  const nightlyFor = (d) => periodFor(d).nightly;
  const minNightsFor = (d) => periodFor(d).minNights;

  function nightsBetween(a, b) {
    const out = [];
    for (let d = parse(a); iso(d) < b; d = addDays(d, 1)) out.push(iso(d));
    return out;
  }

  function durationCoef(n) {
    const r = (P().durationCoefficients || []).find((c) => n >= c.from && (c.to == null || n <= c.to));
    return r ? r.coef : 1;
  }
  const pct = (coef) => { const v = Math.round((coef - 1) * 1000) / 10; return (v > 0 ? "+" : "") + String(v).replace(".", ",") + " %"; };

  function quote(start, end, guests, minors = 0, chosen = {}) {
    const nights = nightsBetween(start, end);
    const groups = new Map();
    nights.forEach((n) => {
      const p = periodFor(n), key = p.name + "|" + p.nightly;
      if (!groups.has(key)) groups.set(key, { name: p.name, nightly: p.nightly, count: 0 });
      groups.get(key).count++;
    });
    const lodging = nights.reduce((sum, d) => sum + nightlyFor(d), 0);
    const extraGuests = Math.max(0, guests - P().baseGuests);
    const extra = extraGuests * P().extraGuestPerNight * nights.length;
    const coef = durationCoef(nights.length);
    const adjustment = Math.round((lodging + extra) * (coef - 1) * 100) / 100;
    const adults = Math.max(0, guests - minors);
    const tax = P().touristTaxPerPersonNight * adults * nights.length;
    const options = (P().extras || []).map((x) => {
      const qty = chosen[x.id] || 0;
      return qty ? { label: x.label, qty, amount: x.price * qty * (x.per === "night" ? nights.length : 1) } : null;
    }).filter(Boolean);
    const optionsTotal = options.reduce((a, o) => a + o.amount, 0);
    const total = lodging + extra + adjustment + P().cleaningFee + optionsTotal + tax;
    const deposit = P().depositPercent ? Math.round(total * P().depositPercent) / 100 : 0;
    return { nights, groups: [...groups.values()], lodging, extraGuests, extra, coef, adjustment, adults, tax, options, cleaning: P().cleaningFee, total, deposit };
  }

  // Lignes du devis, utilisées à l'écran et dans le message envoyé
  function quoteRows(q) {
    const plural = (n, w) => `${n} ${w}${n > 1 ? "s" : ""}`;
    const rows = q.groups.map((g) => [`${plural(g.count, "nuit")} · ${g.name} (${money(g.nightly)} par nuit)`, money(g.count * g.nightly)]);
    if (q.extraGuests) rows.push([`${plural(q.extraGuests, "voyageur")} en plus · ${money(P().extraGuestPerNight)} par nuit et par personne`, money(q.extra)]);
    if (q.adjustment) rows.push([`Durée du séjour, ${plural(q.nights.length, "nuit")} (${pct(q.coef)})`, (q.adjustment > 0 ? "+" : "") + money(q.adjustment)]);
    if (q.cleaning) rows.push(["Frais de ménage", money(q.cleaning)]);
    q.options.forEach((o) => rows.push([o.qty > 1 ? `${o.label} × ${o.qty}` : o.label, o.amount ? money(o.amount) : "offert"]));
    rows.push([`Taxe de séjour (${plural(q.adults, "adulte")})`, money(q.tax)]);
    return rows;
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
    [`${s.capacity} personnes`, `${s.bedrooms} chambres`, `${s.bathrooms} salle${s.bathrooms > 1 ? "s" : ""} de bain`, `${s.surface} m²`]
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

    $("#contact-lead").textContent = "Nous répondons généralement sous 24 heures.";
    const phone = $("#c-phone"); phone.href = "tel:" + K.phone.replace(/\s/g, "");
    phone.append(el("small", {}, "Téléphone"), K.phone);
    const mail = $("#c-mail"); mail.href = "mailto:" + K.email;
    mail.append(el("small", {}, "Courriel"), K.email);
    $("#footer-text").textContent = `© ${new Date().getFullYear()} ${C.name}${K.company ? ", exploité par " + K.company : ""}. Arrivée ${s.checkIn}, départ ${s.checkOut}.`;

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

    (C.faq || []).forEach((f) => $("#faq-list").append(el("details", {}, el("summary", {}, f.q), el("p", {}, f.a))));

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
    const facts = [`${s.capacity} personnes`, `${s.bedrooms} chambres, ${s.beds} lits`, `${s.bathrooms} salle${s.bathrooms > 1 ? "s" : ""} de bain, ${s.toilets} WC`, `${s.surface} m²`, `Arrivée ${s.checkIn}`, `Départ ${s.checkOut}`];
    $("#keyfacts").append(el("ul", {}, facts.map((t) => el("li", {}, t))),
      el("div", { class: "btns" }, el("a", { class: "btn", href: "#reservation" }, "Voir les disponibilités"), el("a", { class: "btn ghost", href: "#contact" }, "Nous contacter")));
    const ph = C.photos[1] || C.photos[0];
    if (ph) $("#gite-banner").append(el("img", { src: ph.src, alt: ph.alt, loading: "lazy" }));

    renderRates();
  }

  function durationText() {
    const list = P().durationCoefficients || [];
    if (!list.length) return "";
    const lab = (c) => c.label ? `${c.label} (${c.to == null ? c.from + " nuits et plus" : c.from + " à " + c.to + " nuits"})` : c.to == null ? `${c.from} nuits et plus` : c.from === c.to ? `${c.from} nuits` : `${c.from} à ${c.to} nuits`;
    return ` Selon la durée du séjour, un coefficient s'applique à l'hébergement : ` + list.map((c) => `${lab(c)} ${c.coef === 1 ? "tarif normal" : pct(c.coef)}`).join(", ") + ". Séjour minimum : 2 nuits.";
  }

  function renderRates() {
    const md = (x) => new Date(2000, +x.slice(0, 2) - 1, +x.slice(3)).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
    const full = (x) => parse(x).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    const t = $("#rates");
    t.append(el("thead", {}, el("tr", {}, ["Période", `Prix par nuit (${P().baseGuests} personnes)`, "Séjour minimum"].map((h) => el("th", {}, h)))));
    const body = el("tbody");
    const line = (label, price, min) => body.append(el("tr", {}, el("td", {}, label), el("td", {}, money(price)), el("td", {}, `${min} nuits`)));
    line(`${P().defaultName || "Autres périodes"} (le reste de l'année)`, P().defaultNightly, P().minNights);
    P().seasons.forEach((x) => line(`${x.name} (du ${md(x.from)} au ${md(x.to)})`, x.nightly, x.minNights));
    (P().specialDates || []).filter((x) => x.to >= today).forEach((x) => line(`${x.name} (nuits du ${full(x.from)} au ${full(x.to)})`, x.nightly, x.minNights ?? P().minNights));
    t.append(body);
    const cap = C.stay.capacity;
    $("#rates-notes").textContent =
      `Prix par nuit pour ${P().baseGuests} personnes minimum, avec un supplément de ${money(P().extraGuestPerNight)} par personne et par nuit au-delà, jusqu'à ${cap} personnes. ` +
      `Tous les prix sont TTC. Draps et serviettes fournis. ${P().cleaningFee ? `Frais de ménage : ${money(P().cleaningFee)}.` : "Ménage compris."} Taxe de séjour : ${money(P().touristTaxPerPersonNight)} par adulte et par nuit. ` +
      `Les dates exceptionnelles (week-ends fériés, ponts) remplacent le tarif de la saison.` + durationText();
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

  function chosenExtras() {
    const out = {};
    (P().extras || []).forEach((x) => { const n = document.querySelector(`[data-extra="${x.id}"]`); if (n) out[x.id] = n.type === "checkbox" ? (n.checked ? 1 : 0) : +n.value; });
    return out;
  }

  function renderPrice(problem) {
    const box = $("#price-lines");
    box.replaceChildren();
    if (!state.start || !state.end || problem) return;
    const guests = +$("#guests").value;
    const q = quote(state.start, state.end, guests, +$("#minors").value || 0, chosenExtras());
    const row = (label, value, cls = "") => box.append(el("div", { class: "row " + cls }, el("span", {}, label), el("span", {}, value)));
    quoteRows(q).forEach(([l, v]) => row(l, v));
    row("Total estimé TTC", money(q.total), "total");
    if (q.deposit) {
      row(`Acompte à la réservation (${P().depositPercent} %)`, money(q.deposit), "sub");
      row("Solde avant l'arrivée", money(q.total - q.deposit), "sub");
    }
  }

  /* ---------- Formulaire ---------- */
  function setupForm() {
    const sel = $("#guests"), minors = $("#minors");
    for (let i = 1; i <= C.stay.capacity; i++) sel.append(el("option", { value: i }, i + (i > 1 ? " personnes" : " personne")));
    sel.value = String(Math.min(P().baseGuests, C.stay.capacity));
    const fillMinors = () => {
      const keep = +minors.value || 0;
      minors.replaceChildren();
      for (let i = 0; i < +sel.value; i++) minors.append(el("option", { value: i }, String(i)));
      minors.value = String(Math.min(keep, +sel.value - 1));
    };
    fillMinors();
    sel.addEventListener("change", () => { fillMinors(); update(); });
    minors.addEventListener("change", update);
    $("#guest-note").textContent = `Tarif de base pour ${P().baseGuests} personnes minimum, facturées même si le groupe est plus petit.`;
    (P().extras || []).forEach((x) => {
      const input = x.max > 1
        ? el("select", { "data-extra": x.id }, Array.from({ length: x.max + 1 }, (_, i) => el("option", { value: i }, String(i))))
        : el("input", { type: "checkbox", "data-extra": x.id });
      input.addEventListener("change", update);
      $("#extras").append(el("label", { class: "opt" }, el("span", {}, `${x.label} `, el("small", {}, x.price ? `${money(x.price)} ${x.unit}` : x.unit)), input));
    });
    if (!(P().extras || []).length) $("#extras").hidden = true;
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
      const q = quote(state.start, state.end, guests, +f.minors.value || 0, chosenExtras());
      const body = [
        `Demande de réservation pour ${C.name}`,
        `Arrivée : ${longDate(state.start)}`,
        `Départ : ${longDate(state.end)} (${q.nights.length} nuits)`,
        `Voyageurs : ${guests} (dont ${f.minors.value} de moins de 18 ans)`,
        "",
        "Devis estimatif :",
        ...quoteRows(q).map(([l, v]) => `- ${l} : ${v}`),
        `Total estimé TTC : ${money(q.total)}`,
        q.deposit ? `Acompte (${P().depositPercent} %) : ${money(q.deposit)}` : "",
        "",
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
      ".booking > *", ".faq-list > details", ".rules > div", ".table-wrap", "#map", ".contact-cards > *"];
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
