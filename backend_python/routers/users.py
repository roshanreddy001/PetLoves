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

@router.get("/debug/emails")
async def debug_emails(request: Request):
    """Debug endpoint to check existing emails"""
    try:
        users = await request.app.mongodb["users"].find({}, {"email": 1, "name": 1}).to_list(1000)
        emails = [{"email": user.get("email", "N/A"), "name": user.get("name", "N/A")} for user in users]
        print(f"📧 Found {len(emails)} users in database:")
        for user_info in emails:
            print(f"   - {user_info['email']} ({user_info['name']})")
        return {"total_users": len(emails), "emails": emails}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", status_code=201)
async def register_user(user: UserCreate, request: Request):
    """Register new user"""
    try:
        # Normalize email to lowercase to prevent case-sensitive duplicates
        normalized_email = user.email.lower().strip()
        print(f"🔐 REGISTRATION ATTEMPT: {normalized_email} (original: {user.email})")
        
        # Check for duplicate email (case-insensitive)
        existing_user = await request.app.mongodb["users"].find_one({"email": {"$regex": f"^{normalized_email}$", "$options": "i"}})
        if existing_user:
            print(f"❌ Email already exists: {normalized_email}")
            print(f"📧 Existing user email: {existing_user.get('email', 'N/A')}")
            raise HTTPException(status_code=409, detail="Email already registered")
        
        # Hash the password
        print("🔑 Hashing password...")
        hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
        
        user_dict = user.dict()
        user_dict["email"] = normalized_email  # Store normalized email
        user_dict["password"] = hashed_password.decode('utf-8')  # Store as string
        
        print("💾 Saving user to database...")
        result = await request.app.mongodb["users"].insert_one(user_dict)
        created_user = await request.app.mongodb["users"].find_one({"_id": result.inserted_id})
        
        print(f"✅ User registered successfully: {normalized_email}")
        
        # Return response similar to Express.js format
        return {
            "id": str(created_user["_id"]),
            "name": created_user["name"],
            "email": created_user["email"],
            "phone": created_user["phone"],
            "message": "Account created successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"💥 Registration error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/register", status_code=201)
async def register_user_alt(user: UserCreate, request: Request):
    """Register new user (alternative endpoint)"""
    try:
        # Normalize email to lowercase to prevent case-sensitive duplicates
        normalized_email = user.email.lower().strip()
        print(f"🔐 REGISTRATION ATTEMPT (ALT): {normalized_email} (original: {user.email})")
        
        # Check for duplicate email (case-insensitive)
        existing_user = await request.app.mongodb["users"].find_one({"email": {"$regex": f"^{normalized_email}$", "$options": "i"}})
        if existing_user:
            print(f"❌ Email already exists: {normalized_email}")
            print(f"📧 Existing user email: {existing_user.get('email', 'N/A')}")
            raise HTTPException(status_code=409, detail="Email already registered")
        
        # Hash the password
        print("🔑 Hashing password...")
        hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
        
        user_dict = user.dict()
        user_dict["email"] = normalized_email  # Store normalized email
        user_dict["password"] = hashed_password.decode('utf-8')  # Store as string
        
        print("💾 Saving user to database...")
        result = await request.app.mongodb["users"].insert_one(user_dict)
        created_user = await request.app.mongodb["users"].find_one({"_id": result.inserted_id})
        
        print(f"✅ User registered successfully: {normalized_email}")
        
        # Return response similar to Express.js format
        return {
            "id": str(created_user["_id"]),
            "name": created_user["name"],
            "email": created_user["email"],
            "phone": created_user["phone"],
            "message": "Account created successfully"
        }
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
        # Normalize email for consistent lookup
        email = login_data.email.lower().strip()
        password = login_data.password
        
        print('📧 Looking for user:', email)
        user = await request.app.mongodb["users"].find_one({"email": {"$regex": f"^{email}$", "$options": "i"}})
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
