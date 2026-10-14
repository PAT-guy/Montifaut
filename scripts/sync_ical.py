#!/usr/bin/env python3
"""Fusionne les calendriers iCal (Airbnb, Booking, etc.) et les blocages manuels
dans data/availability.json, lu par le site.

Les adresses iCal sont lues dans la variable d'environnement ICAL_URLS
(une adresse par ligne ou séparées par des virgules). Ne les écrivez pas dans le dépôt.
"""
import json
import os
import re
import sys
import urllib.request
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "availability.json"
MANUAL = ROOT / "data" / "manual-blocks.json"


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "gite-sync/1.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", errors="replace")


def unfold(text: str) -> list[str]:
    lines: list[str] = []
    for raw in text.replace("\r\n", "\n").split("\n"):
        if raw.startswith((" ", "\t")) and lines:
            lines[-1] += raw[1:]
        else:
            lines.append(raw)
    return lines


def to_date(value: str) -> date:
    m = re.match(r"(\d{4})(\d{2})(\d{2})", value.strip())
    if not m:
        raise ValueError(value)
    return date(int(m[1]), int(m[2]), int(m[3]))


def parse_events(text: str) -> list[tuple[date, date]]:
    events, cur = [], None
    for line in unfold(text):
        if line == "BEGIN:VEVENT":
            cur = {}
        elif line == "END:VEVENT" and cur is not None:
            if "DTSTART" in cur:
                start = to_date(cur["DTSTART"])
                end = to_date(cur["DTEND"]) if "DTEND" in cur else start + timedelta(days=1)
                if end <= start:
                    end = start + timedelta(days=1)
                events.append((start, end))
            cur = None
        elif cur is not None and ":" in line:
            key, _, val = line.partition(":")
            cur[key.split(";")[0].upper()] = val
    return events


def merge(ranges: list[tuple[date, date]]) -> list[tuple[date, date]]:
    out: list[list[date]] = []
    for s, e in sorted(ranges):
        if out and s <= out[-1][1]:
            out[-1][1] = max(out[-1][1], e)
        else:
            out.append([s, e])
    return [(s, e) for s, e in out]


def main() -> int:
    urls = [u.strip() for u in re.split(r"[\n,]", os.environ.get("ICAL_URLS", "")) if u.strip()]
    ranges: list[tuple[date, date]] = []
    failed = 0

    for url in urls:
        try:
            ranges += parse_events(fetch(url))
        except Exception as exc:  # une source en panne ne doit pas effacer les autres
            failed += 1
            print(f"Échec pour une source iCal ({type(exc).__name__}: {exc})", file=sys.stderr)

    if urls and failed == len(urls) and OUT.exists():
        print("Toutes les sources ont échoué : fichier existant conservé.", file=sys.stderr)
        return 1

    if MANUAL.exists():
        for b in json.loads(MANUAL.read_text(encoding="utf-8")).get("blocked", []):
            ranges.append((date.fromisoformat(b["start"]), date.fromisoformat(b["end"])))

    today = date.today()
    merged = [(s, e) for s, e in merge(ranges) if e >= today]
    data = {
        "updated": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "blocked": [{"start": s.isoformat(), "end": e.isoformat()} for s, e in merged],
    }
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"{len(merged)} période(s) bloquée(s) écrite(s).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
