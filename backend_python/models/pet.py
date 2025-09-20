from pydantic import BaseModel
from .base import BaseMongoModel

class Pet(BaseMongoModel):
    name: str
    breed: str
    type: str
    age: int
    location: str
    image: str
    description: str
    isAvailable: bool
    gender: str
    size: str

class PetCreate(BaseModel):
    name: str
    breed: str
    type: str
    age: int
    location: str
    image: str
    description: str
    isAvailable: bool = True
    gender: str
    size: str
