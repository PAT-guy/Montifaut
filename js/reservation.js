(() => {
  const C = window.GITE_CONFIG;
  const { parse, today, longDate, money, P, nightsBetween, minNightsFor, quote, quoteRows } = window.GitePricing;
  const $ = (s) => document.querySelector(s);
  const el = (tag, props = {}, ...kids) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (k === "class") n.className = v;
      else if (v !== false && v != null) n.setAttribute(k, v);
    }
    kids.flat().forEach((c) => n.append(c));
    return n;
  };

  const K = C.contact, L = C.location, S = C.stay;
  document.title = "Finaliser ma réservation | " + C.name;
  window.GiteBrand.fill($("#brand"));
  $("#u-addr").textContent = L.address;
  $("#u-tel").textContent = K.phone; $("#u-tel").href = "tel:" + K.phone.replace(/\s/g, "");
  $("#footer-text").textContent = `© ${new Date().getFullYear()} ${C.name}${K.company ? ", exploité par " + K.company : ""}.`;
  const toggle = document.querySelector(".menu-toggle"), nav = $("#nav");
  toggle.onclick = () => toggle.setAttribute("aria-expanded", nav.classList.toggle("open"));

  /* ---------- Séjour reçu par l'adresse ---------- */
  const q = new URLSearchParams(location.search);
  const start = q.get("in"), end = q.get("out");
  const guests = Math.min(S.capacity, Math.max(1, +q.get("g") || P().baseGuests));
  const minors = Math.min(guests - 1, Math.max(0, +q.get("m") || 0));
  const chosen = {};
  (q.get("x") || "").split(",").filter(Boolean).forEach((p) => { const [k, n] = p.split(":"); chosen[k] = Math.max(0, +n || 0); });
  const dateOk = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d || "");

  const problem = $("#problem");
  const fail = (html) => { problem.innerHTML = html; problem.hidden = false; $("#resa-grid").hidden = true; document.querySelector(".stepper").hidden = true; };
  const back = '<a href="index.html#reservation">Retourner au calendrier</a>';

  if (!dateOk(start) || !dateOk(end) || end <= start) {
    fail(`Aucune date choisie. ${back} pour sélectionner votre séjour.`);
    return;
  }
  if (start < today) { fail(`La date d'arrivée est passée. ${back}.`); return; }
  const nights = nightsBetween(start, end);
  if (nights.length < minNightsFor(start)) { fail(`Le séjour minimum est de ${minNightsFor(start)} nuits pour cette période. ${back}.`); return; }

  const qt = quote(start, end, guests, minors, chosen);

  /* ---------- Récapitulatif ---------- */
  $("#r-in").textContent = longDate(start);
  $("#r-out").textContent = longDate(end);
  const plural = (n, w) => `${n} ${w}${n > 1 ? "s" : ""}`;
  $("#r-group").textContent = `${plural(nights.length, "nuit")} · ${plural(guests, "voyageur")}${minors ? ` (dont ${plural(minors, "enfant")})` : ""}`;
  const box = $("#r-lines");
  const row = (l, v, cls = "") => box.append(el("div", { class: "row " + cls }, el("span", {}, l), el("span", {}, v)));
  quoteRows(qt).forEach(([l, v]) => row(l, v));
  row("Total estimé TTC", money(qt.total), "total");
  if (qt.deposit) {
    row(`Acompte à la réservation (${P().depositPercent} %)`, money(qt.deposit), "sub");
    row(`Solde ${P().balanceDue || "avant l'arrivée"}`, money(qt.total - qt.deposit), "sub");
  }
  $("#pay-note").textContent = `Acompte${qt.deposit ? " de " + money(qt.deposit) : ""} à la confirmation, solde ${P().balanceDue || "avant l'arrivée"}, caution de ${P().securityDeposit} € avant l'arrivée.`;

  /* ---------- Champs conditionnels ---------- */
  const f = $("#resa-form");
  const kindEls = f.querySelectorAll("[name=kind]"), partyEls = f.querySelectorAll("[name=party]");
  const sync = () => {
    $("#company-row").hidden = f.kind.value !== "Entreprise";
    $("#guests-row").hidden = f.party.value === "Pas de fête";
  };
  [...kindEls, ...partyEls].forEach((n) => n.addEventListener("change", sync));
  $("#kids-row").hidden = !minors;
  $("#dogs-row").hidden = !(chosen.chien > 0);

  // Sauvegarde locale du formulaire, pour ne rien perdre en cas de retour en arrière
  const KEY = "gite-resa-form";
  const fields = () => [...f.elements].filter((n) => n.name && n.name !== "website");
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
    fields().forEach((n) => {
      if (!(n.name in saved) || n.name === "rules" || n.name === "rgpd") return;
      if (n.type === "radio") n.checked = n.value === saved[n.name];
      else n.value = saved[n.name];
    });
  } catch (e) {}
  const persist = () => {
    try {
      const o = {};
      fields().forEach((n) => { if (n.type === "radio") { if (n.checked) o[n.name] = n.value; } else if (n.type !== "checkbox") o[n.name] = n.value; });
      localStorage.setItem(KEY, JSON.stringify(o));
    } catch (e) {}
  };
  f.addEventListener("input", persist); f.addEventListener("change", persist);
  sync();

  /* ---------- Vérification des disponibilités ---------- */
  let conflict = false;
  fetch("data/availability.json", { cache: "no-store" }).then((r) => r.json()).then((d) => {
    const blocked = new Set();
    (d.blocked || []).forEach((b) => nightsBetween(b.start, b.end).forEach((n) => blocked.add(n)));
    if (nights.some((n) => blocked.has(n))) {
      conflict = true;
      problem.innerHTML = `Ces dates viennent d'être réservées. <a href="index.html#reservation">Choisissez d'autres dates</a>.`;
      problem.hidden = false;
      $("#send").disabled = true;
    }
  }).catch(() => {});

  /* ---------- Envoi ---------- */
  const status = $("#form-status");
  const say = (t, ok) => { status.textContent = t; status.className = "status " + (ok ? "ok" : "err"); };

  // Texte du mail : en clair, aligné, sans espace insécable (certaines messageries les affichent mal)
  const plain = (t) => String(t).replace(/[\u00a0\u202f]/g, " ");
  const dateCourte = (d) => parse(d).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  function mailSubject() {
    const d1 = parse(start), d2 = parse(end);
    const mois = (d) => d.toLocaleDateString("fr-FR", { month: "long" });
    const per = d1.getMonth() === d2.getMonth() ? `${d1.getDate()} au ${d2.getDate()} ${mois(d2)} ${d2.getFullYear()}` : `${d1.getDate()} ${mois(d1)} au ${d2.getDate()} ${mois(d2)} ${d2.getFullYear()}`;
    return plain(`Demande de réservation · ${per} · ${plural(guests, "personne")} · ${f.elements.name.value.trim()}`);
  }

  function summaryText() {
    const v = (n) => (f.elements[n].value || "").trim();
    const row = (label, value) => (value ? `${(label + " :").padEnd(25)} ${value}` : null);
    const bar = (t) => ["", t.toUpperCase(), "-".repeat(46)];
    const enfants = minors ? ` (dont ${plural(minors, "enfant")} de moins de 18 ans)` : "";
    const entreprise = f.kind.value === "Entreprise";
    const fete = f.party.value !== "Pas de fête";
    const lines = [
      `Bonjour ${K.owner},`,
      "",
      `Je souhaite réserver le ${C.name} du ${dateCourte(start)} au ${dateCourte(end)}, pour ${plural(guests, "personne")}.`,
      "",
      "EN BREF",
      "=".repeat(46),
      row("Arrivée", `${dateCourte(start)}${v("arrival") ? ", " + v("arrival").charAt(0).toLowerCase() + v("arrival").slice(1) : ""}`),
      row("Départ", `${dateCourte(end)} (${plural(nights.length, "nuit")})`),
      row("Voyageurs", `${guests}${enfants}`),
      row("Total estimé TTC", money(qt.total)),
      qt.deposit ? row(`Acompte (${P().depositPercent} %)`, money(qt.deposit)) : null,
      ...bar("Devis détaillé (TTC)"),
      ...quoteRows(qt).map(([l, x]) => `  ${l} : ${x}`),
      `  TOTAL : ${money(qt.total)}`,
      qt.deposit ? `  Acompte à la réservation (${P().depositPercent} %) : ${money(qt.deposit)}` : "",
      qt.deposit ? `  Solde ${P().balanceDue || "avant l'arrivée"} : ${money(qt.total - qt.deposit)}` : "",
      ...bar("Mes coordonnées"),
      row("Nom", v("name")),
      row("Mail", v("email")),
      row("Téléphone", v("phone")),
      row("Adresse postale", v("address").replace(/\s*\n\s*/g, ", ")),
      row("Réservation", entreprise ? `Entreprise ou association : ${v("company")}` : "Particulier"),
      ...bar("Précisions sur le séjour"),
      row("Motif", v("reason")),
      row("Âge des enfants", minors ? v("kids") : ""),
      row("Chiens", chosen.chien > 0 ? `${chosen.chien} (${v("dogs") || "race et taille à préciser"}), à valider avec vous` : ""),
      row("Besoins particuliers", v("needs")),
      row("Fête ou événement", fete ? `${f.party.value}${v("visitors") ? ", " + v("visitors") + " personnes extérieures" : ""}` : ""),
      row("Paiement de l'acompte", v("pay")),
      "",
      v("message") ? `Mon message : ${v("message")}` : "",
      "",
      "J'ai pris connaissance du règlement intérieur et des conditions d'annulation (gratuite jusqu'à 14 jours avant l'arrivée).",
      "",
      "Cordialement,",
      v("name"),
      [v("phone"), v("email")].filter(Boolean).join(" · ")
    ];
    return plain(lines.filter((x) => x !== null).filter((x, i, arr) => !(x === "" && (arr[i - 1] === "" || i === 0))).join("\n"));
  }

  const nextSteps = () => [
    `Nous vérifions les dates et vous répondons sous ${K.responseTime}.`,
    `Vous recevez le contrat de location et les modalités pour régler l'acompte${qt.deposit ? " de " + money(qt.deposit) : ""}. Les dates sont bloquées à réception.`,
    `Le solde${qt.deposit ? " de " + money(qt.total - qt.deposit) : ""} est à régler ${P().balanceDue || "avant l'arrivée"}.`,
    `Avant votre arrivée, vous recevez le code de la boîte à clés et les consignes. Une caution de ${P().securityDeposit} € est demandée.`,
    "Pendant le séjour, nous restons joignables par téléphone."
  ];

  function showDone(sent, mailHref) {
    const text = summaryText();
    $("#resa-grid").hidden = true;
    document.querySelector(".stepper").innerHTML = '<li class="done"><span>1</span>Dates et devis</li><li class="done"><span>2</span>Votre séjour</li><li class="now"><span>3</span>Confirmation</li>';
    $("#done").hidden = false;
    $("#done-title").textContent = sent ? "Votre demande est envoyée" : "Plus qu'une étape : envoyer le mail";
    $("#done-lead").textContent = sent
      ? `Merci ${f.name.value.split(" ")[0] || ""}. Nous revenons vers vous à l'adresse ${f.email.value}.`
      : "Votre messagerie s'est ouverte avec votre demande déjà rédigée : il ne reste qu'à l'envoyer. Si rien ne s'est ouvert, utilisez les boutons ci-dessous.";
    const om = $("#open-mail");
    if (!sent) { om.href = mailHref; om.hidden = false; }
    $("#next-steps").replaceChildren(...nextSteps().map((t) => el("li", {}, t)));
    $("#copy").onclick = async () => {
      try { await navigator.clipboard.writeText(text); $("#copy-msg").textContent = "Récapitulatif copié."; }
      catch (e) { $("#copy-msg").textContent = "Copie impossible : sélectionnez le texte à la main."; }
    };
    try { localStorage.removeItem(KEY); } catch (e) {}
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  f.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (f.website.value) return; // piège anti-robot
    if (conflict) return say("Ces dates ne sont plus disponibles.", false);
    f.querySelectorAll(".bad").forEach((n) => n.classList.remove("bad"));
    const bad = [];
    if (!f.name.value.trim()) bad.push(f.name);
    if (!/^\S+@\S+\.\S+$/.test(f.email.value)) bad.push(f.email);
    if (f.phone.value.replace(/\D/g, "").length < 8) bad.push(f.phone);
    if (f.kind.value === "Entreprise" && !f.company.value.trim()) bad.push(f.company);
    if (!f.rules.checked) bad.push(f.rules);
    if (!f.rgpd.checked) bad.push(f.rgpd);
    if (bad.length) {
      bad.forEach((n) => n.classList.add("bad"));
      bad[0].scrollIntoView({ behavior: "smooth", block: "center" });
      return say("Complétez les champs en rouge pour envoyer votre demande.", false);
    }
    const subject = mailSubject();
    const body = summaryText();
    if (!K.formEndpoint) {
      const href = `mailto:${K.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      showDone(false, href);
      location.href = href;
      return;
    }
    const btn = $("#send");
    btn.disabled = true;
    try {
      const res = await fetch(K.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: f.name.value, email: f.email.value, phone: f.phone.value, _subject: subject, message: body })
      });
      if (!res.ok) throw new Error(res.status);
      showDone(true);
    } catch (err) {
      say(`L'envoi a échoué. Écrivez-nous directement à ${K.email} ou appelez le ${K.phone}.`, false);
    } finally { btn.disabled = false; }
  });
})();
