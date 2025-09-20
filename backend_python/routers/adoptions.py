from fastapi import APIRouter, HTTPException, Request
from models.adoption import Adoption, AdoptionCreate
from typing import List

router = APIRouter()

@router.get("/{user_id}", response_model=List[Adoption])
async def get_user_adoptions(user_id: str, request: Request):
    """Get all adoptions for a user"""
    try:
        adoptions = await request.app.mongodb["adoptions"].find({"userId": user_id}).to_list(1000)
        return adoptions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=Adoption, status_code=201)
async def create_adoption(adoption: AdoptionCreate, request: Request):
    """Create new adoption - prevent duplicate adoption for the same user and pet"""
    try:
        # Check for existing adoption
        existing = await request.app.mongodb["adoptions"].find_one({
            "userId": adoption.userId,
            "petId": adoption.petId
        })
        
        if existing:
            raise HTTPException(status_code=409, detail="You have already adopted this pet.")
        
        adoption_dict = adoption.dict()
        result = await request.app.mongodb["adoptions"].insert_one(adoption_dict)
        created_adoption = await request.app.mongodb["adoptions"].find_one({"_id": result.inserted_id})
        return created_adoption
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
