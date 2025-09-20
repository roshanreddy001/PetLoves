from fastapi import APIRouter, HTTPException, Request
from models.visit import Visit, VisitCreate
from typing import List
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=Visit, status_code=201)
async def create_visit(visit: VisitCreate, request: Request):
    """Create a new visit - only allow one visit per pet per user per day"""
    try:
        visit_dict = visit.dict()
        
        # Set date if not provided
        if not visit_dict.get("date"):
            visit_dict["date"] = datetime.now()
        
        visit_date = visit_dict["date"]
        
        # Create start and end of day for comparison
        start_of_day = datetime(visit_date.year, visit_date.month, visit_date.day, 0, 0, 0)
        end_of_day = datetime(visit_date.year, visit_date.month, visit_date.day, 23, 59, 59)
        
        # Check for existing visit on the same day
        existing = await request.app.mongodb["visits"].find_one({
            "userId": visit.userId,
            "petId": visit.petId,
            "date": {
                "$gte": start_of_day,
                "$lte": end_of_day
            }
        })
        
        if existing:
            raise HTTPException(
                status_code=409, 
                detail="You have already scheduled a visit for this pet on this day."
            )
        
        result = await request.app.mongodb["visits"].insert_one(visit_dict)
        created_visit = await request.app.mongodb["visits"].find_one({"_id": result.inserted_id})
        return created_visit
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{user_id}", response_model=List[Visit])
async def get_user_visits(user_id: str, request: Request):
    """Get all visits for a user"""
    try:
        visits = await request.app.mongodb["visits"].find({"userId": user_id}).to_list(1000)
        return visits
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
