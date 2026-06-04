
from typing import List, Optional
from sqlmodel import Session, select
from backend.domain.exercise import Exercise

def list_exercises(session: Session, requires_equipment: Optional[bool] = None) -> List[Exercise]:
    q = select(Exercise)
    if requires_equipment is not None:
        q = q.where(Exercise.requires_equipment == requires_equipment)
    return session.exec(q).all()