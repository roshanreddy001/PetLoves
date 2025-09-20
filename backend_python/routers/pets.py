from fastapi import APIRouter, HTTPException, Request
from models.pet import Pet, PetCreate
from typing import List

router = APIRouter()

@router.get("/", response_model=List[Pet])
async def get_all_pets(request: Request):
    """Get all pets"""
    try:
        pets = await request.app.mongodb["pets"].find().to_list(1000)
        return pets
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=Pet, status_code=201)
async def add_pet(pet: PetCreate, request: Request):
    """Add new pet"""
    try:
        pet_dict = pet.dict()
        result = await request.app.mongodb["pets"].insert_one(pet_dict)
        created_pet = await request.app.mongodb["pets"].find_one({"_id": result.inserted_id})
        return created_pet
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
