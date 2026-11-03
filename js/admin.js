(() => {
  const OWNER = "PAT-guy", REPO = "Montifaut", PATH = "data/manual-blocks.json";
  const API = "https://api.github.com";
  const $ = (s) => document.querySelector(s);
  const KEY = "gite-admin-token";
  let token = "", branch = "", sha = "", blocks = [], auto = [];

  const say = (sel, t, ok) => { const n = $(sel); n.textContent = t; n.className = "msg " + (ok ? "ok" : "err"); };
  const fromB64 = (b) => decodeURIComponent(escape(atob(b.replace(/\n/g, ""))));
  const toB64 = (s) => btoa(unescape(encodeURIComponent(s)));
  const pad = (n) => String(n).padStart(2, "0");
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const nightsOf = (a, b) => { const o = []; for (let d = parse(a); iso(d) < b; d = addDays(d, 1)) o.push(iso(d)); return o; };
  const fmt = (s) => parse(s).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "long", year: "numeric" });

  async function gh(path, opts = {}) {
    const res = await fetch(API + path, {
      ...opts,
      headers: { Accept: "application/vnd.github+json", Authorization: "Bearer " + token, "X-GitHub-Api-Version": "2022-11-28", ...(opts.headers || {}) }
    });
    if (res.status === 401) throw new Error("Clé refusée ou expirée. Créez-en une nouvelle.");
    if (res.status === 403 || res.status === 404) throw new Error("Accès refusé : la clé doit avoir le droit « Contents : Read and write » sur le dépôt Montifaut.");
    if (!res.ok) { const e = new Error("Erreur GitHub " + res.status); e.status = res.status; throw e; }
    return res.json();
  }

  async function load() {
    const repo = await gh(`/repos/${OWNER}/${REPO}`);
    branch = repo.default_branch;
    let f;
    try { f = await gh(`/repos/${OWNER}/${REPO}/contents/${PATH}?ref=${encodeURIComponent(branch)}`); }
    catch (e) { if (e.status === 404) { sha = ""; blocks = []; return; } throw e; }
    sha = f.sha;
    const data = JSON.parse(fromB64(f.content));
    blocks = (data.blocked || []).slice().sort((a, b) => (a.start < b.start ? -1 : 1));
    try { const r = await fetch("data/availability.json", { cache: "no-store" }); const d = await r.json(); auto = d.blocked || []; } catch (e) { auto = []; }
  }

  async function save(message) {
    const body = { message, branch, content: toB64(JSON.stringify({ blocked: blocks }, null, 2) + "\n") };
    if (sha) body.sha = sha;
    const res = await gh(`/repos/${OWNER}/${REPO}/contents/${PATH}`, { method: "PUT", body: JSON.stringify(body) });
    sha = res.content.sha;
  }

  /* ---------- Affichage ---------- */
  function renderList() {
    const box = $("#list");
    box.replaceChildren();
    if (!blocks.length) { const p = document.createElement("p"); p.className = "empty"; p.textContent = "Aucune date bloquée à la main."; box.append(p); return; }
    const t = document.createElement("table");
    t.innerHTML = "<thead><tr><th>Arrivée</th><th>Départ</th><th>Nuits</th><th>Motif</th><th></th></tr></thead>";
    const tb = document.createElement("tbody");
    blocks.forEach((b, i) => {
      const tr = document.createElement("tr");
      const cells = [fmt(b.start), fmt(b.end), String(nightsOf(b.start, b.end).length), [b.kind, b.note].filter(Boolean).join(" · ")];
      cells.forEach((c) => { const td = document.createElement("td"); td.textContent = c; tr.append(td); });
      const td = document.createElement("td");
      const btn = document.createElement("button");
      btn.type = "button"; btn.className = "btn danger small"; btn.textContent = "Débloquer";
      btn.onclick = () => remove(i, btn);
      td.append(btn); tr.append(td); tb.append(tr);
    });
    t.append(tb); box.append(t);
  }

  function renderCal() {
    const man = new Set(), aut = new Set();
    blocks.forEach((b) => nightsOf(b.start, b.end).forEach((n) => man.add(n)));
    auto.forEach((b) => nightsOf(b.start, b.end).forEach((n) => aut.add(n)));
    const wrap = $("#cal"); wrap.replaceChildren();
    const today = iso(new Date());
    const base = new Date(); base.setDate(1);
    for (let m = 0; m < 6; m++) {
      const first = new Date(base.getFullYear(), base.getMonth() + m, 1);
      const month = document.createElement("div"); month.className = "month";
      const h = document.createElement("h4"); h.textContent = first.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
      const g = document.createElement("div"); g.className = "grid";
      ["L", "M", "M", "J", "V", "S", "D"].forEach((w) => { const d = document.createElement("div"); d.className = "wd"; d.textContent = w; g.append(d); });
      for (let i = 0; i < (first.getDay() + 6) % 7; i++) { const d = document.createElement("div"); d.className = "d e"; g.append(d); }
      const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
      for (let d = 1; d <= days; d++) {
        const day = iso(new Date(first.getFullYear(), first.getMonth(), d));
        const c = document.createElement("div");
        c.className = "d" + (day < today ? " p" : "") + (man.has(day) ? " m" : aut.has(day) ? " a" : "");
        c.textContent = String(d); g.append(c);
      }
      month.append(h, g); wrap.append(month);
    }
  }

  const refresh = () => { renderList(); renderCal(); };

  /* ---------- Actions ---------- */
  async function remove(i, btn) {
    const b = blocks[i];
    if (!confirm(`Débloquer du ${fmt(b.start)} au ${fmt(b.end)} ?`)) return;
    btn.disabled = true;
    const before = blocks.slice();
    blocks.splice(i, 1);
    try { await save(`Calendrier : déblocage du ${b.start} au ${b.end}`); say("#list-msg", "Dates débloquées. Le site se met à jour dans 2 à 3 minutes.", true); }
    catch (e) { blocks = before; say("#list-msg", e.message, false); }
    refresh();
  }

  $("#add").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target, start = f.start.value, end = f.end.value;
    if (!start || !end) return say("#add-msg", "Choisissez une arrivée et un départ.", false);
    if (end <= start) return say("#add-msg", "Le départ doit être après l'arrivée.", false);
    const nights = nightsOf(start, end);
    const taken = new Set();
    blocks.forEach((b) => nightsOf(b.start, b.end).forEach((n) => taken.add(n)));
    const clash = nights.filter((n) => taken.has(n));
    if (clash.length && !confirm(`${clash.length} nuit(s) sont déjà bloquées à la main sur cette période. Ajouter quand même ?`)) return;
    const autoSet = new Set(); auto.forEach((b) => nightsOf(b.start, b.end).forEach((n) => autoSet.add(n)));
    const clashAuto = nights.filter((n) => autoSet.has(n));
    if (clashAuto.length && !confirm(`${clashAuto.length} nuit(s) sont déjà réservées sur une plateforme. Ajouter quand même ?`)) return;
    const entry = { start, end, kind: f.kind.value };
    if (f.note.value.trim()) entry.note = f.note.value.trim();
    const btn = $("#save"); btn.disabled = true;
    const before = blocks.slice();
    blocks.push(entry); blocks.sort((a, b) => (a.start < b.start ? -1 : 1));
    try {
      await save(`Calendrier : blocage du ${start} au ${end}`);
      say("#add-msg", `Dates bloquées (${nights.length} nuit${nights.length > 1 ? "s" : ""}). Le site se met à jour dans 2 à 3 minutes.`, true);
      f.reset();
    } catch (err) {
      blocks = before;
      say("#add-msg", err.status === 409 || err.status === 422 ? "Le calendrier a changé entre-temps. Rechargez la page et recommencez." : err.message, false);
    }
    btn.disabled = false; refresh();
  });

  /* ---------- Connexion ---------- */
  async function connect(t, silent) {
    token = t.trim();
    if (!token) return say("#login-msg", "Collez votre clé d'accès.", false);
    $("#connect").disabled = true;
    try {
      await load();
      try { localStorage.setItem(KEY, token); } catch (e) {}
      $("#login").hidden = true; $("#app").hidden = false;
      refresh();
    } catch (e) {
      if (!silent) say("#login-msg", e.message, false);
      else try { localStorage.removeItem(KEY); } catch (x) {}
    }
    $("#connect").disabled = false;
  }
  $("#connect").onclick = () => connect($("#token").value);
  $("#token").addEventListener("keydown", (e) => { if (e.key === "Enter") connect(e.target.value); });
  $("#logout").onclick = () => { try { localStorage.removeItem(KEY); } catch (e) {} location.reload(); };

  let saved = ""; try { saved = localStorage.getItem(KEY) || ""; } catch (e) {}
  if (saved) connect(saved, true);
})();
