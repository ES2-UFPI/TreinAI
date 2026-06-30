import re

from domain.workout_plan import PlannedExercise, WorkoutDay, WorkoutPlan

_WORD_SUBS = [
    (r"(\d+)\s*repetições?", r"\1"),
    (r"(\d+)\s*segundos?",   r"\1s"),
    (r"(\d+)\s*minutos?",    r"\1min"),
]


def _normalize_reps(reps: str | None) -> str | None:
    if not reps:
        return reps
    value = reps.strip()
    for pattern, replacement in _WORD_SUBS:
        value = re.sub(pattern, replacement, value, flags=re.IGNORECASE)
    return value


def _parse_exercises(raw: list[dict]) -> list[PlannedExercise]:
    return [
        PlannedExercise(
            order=i + 1,
            **{k: (v if k != "reps" else _normalize_reps(v)) for k, v in ex.items() if k != "order"},
        )
        for i, ex in enumerate(raw)
    ]


class WorkoutFactory:
    @staticmethod
    def from_llm_response(data: dict) -> WorkoutPlan:
        days = [
            WorkoutDay(
                day=d["day"],
                focus=d["focus"],
                exercises=_parse_exercises(d.get("exercises", [])),
            )
            for d in data.get("days", [])
        ]
        workout_data = {k: v for k, v in data.items() if k != "days"}
        return WorkoutPlan(**workout_data, days=days)
