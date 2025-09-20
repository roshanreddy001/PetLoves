from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from .base import BaseMongoModel

class Visit(BaseMongoModel):
    userId: str
    petId: str
    petName: str
    petImage: Optional[str] = None
    time: str
    location: str
    status: str
    date: datetime = Field(default_factory=datetime.now)


class VisitCreate(BaseModel):
    userId: str
    petId: str
    petName: str
    petImage: Optional[str] = None
    time: str
    location: str
    status: str
    date: Optional[datetime] = None
