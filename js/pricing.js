/* Calcul des prix et du devis, partagé par la page principale et la page de réservation. */
(() => {
  const C = window.GITE_CONFIG;

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
  /* ---------- Jours fériés et ponts, calculés automatiquement ---------- */
  function easter(y) {
    const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25),
      g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4,
      l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
      month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(y, month - 1, day);
  }
  const HOLIDAY_LABEL = { "Jour de l'an": "Nouvel an", "Lundi de Pâques": "Week-end de Pâques", "Fête du Travail": "Pont du 1er mai", "Victoire 1945": "Pont du 8 mai",
    "Ascension": "Pont de l'Ascension", "Lundi de Pentecôte": "Week-end de Pentecôte", "Fête nationale": "Pont du 14 juillet", "Assomption": "Pont du 15 août",
    "Toussaint": "Pont de la Toussaint", "Armistice": "Pont du 11 novembre", "Noël": "Noël" };
  let holidayCache = null;
  function holidayMap() {
    if (holidayCache) return holidayCache;
    const hp = P().holidayPricing;
    holidayCache = new Map();
    if (!hp) return holidayCache;
    const put = (d, name, year, nightly) => {
      const k = iso(d), cur = holidayCache.get(k);
      if (!cur || nightly > cur.nightly) holidayCache.set(k, { name: `${HOLIDAY_LABEL[name] || name} ${year}`, nightly, minNights: hp.minNights ?? P().minNights });
    };
    const y0 = new Date().getFullYear() - 1;
    for (let y = y0; y <= y0 + 8; y++) {
      const e = easter(y);
      const list = [["Jour de l'an", new Date(y, 0, 1)], ["Lundi de Pâques", addDays(e, 1)], ["Fête du Travail", new Date(y, 4, 1)], ["Victoire 1945", new Date(y, 4, 8)],
        ["Ascension", addDays(e, 39)], ["Lundi de Pentecôte", addDays(e, 50)], ["Fête nationale", new Date(y, 6, 14)], ["Assomption", new Date(y, 7, 15)],
        ["Toussaint", new Date(y, 10, 1)], ["Armistice", new Date(y, 10, 11)], ["Noël", new Date(y, 11, 25)]];
      list.forEach(([name, h]) => {
        const price = (hp.byName && hp.byName[name]) ?? hp.nightly;
        let from, to;                           // décalages en jours par rapport au jour férié (nuits)
        if (name === "Noël") [from, to] = [-1, 0];
        else if (name === "Jour de l'an") [from, to] = [-2, -1];
        else {
          const wd = h.getDay();
          if (wd === 1) [from, to] = [-3, -1];  // lundi : du vendredi au dimanche soir
          else if (wd === 2) [from, to] = [-4, -1]; // mardi : pont du lundi
          else if (wd === 4) [from, to] = [-1, 2];  // jeudi : pont du vendredi
          else if (wd === 5) [from, to] = [-1, 1];  // vendredi : week-end long
          else return;                           // mercredi, samedi, dimanche : pas de pont
        }
        for (let k = from; k <= to; k++) put(addDays(h, k), name, name === "Jour de l'an" ? `${y - 1}-${y}` : y, price);
      });
    }
    return holidayCache;
  }

  function periodFor(dateIso) {
    const sp = (P().specialDates || []).find((x) => dateIso >= x.from && dateIso <= x.to);
    if (sp) return { name: sp.name, nightly: sp.nightly, minNights: sp.minNights ?? P().minNights };
    const ho = holidayMap().get(dateIso);
    if (ho) return ho;
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
      return qty ? { label: x.label, qty, onRequest: x.price == null, amount: (x.price || 0) * qty * (x.per === "night" ? nights.length : 1) } : null;
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
    q.options.forEach((o) => rows.push([o.qty > 1 ? `${o.label} × ${o.qty}` : o.label, o.onRequest ? "sur demande" : o.amount ? money(o.amount) : "offert"]));
    rows.push([`Taxe de séjour (${plural(q.adults, "adulte")})`, money(q.tax)]);
    return rows;
  }

  window.GitePricing = { iso, parse, addDays, today, longDate, money, P, holidayMap, periodFor, nightlyFor, minNightsFor, nightsBetween, durationCoef, pct, quote, quoteRows };
})();
