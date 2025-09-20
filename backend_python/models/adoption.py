from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from .base import BaseMongoModel

class Adoption(BaseMongoModel):
    userId: str
    petId: str
    petName: str
    petImage: Optional[str] = None
    petBreed: str
    petType: str
    petGender: str
    petAge: int
    petSize: str
    petLocation: str
    petDescription: str
    date: datetime = Field(default_factory=datetime.now)
    status: str

class AdoptionCreate(BaseModel):
    userId: str
    petId: str
    petName: str
    petImage: Optional[str] = None
    petBreed: str
    petType: str
    petGender: str
    petAge: int
    petSize: str
    petLocation: str
    petDescription: str
    status: str = "pending"
