"""
Phase 1 — scrape workouts; for each exercise crawl its detail page inline
Phase 2 — generate embeddings with qwen3-embedding:4b via Ollama (768 dims)

Pagina de workout -> tabela de exercicios na pagina de workout -> pagina de exercicio -> salva no banco
"""

import asyncio
import json
import re
from typing import Optional

from bs4 import BeautifulSoup
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig
from sqlmodel import Session, select

from core.database import engine
from domain import DifficultyLevel, EmbeddingDocument, Exercise, Workout, WorkoutExercise

BASE_URL = "https://www.muscleandstrength.com"
TARGET_PER_CATEGORY = 3
CRAWL_DELAY = 2.0

CATEGORY_SLUGS = {
    "muscle-building", "fat-loss", "home", "women", "men", "strength", "abs",
    "full-body", "sports", "bodyweight", "beginner", "celebrity", "cardio",
    "chest", "back", "biceps", "shoulders", "legs", "triceps", "other",
}

CATEGORY_SLUGS_TO_SEARCH = {
    "muscle-building", "fat-loss", "home", "women", "men", "strength",
    "full-body", "bodyweight", "beginner"
}

# utils 

def parse_difficulty(raw: str) -> DifficultyLevel:
    raw = raw.lower().strip()
    if "beginner" in raw:
        return DifficultyLevel.beginner
    if "advanced" in raw or "expert" in raw:
        return DifficultyLevel.advanced
    return DifficultyLevel.intermediate


def parse_duration_weeks(raw: str) -> Optional[int]:
    m = re.search(r"(\d+)", raw or "")
    return int(m.group(1)) if m else None


def parse_days_per_week(raw: str) -> Optional[int]:
    m = re.search(r"(\d+)", raw or "")
    return int(m.group(1)) if m else None


def parse_rest_seconds(raw: str) -> Optional[int]:
    raw = (raw or "").strip()
    if not raw:
        return None
    mm_ss = re.match(r"(\d+):(\d{2})", raw)
    if mm_ss:
        return int(mm_ss.group(1)) * 60 + int(mm_ss.group(2))
    m = re.search(r"(\d+)", raw)
    return int(m.group(1)) if m else None


def parse_sets(raw: str) -> Optional[int]:
    m = re.search(r"(\d+)", (raw or "").strip())
    return int(m.group(1)) if m else None

# crawlers

def extract_metadata(soup: BeautifulSoup) -> dict:
    meta: dict[str, str] = {}
    block = soup.find("div", class_="node-stats-block") # Tag do workout summary
    if not block:
        return meta
    for li in block.find_all("li"):
        label = li.find("span", class_="row-label")
        if not label:
            continue
        key = label.get_text(strip=True)
        label.decompose()

        field_item = li.find(class_="field-item")
        if field_item:
            value = field_item.get_text(strip=True)
        else:
            value = li.get_text(strip=True)
        meta[key] = value
    return meta


def extract_title(soup: BeautifulSoup) -> str:
    h1 = soup.find("h1")
    return h1.get_text(strip=True) if h1 else ""

# Precisa melhorar essa extracao ainda, muito detalhe ta passando
def extract_description(soup: BeautifulSoup) -> str:
    body = soup.find("div", class_="field-name-body")
    if not body:
        return ""
    for p in body.find_all("p"):
        text = p.get_text(strip=True)
        if len(text) > 40:
            return text
    return ""


def extract_exercises(soup: BeautifulSoup) -> list[dict]:
    exercises: list[dict] = []
    for table in soup.find_all("table"):
        headers = [th.get_text(strip=True).lower() for th in table.find_all("th")]
        if not any("exercise" in h for h in headers):
            continue
        ex_idx = next((i for i, h in enumerate(headers) if "exercise" in h), None)
        sets_idx = next((i for i, h in enumerate(headers) if "set" in h), None)
        reps_idx = next((i for i, h in enumerate(headers) if "rep" in h), None)
        rest_idx = next((i for i, h in enumerate(headers) if "rest" in h), None)
        if ex_idx is None:
            continue
        for tr in table.find_all("tr"):
            cells = tr.find_all("td")
            if not cells or len(cells) <= ex_idx:
                continue
            name = cells[ex_idx].get_text(strip=True)
            if not name:
                continue
            link_tag = cells[ex_idx].find("a")
            href = link_tag.get("href", "") if link_tag else ""
            exercises.append({
                "name": name,
                "href": href,
                "sets": cells[sets_idx].get_text(strip=True) if sets_idx is not None and sets_idx < len(cells) else "",
                "reps": cells[reps_idx].get_text(strip=True) if reps_idx is not None and reps_idx < len(cells) else "",
                "rest": cells[rest_idx].get_text(strip=True) if rest_idx is not None and rest_idx < len(cells) else "",
            })
    return exercises



def _collect_workout_urls(links: list[dict], seen: set[str], limit: int = 0) -> list[str]:
    collected: list[str] = []
    for link in links:
        href = link.get("href", "")
        if "/workouts/" not in href:
            continue
        href = href.split("?")[0].split("#")[0]
        slug_bare = href.rstrip("/").rsplit("/", 1)[-1].replace(".html", "")
        if slug_bare in CATEGORY_SLUGS:
            continue
        full_url = href if href.startswith("http") else BASE_URL + href
        if full_url in seen:
            continue
        seen.add(full_url)
        collected.append(full_url)
        if limit and len(collected) >= limit:
            break
    return collected


