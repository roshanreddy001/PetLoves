#!/usr/bin/env python3
"""
Add login credentials to existing users and create new test users
This script updates the existing users with passwords for login functionality
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from datetime import datetime
from bson import ObjectId

# Load environment variables
load_dotenv()

async def add_login_credentials():
    """Add login credentials to existing users and create test users"""
    
    # Get MongoDB URI from environment
    mongodb_uri = os.getenv("MONGODB_URI")
    if not mongodb_uri:
        print("❌ MONGODB_URI not found in environment variables")
        return False
    
    print(f"Connecting to MongoDB...")
    
    # Create MongoDB client
    client = AsyncIOMotorClient(
        mongodb_uri,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=10000,
        socketTimeoutMS=10000,
        tls=True,
        tlsAllowInvalidCertificates=False
    )
    
    try:
        # Test connection
        await client.admin.command('ping')
        print("✅ Connected to MongoDB successfully!")
        
        # Get the petlove database
        db = client.petlove
        
        print("\n🔐 Adding passwords to existing users...")
        
        # Update existing users with passwords
        existing_users = await db.users.find({}).to_list(length=None)
        
        user_credentials = [
            {"email": "john.doe@example.com", "password": "password123"},
            {"email": "jane.smith@example.com", "password": "password456"},
            {"email": "mike.johnson@example.com", "password": "password789"}
        ]
        
        for user in existing_users:
            # Find matching credentials
            cred = next((c for c in user_credentials if c["email"] == user["email"]), None)
            if cred and "password" not in user:
                # Update user with password
                await db.users.update_one(
                    {"_id": user["_id"]},
                    {"$set": {
                        "password": cred["password"],
                        "updated_at": datetime.utcnow()
                    }}
                )
                print(f"✅ Added password to user: {user['email']}")
            elif "password" in user:
                print(f"ℹ️  User already has password: {user['email']}")
        
        # Create additional test users with login credentials
        print("\n👥 Creating additional test users with login credentials...")
        
        test_users = [
            {
                "_id": ObjectId(),
                "name": "Test User",
                "email": "test@example.com",
                "password": "test123",
                "phone": "+1234567893",
                "address": "123 Test St, Test City, TC 12345",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "_id": ObjectId(),
                "name": "Demo User",
                "email": "demo@example.com", 
                "password": "demo123",
                "phone": "+1234567894",
                "address": "456 Demo Ave, Demo City, DC 12346",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "_id": ObjectId(),
                "name": "Admin User",
                "email": "admin@petlove.com",
                "password": "admin123",
                "phone": "+1234567895",
                "address": "789 Admin Blvd, Admin City, AC 12347",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        ]
        
        # Insert test users (skip if already exist)
        for user in test_users:
            existing = await db.users.find_one({"email": user["email"]})
            if not existing:
                await db.users.insert_one(user)
                print(f"✅ Created test user: {user['name']} ({user['email']})")
            else:
                print(f"ℹ️  Test user already exists: {user['email']}")
        
        # Display all users with their login credentials
        print("\n📋 Available Login Credentials:")
        print("=" * 50)
        
        all_users = await db.users.find({}).to_list(length=None)
        
        for user in all_users:
            if "password" in user:
                print(f"📧 Email: {user['email']}")
                print(f"🔑 Password: {user['password']}")
                print(f"👤 Name: {user['name']}")
                print("-" * 30)
        
        print(f"\n📊 Total users with login credentials: {len(all_users)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Failed to add login credentials: {e}")
        return False
        
    finally:
        client.close()

if __name__ == "__main__":
    print("🚀 Adding login credentials to PetLove users...")
    success = asyncio.run(add_login_credentials())
    
    if success:
        print("\n✨ Login credentials are ready!")
        print("\n🔗 You can now test login at: http://localhost:5000/api/users/login")
    else:
        print("\n💥 Failed to add login credentials!")
