#!/usr/bin/env python3
"""Scrape new solves from Logic Masters and prepend them to puzzles.json."""

import json
import re
import time
from datetime import date, timedelta
from pathlib import Path

import requests
from bs4 import BeautifulSoup

BASE_URL = "https://logic-masters.de/Raetselportal/Benutzer/geloest.php"
PUZZLES_JSON = Path(__file__).parent.parent / "src" / "data" / "puzzles.json"
PAGE_SIZE = 20
DELAY = 1.0

GERMAN_MONTHS = {
    1: "Januar", 2: "Februar", 3: "März", 4: "April",
    5: "Mai", 6: "Juni", 7: "Juli", 8: "August",
    9: "September", 10: "Oktober", 11: "November", 12: "Dezember",
}


def resolve_relative_date(raw):
    if raw == "Heute":
        d = date.today()
    elif raw == "Gestern":
        d = date.today() - timedelta(days=1)
    else:
        return raw
    return f"{d.day}. {GERMAN_MONTHS[d.month]} {d.year}"


def fetch_page(start=0):
    params = {"name": "pazqo"}
    if start:
        params["start"] = start
    resp = requests.get(BASE_URL, params=params, headers={"User-Agent": "Mozilla/5.0"}, timeout=15)
    resp.raise_for_status()
    return resp.text


def parse_page(html):
    soup = BeautifulSoup(html, "html.parser")
    table = soup.find("table", class_="rp_raetselliste")
    if not table:
        return []

    puzzles = []
    for row in table.find_all("tr"):
        cells = row.find_all("td")
        if len(cells) < 4:
            continue

        desc_cell = cells[1]
        puzzle_link_tag = desc_cell.find("a", href=re.compile(r"/Raetsel/zeigen\.php"))
        if not puzzle_link_tag:
            continue

        name = puzzle_link_tag.get_text(strip=True)
        link = "https://logic-masters.de" + puzzle_link_tag["href"]

        author_tag = desc_cell.find("a", href=re.compile(r"/Benutzer/allgemein\.php"))
        author = author_tag.get_text(strip=True) if author_tag else ""

        span = desc_cell.find("span")
        solve_date, solve_time = "", ""
        if span:
            text = span.get_text()
            m = re.search(r"gelöst\s+(?:am\s+)?(.+?),\s+(\d{2}:\d{2})\s+Uhr", text)
            if m:
                solve_date = resolve_relative_date(m.group(1))
                solve_time = m.group(2)

        solver_count = 0
        try:
            solver_count = int(cells[2].get_text(strip=True))
        except ValueError:
            pass

        rating_cell = cells[3]
        difficulty = 0
        level_img = rating_cell.find("img", alt=re.compile(r"^\d+$"))
        if level_img:
            difficulty = int(level_img["alt"])

        rating_percent = 0
        rating_span = rating_cell.find("span")
        if rating_span:
            m = re.search(r"(\d+)\s*%", rating_span.get_text())
            if m:
                rating_percent = int(m.group(1))

        puzzles.append({
            "name": name,
            "link": link,
            "author": author,
            "difficulty": difficulty,
            "solve_date": solve_date,
            "solve_time": solve_time,
            "solver_count": solver_count,
            "rating_percent": rating_percent,
        })

    return puzzles


def scrape_new_solves(existing_links):
    new_puzzles = []
    seen_links = set()
    start = 0
    while True:
        print(f"Fetching page (start={start})...")
        html = fetch_page(start)
        page_puzzles = parse_page(html)
        if not page_puzzles:
            print("  No puzzles found on page, stopping.")
            break

        found_existing = False
        for p in page_puzzles:
            if p["link"] in existing_links:
                print(f"  Found existing puzzle: {p['name']} — stopping.")
                found_existing = True
                break
            if p["link"] in seen_links:
                continue
            seen_links.add(p["link"])
            new_puzzles.append(p)
            print(f"  + {p['name']}")

        if found_existing:
            break
        start += PAGE_SIZE
        time.sleep(DELAY)

    return new_puzzles


def main():
    existing = json.loads(PUZZLES_JSON.read_text(encoding="utf-8"))
    existing_links = {p["link"] for p in existing}
    print(f"Loaded {len(existing)} existing puzzles.")

    new_puzzles = scrape_new_solves(existing_links)
    if not new_puzzles:
        print("No new puzzles found.")
        return

    merged = new_puzzles + existing
    PUZZLES_JSON.write_text(
        json.dumps(merged, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"\nAdded {len(new_puzzles)} new puzzles. Total: {len(merged)}.")


if __name__ == "__main__":
    main()