async def crawl_listing(crawler: AsyncWebCrawler) -> list[str]:
    seen: set[str] = set()
    urls: list[str] = []

    # pagina principal
    result = await crawler.arun(f"{BASE_URL}/workout-routines", config=CrawlerRunConfig())
    from_home = _collect_workout_urls(result.links.get("internal", []), seen)
    urls.extend(from_home)
    print(f"  [home] {len(from_home)} URLs")

    # subcategoria
    for slug in CATEGORY_SLUGS_TO_SEARCH:
        category_url = f"{BASE_URL}/workouts/{slug}"
        try:
            result = await crawler.arun(category_url, config=CrawlerRunConfig())
        except Exception:
            continue
        from_cat = _collect_workout_urls(result.links.get("internal", []), seen, limit=TARGET_PER_CATEGORY)
        urls.extend(from_cat)
        print(f"  [categoria/{slug}] {len(from_cat)} URLs novas")
        await asyncio.sleep(CRAWL_DELAY)

    return urls


async def crawl_exercise_detail(crawler: AsyncWebCrawler, href: str) -> dict:
    full_url = href if href.startswith("http") else BASE_URL + href
    try:
        result = await crawler.arun(full_url, config=CrawlerRunConfig())
        soup = BeautifulSoup(result.html or "", "html.parser")
        meta = extract_metadata(soup)
        return {
            "muscle_group": meta.get("Target Muscle Group") or None,
            "exercise_type": meta.get("Exercise Type") or None,
            "equipment": meta.get("Equipment Required") or None,
        }
    except Exception:
        return {}


async def crawl_detail(crawler: AsyncWebCrawler, url: str) -> Optional[dict]:
    try:
        result = await crawler.arun(url, config=CrawlerRunConfig())
    except Exception:
        return None
    soup = BeautifulSoup(result.html or "", "html.parser")
    meta = extract_metadata(soup)
    exercises = extract_exercises(soup)

    seen_hrefs: set[str] = set()
    for ex in exercises:
        href = ex.get("href", "")
        if not href or href in seen_hrefs:
            continue
        seen_hrefs.add(href)
        detail = await crawl_exercise_detail(crawler, href)
        ex.update(detail)
        await asyncio.sleep(1.0)

    return {
        "title": extract_title(soup),
        "description": extract_description(soup),
        "main_goal": meta.get("Main Goal", "General Fitness"),
        "workout_type": meta.get("Workout Type", "Full Body"),
        "training_level": meta.get("Training Level", "Intermediate"),
        "program_duration_weeks": parse_duration_weeks(meta.get("Program Duration")),
        "days_per_week": parse_days_per_week(meta.get("Days Per Week")),
        "time_per_workout": meta.get("Time Per Workout") or None,
        "equipment_required": meta.get("Equipment Required") or None,
        "target_gender": meta.get("Target Gender") or None,
        "exercises": exercises,
    }


# Database 

def upsert_exercise(session: Session, name: str, muscle_group=None, equipment=None, exercise_type=None) -> Exercise:
    existing = session.exec(select(Exercise).where(Exercise.name == name)).first()
    if existing:
        return existing
    ex = Exercise(name=name, muscle_group=muscle_group, equipment=equipment, exercise_type=exercise_type)
    session.add(ex)
    session.flush()
    return ex


def save_workout(session: Session, data: dict) -> Optional[Workout]:
    title = (data.get("title") or "").strip()
    if not title:
        return None

    existing = session.exec(select(Workout).where(Workout.title == title)).first()
    if existing:
        return existing

    workout = Workout(
        title=title,
        description=data.get("description") or "",
        main_goal=data.get("main_goal") or "General Fitness",
        workout_type=data.get("workout_type") or "Full Body",
        training_level=parse_difficulty(data.get("training_level") or "Intermediate"),
        program_duration_weeks=data.get("program_duration_weeks"),
        days_per_week=data.get("days_per_week"),
        time_per_workout=data.get("time_per_workout"),
        equipment_required=data.get("equipment_required"),
        target_gender=data.get("target_gender"),
    )
    session.add(workout)
    session.flush()

    for i, ex_data in enumerate(data.get("exercises") or [], start=1):
        name = (ex_data.get("name") or "").strip()
        if not name:
            continue
        exercise = upsert_exercise(
            session, name,
            muscle_group=ex_data.get("muscle_group"),
            equipment=ex_data.get("equipment"),
            exercise_type=ex_data.get("exercise_type"),
        )
        link = WorkoutExercise(
            workout_id=workout.id,
            exercise_id=exercise.id,
            order=i,
            sets=parse_sets(ex_data.get("sets")),
            reps=ex_data.get("reps") or None,
            rest_seconds=parse_rest_seconds(ex_data.get("rest")),
        )
        session.add(link)

    session.commit()
    return workout

async def main() -> None:
    async with AsyncWebCrawler(config=BrowserConfig(headless=True, verbose=False)) as crawler:
        print("\n[Fase 1] Extraindo dados")
        
        urls = await crawl_listing(crawler)
        print(f"Encontrado {len(urls)} URLs validas\n")

        with Session(engine) as session:
            for i, url in enumerate(urls, start=1):
                print(f"  [{i}/{len(urls)}] {url}")
                data = await crawl_detail(crawler, url)
                if data:
                    workout = save_workout(session, data)
                    if workout:
                        ex_count = len(data.get("exercises") or [])
                        print(f"Salvo: {workout.title!r}, com {ex_count} exercicios)")
                await asyncio.sleep(CRAWL_DELAY)

if __name__ == "__main__":
    asyncio.run(main())
