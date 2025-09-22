#!/usr/bin/env python3
"""
Check database contents to verify users are inserted
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def check_database():
    """Check database contents"""
    
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
        
        # List all collections
        collections = await db.list_collection_names()
        print(f"\n📚 Collections in database: {collections}")
        
        # Get document counts for each collection
        print("\n📊 Document counts:")
        for collection_name in collections:
            count = await db[collection_name].count_documents({})
            print(f"  {collection_name}: {count} documents")
        
        # Specifically check users collection
        if "users" in collections:
            print("\n👥 Users in database:")
            users = await db.users.find({}).to_list(length=None)
            for i, user in enumerate(users, 1):
                print(f"  {i}. {user.get('name', 'No name')} ({user.get('email', 'No email')})")
        
        return True
        
    except Exception as e:
        print(f"❌ Failed to check database: {e}")
        return False
        
    finally:
        client.close()

if __name__ == "__main__":
    print("🔍 Checking database contents...")
    success = asyncio.run(check_database())
    
    if success:
        print("\n✅ Database check completed!")
    else:
        print("\n❌ Database check failed!")
