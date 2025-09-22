#!/usr/bin/env python3
"""
Test database connection and data persistence
"""

import asyncio
import os
import requests
import json
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

async def test_database_directly():
    """Test database connection directly"""
    
    # Get MongoDB URI from environment
    mongodb_uri = os.getenv("MONGODB_URI")
    if not mongodb_uri:
        print("❌ MONGODB_URI not found in environment variables")
        return False
    
    print(f"🔗 Connecting to MongoDB...")
    
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
        total_docs = 0
        for collection_name in collections:
            count = await db[collection_name].count_documents({})
            total_docs += count
            print(f"  {collection_name}: {count} documents")
        
        print(f"\n📈 Total documents across all collections: {total_docs}")
        
        # Test inserting a simple document
        print("\n🧪 Testing data insertion...")
        test_doc = {
            "test_name": "Database Test",
            "timestamp": datetime.utcnow(),
            "test_id": "test_001"
        }
        
        # Insert test document
        result = await db.test_collection.insert_one(test_doc)
        print(f"✅ Test document inserted with ID: {result.inserted_id}")
        
        # Verify it was inserted
        found_doc = await db.test_collection.find_one({"test_id": "test_001"})
        if found_doc:
            print(f"✅ Test document found: {found_doc['test_name']}")
        else:
            print("❌ Test document not found after insertion")
        
        # Clean up test document
        await db.test_collection.delete_one({"test_id": "test_001"})
        print("🧹 Test document cleaned up")
        
        return True
        
    except Exception as e:
        print(f"❌ Database test failed: {e}")
        return False
        
    finally:
        client.close()

def test_api_endpoints():
    """Test API endpoints"""
    
    base_url = "http://localhost:5000/api"
    
    print("\n🌐 Testing API endpoints...")
    
    try:
        # Test root endpoint
        response = requests.get(f"{base_url}")
        if response.status_code == 200:
            print("✅ API root endpoint working")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ API root endpoint failed: {response.status_code}")
        
        # Test database-info endpoint
        response = requests.get(f"{base_url}/database-info")
        if response.status_code == 200:
            data = response.json()
            print("✅ Database info endpoint working")
            print(f"   Collections: {data.get('collections', [])}")
            print(f"   Document counts: {data.get('document_counts', {})}")
        else:
            print(f"❌ Database info endpoint failed: {response.status_code}")
        
        # Test users endpoint
        response = requests.get(f"{base_url}/users")
        if response.status_code == 200:
            users = response.json()
            print(f"✅ Users endpoint working - Found {len(users)} users")
            for user in users[:3]:  # Show first 3 users
                print(f"   - {user.get('name', 'No name')} ({user.get('email', 'No email')})")
        else:
            print(f"❌ Users endpoint failed: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to API server. Is it running on localhost:5000?")
    except Exception as e:
        print(f"❌ API test failed: {e}")

async def main():
    """Main test function"""
    print("🚀 Starting database and API tests...\n")
    
    # Test database directly
    db_success = await test_database_directly()
    
    # Test API endpoints
    test_api_endpoints()
    
    if db_success:
        print("\n✅ Database tests completed successfully!")
    else:
        print("\n❌ Database tests failed!")

if __name__ == "__main__":
    asyncio.run(main())
