(() => {
  const C = window.GITE_CONFIG;
  const { today, longDate, money, P, nightsBetween, minNightsFor, quote, quoteRows } = window.GitePricing;
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

  function summaryText() {
    const v = (n) => (f.elements[n].value || "").trim();
    const lines = [
      `Demande de réservation pour ${C.name}`,
      "",
      "SÉJOUR",
      `Arrivée : ${longDate(start)}`,
      `Départ : ${longDate(end)} (${plural(nights.length, "nuit")})`,
      `Voyageurs : ${guests}${minors ? ` (dont ${minors} enfant${minors > 1 ? "s" : ""} de moins de 18 ans)` : ""}`,
      "",
      "DEVIS ESTIMATIF TTC",
      ...quoteRows(qt).map(([l, x]) => `- ${l} : ${x}`),
      `Total : ${money(qt.total)}`,
      qt.deposit ? `Acompte (${P().depositPercent} %) : ${money(qt.deposit)}` : "",
      "",
      "COORDONNÉES",
      `Nom : ${v("name")}`,
      `Mail : ${v("email")}`,
      `Téléphone : ${v("phone")}`,
      `Adresse : ${v("address") || "non renseignée"}`,
      `Réservation en tant que : ${f.kind.value}${f.kind.value === "Entreprise" ? " (" + v("company") + ")" : ""}`,
      "",
      "MODALITÉS",
      `Motif : ${v("reason") || "non précisé"}`,
      `Arrivée prévue : ${v("arrival") || "non précisée"}`,
      minors ? `Âge des enfants : ${v("kids") || "non précisé"}` : "",
      chosen.chien > 0 ? `Chiens : ${chosen.chien} (${v("dogs") || "race et taille non précisées"})` : "",
      `Besoins particuliers : ${v("needs") || "aucun"}`,
      `Fête prévue : ${f.party.value}${f.party.value !== "Pas de fête" ? ` (${v("visitors") || "0"} personnes extérieures)` : ""}`,
      `Paiement de l'acompte : ${v("pay") || "à discuter"}`,
      `Règlement et conditions d'annulation acceptés : oui`,
      "",
      `Message : ${v("message") || "aucun"}`
    ];
    return lines.filter((x, i, a) => !(x === "" && a[i - 1] === "")).join("\n");
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
    const subject = `Demande de réservation du ${start} au ${end}`;
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
