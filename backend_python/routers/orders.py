from fastapi import APIRouter, HTTPException, Request
from models.order import Order, OrderCreate, OrderItem
from typing import List

router = APIRouter()

@router.get("/", response_model=List[Order])
async def get_all_orders(request: Request):
    """Get all orders"""
    try:
        orders = await request.app.mongodb["orders"].find().to_list(1000)
        return orders
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}", response_model=List[Order])
async def get_user_orders(user_id: str, request: Request):
    """Get all orders for a user"""
    try:
        orders = await request.app.mongodb["orders"].find({"userId": user_id}).to_list(1000)
        return orders
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=Order, status_code=201)
async def create_order(order: OrderCreate, request: Request):
    """Create new order"""
    try:
        order_dict = order.dict()
        
        # Ensure every item has an image, using defaults by type
        if "items" in order_dict and isinstance(order_dict["items"], list):
            for item in order_dict["items"]:
                if not item.get("image"):
                    default_image = "https://via.placeholder.com/150?text=Pet+Order"
                    item_type = item.get("type", "")
                    
                    if item_type == "adoption":
                        default_image = "https://via.placeholder.com/150?text=Adopt+Me"
                    elif item_type == "care":
                        default_image = "https://via.placeholder.com/150?text=Pet+Care"
                    elif item_type == "accessory":
                        default_image = "https://via.placeholder.com/150?text=Accessory"
                    elif item_type == "appointment":
                        default_image = "https://via.placeholder.com/150?text=Clinic"
                    
                    item["image"] = default_image
        
        result = await request.app.mongodb["orders"].insert_one(order_dict)
        created_order = await request.app.mongodb["orders"].find_one({"_id": result.inserted_id})
        return created_order
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
