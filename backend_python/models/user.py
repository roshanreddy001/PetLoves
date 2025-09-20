from pydantic import BaseModel
from .base import BaseMongoModel

class User(BaseMongoModel):
    name: str
    email: str
    password: str
    phone: str

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    phone: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str
