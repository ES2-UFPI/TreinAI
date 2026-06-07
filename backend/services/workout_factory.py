from domain.workout_plan import PlannedExercise, WorkoutPlan


class WorkoutFactory:
    @staticmethod
    def from_llm_response(data: dict) -> WorkoutPlan:
        exercises = [
            PlannedExercise(order=i + 1, **ex)
            for i, ex in enumerate(data.get("exercises", []))
        ]
        workout_data = {k: v for k, v in data.items() if k != "exercises"}
        return WorkoutPlan(**workout_data, exercises=exercises)
