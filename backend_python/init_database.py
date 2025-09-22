#!/usr/bin/env python3
"""
Database initialization script for PetLove
This script creates collections and indexes for the PetLove application
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def init_database():
    """Initialize the PetLove database with collections and indexes"""
    
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
        
        # Define collections to create
        collections = [
            'users',
            'pets', 
            'orders',
            'adoptions',
            'appointments',
            'visits'
        ]
        
        print("\n📦 Creating collections...")
        
        # Create collections
        for collection_name in collections:
            try:
                await db.create_collection(collection_name)
                print(f"✅ Created collection: {collection_name}")
            except Exception as e:
                if "already exists" in str(e).lower():
                    print(f"ℹ️  Collection already exists: {collection_name}")
                else:
                    print(f"❌ Error creating collection {collection_name}: {e}")
        
        print("\n🔍 Creating indexes...")
        
        # Create indexes for better performance
        indexes = [
            # Users collection
            (db.users, {"email": 1}, {"unique": True}),
            
            # Pets collection
            (db.pets, {"name": 1}, {}),
            (db.pets, {"species": 1}, {}),
            (db.pets, {"breed": 1}, {}),
            
            # Orders collection
            (db.orders, {"user_id": 1}, {}),
            
            # Adoptions collection
            (db.adoptions, {"user_id": 1}, {}),
            (db.adoptions, {"pet_id": 1}, {}),
            
            # Appointments collection
            (db.appointments, {"user_id": 1}, {}),
            
            # Visits collection
            (db.visits, {"user_id": 1}, {}),
        ]
        
        for collection, index_spec, options in indexes:
            try:
                await collection.create_index(index_spec, **options)
                index_name = "_".join([f"{k}_{v}" for k, v in index_spec.items()])
                print(f"✅ Created index: {index_name} on {collection.name}")
            except Exception as e:
                if "already exists" in str(e).lower():
                    print(f"ℹ️  Index already exists on {collection.name}")
                else:
                    print(f"❌ Error creating index on {collection.name}: {e}")
        
        # Verify collections were created
        print("\n📋 Verifying collections...")
        collection_names = await db.list_collection_names()
        
        for collection_name in collections:
            if collection_name in collection_names:
                count = await db[collection_name].count_documents({})
                print(f"✅ {collection_name}: {count} documents")
            else:
                print(f"❌ {collection_name}: Not found")
        
        print(f"\n🎉 Database initialization completed!")
        print(f"📊 Total collections: {len(collection_names)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        return False
        
    finally:
        client.close()

if __name__ == "__main__":
    print("🚀 Starting PetLove database initialization...")
    success = asyncio.run(init_database())
    
    if success:
        print("\n✨ Database is ready for use!")
    else:
        print("\n💥 Database initialization failed!")
