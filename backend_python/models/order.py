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

class PaymentInfo(BaseModel):
    cardNumber: Optional[str] = None
    name: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    paymentMethod: Optional[str] = "card"
    transactionId: Optional[str] = None

class Order(BaseMongoModel):
    userId: str
    items: List[OrderItem]
    total: float
    status: str
    date: datetime = Field(default_factory=datetime.now)
    paymentInfo: Optional[PaymentInfo] = None

class OrderCreate(BaseModel):
    userId: str
    items: List[OrderItem]
    total: float
    status: str = "pending"
    paymentInfo: Optional[PaymentInfo] = None
