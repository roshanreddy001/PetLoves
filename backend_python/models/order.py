from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from .base import BaseMongoModel

class OrderItem(BaseModel):
    productId: str
    name: str
    price: float
    quantity: int
    image: Optional[str] = None
    type: Optional[str] = None

class Order(BaseMongoModel):
    userId: str
    items: List[OrderItem]
    total: float
    status: str
    date: datetime = Field(default_factory=datetime.now)


class OrderCreate(BaseModel):
    userId: str
    items: List[OrderItem]
    total: float
    status: str = "pending"
