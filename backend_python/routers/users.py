from fastapi import APIRouter, HTTPException, Request
from models.user import User, UserCreate, UserLogin, UserResponse
from typing import List
import bcrypt

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
        print(f"🔐 REGISTRATION ATTEMPT: {user.email}")
        
        # Check for duplicate email
        existing_user = await request.app.mongodb["users"].find_one({"email": user.email})
        if existing_user:
            print(f"❌ Email already exists: {user.email}")
            raise HTTPException(status_code=409, detail="Email already registered")
        
        # Hash the password
        print("🔑 Hashing password...")
        hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
        
        user_dict = user.dict()
        user_dict["password"] = hashed_password.decode('utf-8')  # Store as string
        
        print("💾 Saving user to database...")
        result = await request.app.mongodb["users"].insert_one(user_dict)
        created_user = await request.app.mongodb["users"].find_one({"_id": result.inserted_id})
        
        print(f"✅ User registered successfully: {user.email}")
        return created_user
    except HTTPException:
        raise
    except Exception as e:
        print(f"💥 Registration error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/register", response_model=User, status_code=201)
async def register_user_alt(user: UserCreate, request: Request):
    """Register new user (alternative endpoint)"""
    try:
        print(f"🔐 REGISTRATION ATTEMPT (ALT): {user.email}")
        
        # Check for duplicate email
        existing_user = await request.app.mongodb["users"].find_one({"email": user.email})
        if existing_user:
            print(f"❌ Email already exists: {user.email}")
            raise HTTPException(status_code=409, detail="Email already registered")
        
        # Hash the password
        print("🔑 Hashing password...")
        hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
        
        user_dict = user.dict()
        user_dict["password"] = hashed_password.decode('utf-8')  # Store as string
        
        print("💾 Saving user to database...")
        result = await request.app.mongodb["users"].insert_one(user_dict)
        created_user = await request.app.mongodb["users"].find_one({"_id": result.inserted_id})
        
        print(f"✅ User registered successfully: {user.email}")
        return created_user
    except HTTPException:
        raise
    except Exception as e:
        print(f"💥 Registration error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=UserResponse)
async def login_user(login_data: UserLogin, request: Request):
    """User login with detailed debugging"""
    print('🔐 LOGIN ATTEMPT:', login_data.dict())
    
    try:
        email = login_data.email
        password = login_data.password
        
        print('📧 Looking for user:', email)
        user = await request.app.mongodb["users"].find_one({"email": email})
        print('👤 User found:', bool(user))
        
        if not user:
            print('❌ User not found')
            raise HTTPException(status_code=400, detail="Invalid credentials")
        
        print('🔑 Checking password...')
        # Check if password is hashed (starts with $2b$ for bcrypt)
        stored_password = user["password"]
        
        if stored_password.startswith('$2b$'):
            # Password is hashed, use bcrypt to verify
            print('🔒 Using bcrypt verification')
            is_valid = bcrypt.checkpw(password.encode('utf-8'), stored_password.encode('utf-8'))
        else:
            # Legacy plain text password (for backward compatibility)
            print('⚠️ Using plain text verification (legacy)')
            is_valid = stored_password == password
            
        print('✅ Password valid:', is_valid)
        
        if not is_valid:
            print('❌ Invalid password')
            raise HTTPException(status_code=400, detail="Invalid credentials")
        
        print('🎉 Login successful')
        
        # Return user data without password
        return UserResponse(
            id=str(user["_id"]),
            name=user["name"],
            email=user["email"],
            phone=user["phone"]
        )
        
    except HTTPException:
        raise
    except Exception as error:
        print('💥 Login error:', str(error))
        print('💥 Error type:', type(error).__name__)
        raise HTTPException(status_code=500, detail="Server error")
