from typing import Optional

from sqlmodel import Field, SQLModel
from enum import Enum
from sqlalchemy import event
from pydantic import model_validator

class Modality(str, Enum):
  equipment = "equipment"
  bodyweight = "bodyweight"

class Exercise(SQLModel, table=True):
  id: Optional[int] = Field(default=None, primary_key=True)
  name: str = Field(index=True, unique=True)    
  exercise_type: Optional[str] = Field(default=None)
  muscle_group: Optional[str] = Field(default=None)   
  equipment: Optional[str] = Field(default=None)
  requires_equipment: bool = Field(default=False, index=True)
  modality: Modality = Field(default=Modality.bodyweight, index=True)

  @model_validator(mode="after")
  def set_modality_from_equipment(self) -> "Exercise":
      BODYWEIGHT_KEYWORDS = {"bodyweight", "none", "no equipment", ""}
      if self.equipment and self.equipment.lower() not in BODYWEIGHT_KEYWORDS:
          self.requires_equipment = True
          self.modality = Modality.equipment
      else:
          self.requires_equipment = False
          self.modality = Modality.bodyweight
          return self   