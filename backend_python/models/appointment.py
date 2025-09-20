from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from .base import BaseMongoModel

class Appointment(BaseMongoModel):
    userId: str
    clinicId: str
    clinicName: str
    clinicAddress: str
    petId: Optional[str] = None
    petName: Optional[str] = None
    petImage: Optional[str] = None
    date: datetime
    time: str
    reason: str
    status: str


class AppointmentCreate(BaseModel):
    userId: str
    clinicId: str
    clinicName: str
    clinicAddress: str
    petId: Optional[str] = None
    petName: Optional[str] = None
    petImage: Optional[str] = None
    date: datetime
    time: str
    reason: str
    status: str = "scheduled"
