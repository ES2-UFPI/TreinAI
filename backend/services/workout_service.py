from domain.exercise import Modality
from domain.user import UserNotFoundError
from domain.user_workout import WorkoutNotFoundError, WorkoutHistoryItem
from domain.workout import Workout
from domain.workout_exercise import WorkoutExercise
from domain.workout_plan import PlannedExercise, WorkoutDay, WorkoutPlan
from repositories.user_repository import UserRepository
from repositories.user_workout_repository import UserWorkoutRepository
from repositories.workout_repository import WorkoutRepository
from services.llm_facade import LLMFacade


class WorkoutService:
    def __init__(
        self,
        user_repository: UserRepository,
        user_workout_repository: UserWorkoutRepository,
        workout_repository: WorkoutRepository,
        llm_facade: LLMFacade,
    ) -> None:
        self._user_repo = user_repository
        self._user_workout_repo = user_workout_repository
        self._workout_repo = workout_repository
        self._facade = llm_facade

    def generate(
        self,
        user_id: int,
        query: str,
        modality: "Modality | None" = None,
        available_days: list[str] | None = None,
    ) -> WorkoutPlan:
        user = self._user_repo.get_by_id(user_id)
        if not user:
            raise UserNotFoundError()

        plan = self._facade.generate_workout_plan(
            user_query=query,
            user=user,
            modality=modality,
            available_days=available_days,
        )

        workout = Workout(
            title=plan.title,
            description=plan.description,
            main_goal=plan.main_goal,
            workout_type=plan.workout_type,
            training_level=plan.training_level,
            program_duration_weeks=plan.program_duration_weeks,
            days_per_week=plan.days_per_week,
            time_per_workout=plan.time_per_workout,
            equipment_required=plan.equipment_required,
            target_gender=plan.target_gender,
        )
        saved = self._workout_repo.save_workout(workout)

        for day in plan.days:
            for ex in day.exercises:
                self._workout_repo.save_exercise(
                    WorkoutExercise(
                        workout_id=saved.id,
                        day=day.day,
                        focus=day.focus,
                        order=ex.order,
                        name=ex.name,
                        sets=ex.sets,
                        reps=ex.reps,
                        rest_seconds=ex.rest_seconds,
                        muscle_group=ex.muscle_group,
                        notes=ex.notes,
                    )
                )

        plan.id = saved.id
        return plan

    def list_history(self, user_id: int) -> list[WorkoutHistoryItem]:
        user = self._user_repo.get_by_id(user_id)
        if not user:
            raise UserNotFoundError()

        workouts = self._user_workout_repo.list_by_user(user_id)
        return [
            WorkoutHistoryItem(id=w.id, title=w.title, created_at=w.created_at)
            for w in workouts
        ]

    def get_workout_detail(self, user_workout_id: int) -> WorkoutPlan:
        user_workout = self._user_workout_repo.get_by_id(user_workout_id)
        if not user_workout or not user_workout.workout_id:
            raise WorkoutNotFoundError()

        workout = self._workout_repo.get_workout_by_id(user_workout.workout_id)
        if not workout:
            raise WorkoutNotFoundError()

        exercises = self._workout_repo.get_exercises_by_workout_id(workout.id)

        days_map: dict[int, WorkoutDay] = {}
        for ex in exercises:
            if ex.day not in days_map:
                days_map[ex.day] = WorkoutDay(day=ex.day, focus=ex.focus, exercises=[])
            days_map[ex.day].exercises.append(
                PlannedExercise(
                    order=ex.order,
                    name=ex.name,
                    sets=ex.sets,
                    reps=ex.reps,
                    rest_seconds=ex.rest_seconds,
                    muscle_group=ex.muscle_group,
                    notes=ex.notes,
                )
            )

        days = [days_map[d] for d in sorted(days_map.keys())]

        return WorkoutPlan(
            title=workout.title,
            description=workout.description,
            main_goal=workout.main_goal,
            workout_type=workout.workout_type,
            training_level=(
                workout.training_level.value
                if hasattr(workout.training_level, "value")
                else workout.training_level
            ),
            program_duration_weeks=workout.program_duration_weeks,
            days_per_week=workout.days_per_week,
            time_per_workout=workout.time_per_workout,
            equipment_required=workout.equipment_required,
            target_gender=workout.target_gender,
            days=days,
        )
