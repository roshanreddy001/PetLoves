from fastapi import APIRouter, HTTPException, Request
from models.user import User, UserCreate, UserLogin, UserResponse
from typing import List

router = APIRouter()

@router.get("/", response_model=List[User])
async def get_all_users(request: Request):
    """Get all users"""
    try:
        users = await request.app.mongodb["users"].find().to_list(1000)
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=User, status_code=201)
async def register_user(user: UserCreate, request: Request):
    """Register new user"""
    try:
        # Check for duplicate email
        existing_user = await request.app.mongodb["users"].find_one({"email": user.email})
        if existing_user:
            raise HTTPException(status_code=409, detail="Email already registered")
        
        user_dict = user.dict()
        result = await request.app.mongodb["users"].insert_one(user_dict)
        created_user = await request.app.mongodb["users"].find_one({"_id": result.inserted_id})
        return created_user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=UserResponse)
async def login_user(login_data: UserLogin, request: Request):
    """User login"""
    try:
        user = await request.app.mongodb["users"].find_one({"email": login_data.email})
        if not user:
            raise HTTPException(status_code=400, detail="No account found. Please sign up first.")
        
        if user["password"] != login_data.password:
            raise HTTPException(status_code=400, detail="Incorrect password")
        
        # Return user data without password
        return UserResponse(
            id=str(user["_id"]),
            name=user["name"],
            email=user["email"],
            phone=user["phone"]
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
