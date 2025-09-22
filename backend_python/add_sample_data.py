#!/usr/bin/env python3
"""
Sample data insertion script for PetLove
This script adds sample data to test the PetLove application
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from datetime import datetime, timedelta
from bson import ObjectId

# Load environment variables
load_dotenv()

async def add_sample_data():
    """Add sample data to the PetLove database"""
    
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
        
        # Sample Users
        print("\n👥 Adding sample users...")
        sample_users = [
            {
                "_id": ObjectId(),
                "name": "John Doe",
                "email": "john.doe@example.com",
                "phone": "+1234567890",
                "address": "123 Main St, City, State 12345",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "_id": ObjectId(),
                "name": "Jane Smith",
                "email": "jane.smith@example.com", 
                "phone": "+1234567891",
                "address": "456 Oak Ave, City, State 12346",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "_id": ObjectId(),
                "name": "Mike Johnson",
                "email": "mike.johnson@example.com",
                "phone": "+1234567892", 
                "address": "789 Pine Rd, City, State 12347",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        ]
        
        # Insert users (skip if already exist)
        for user in sample_users:
            existing = await db.users.find_one({"email": user["email"]})
            if not existing:
                await db.users.insert_one(user)
                print(f"✅ Added user: {user['name']}")
            else:
                print(f"ℹ️  User already exists: {user['name']}")
        
        # Get user IDs for relationships
        users = await db.users.find({}).to_list(length=None)
        user_ids = [user["_id"] for user in users]
        
        # Sample Pets
        print("\n🐕 Adding sample pets...")
        sample_pets = [
            {
                "_id": ObjectId(),
                "name": "Buddy",
                "species": "Dog",
                "breed": "Golden Retriever",
                "age": 3,
                "color": "Golden",
                "size": "Large",
                "gender": "Male",
                "description": "Friendly and energetic dog, great with kids",
                "adoption_status": "available",
                "price": 500.00,
                "images": ["buddy1.jpg", "buddy2.jpg"],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "_id": ObjectId(),
                "name": "Whiskers",
                "species": "Cat",
                "breed": "Persian",
                "age": 2,
                "color": "White",
                "size": "Medium",
                "gender": "Female",
                "description": "Calm and affectionate cat, loves to cuddle",
                "adoption_status": "available",
                "price": 300.00,
                "images": ["whiskers1.jpg"],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "_id": ObjectId(),
                "name": "Charlie",
                "species": "Dog",
                "breed": "Labrador",
                "age": 1,
                "color": "Black",
                "size": "Large",
                "gender": "Male",
                "description": "Playful puppy, needs training",
                "adoption_status": "adopted",
                "price": 600.00,
                "images": ["charlie1.jpg", "charlie2.jpg"],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        ]
        
        # Insert pets (skip if already exist)
        for pet in sample_pets:
            existing = await db.pets.find_one({"name": pet["name"], "breed": pet["breed"]})
            if not existing:
                await db.pets.insert_one(pet)
                print(f"✅ Added pet: {pet['name']} ({pet['species']})")
            else:
                print(f"ℹ️  Pet already exists: {pet['name']}")
        
        # Get pet IDs for relationships
        pets = await db.pets.find({}).to_list(length=None)
        pet_ids = [pet["_id"] for pet in pets]
        
        # Sample Orders
        print("\n🛒 Adding sample orders...")
        sample_orders = [
            {
                "_id": ObjectId(),
                "user_id": user_ids[0] if user_ids else ObjectId(),
                "items": [
                    {"product_name": "Dog Food Premium", "quantity": 2, "price": 45.99},
                    {"product_name": "Dog Toy Ball", "quantity": 1, "price": 12.99}
                ],
                "total_amount": 104.97,
                "status": "delivered",
                "order_date": datetime.utcnow() - timedelta(days=5),
                "delivery_date": datetime.utcnow() - timedelta(days=2),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "_id": ObjectId(),
                "user_id": user_ids[1] if len(user_ids) > 1 else ObjectId(),
                "items": [
                    {"product_name": "Cat Litter", "quantity": 1, "price": 24.99},
                    {"product_name": "Cat Treats", "quantity": 3, "price": 8.99}
                ],
                "total_amount": 51.96,
                "status": "processing",
                "order_date": datetime.utcnow() - timedelta(days=1),
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        ]
        
        # Insert orders
        for order in sample_orders:
            await db.orders.insert_one(order)
            print(f"✅ Added order: ${order['total_amount']}")
        
        # Sample Adoptions
        print("\n🏠 Adding sample adoptions...")
        if user_ids and pet_ids:
            sample_adoptions = [
                {
                    "_id": ObjectId(),
                    "user_id": user_ids[0],
                    "pet_id": pet_ids[2] if len(pet_ids) > 2 else pet_ids[0],  # Charlie (adopted)
                    "adoption_date": datetime.utcnow() - timedelta(days=10),
                    "status": "completed",
                    "adoption_fee": 600.00,
                    "notes": "Great match! Charlie loves his new family.",
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            ]
            
            for adoption in sample_adoptions:
                await db.adoptions.insert_one(adoption)
                print(f"✅ Added adoption record")
        
        # Sample Appointments
        print("\n📅 Adding sample appointments...")
        if user_ids:
            sample_appointments = [
                {
                    "_id": ObjectId(),
                    "user_id": user_ids[0],
                    "appointment_type": "Veterinary Checkup",
                    "appointment_date": datetime.utcnow() + timedelta(days=3),
                    "duration_minutes": 60,
                    "status": "scheduled",
                    "notes": "Annual checkup for Buddy",
                    "veterinarian": "Dr. Sarah Wilson",
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                },
                {
                    "_id": ObjectId(),
                    "user_id": user_ids[1] if len(user_ids) > 1 else user_ids[0],
                    "appointment_type": "Grooming",
                    "appointment_date": datetime.utcnow() + timedelta(days=7),
                    "duration_minutes": 90,
                    "status": "scheduled",
                    "notes": "Full grooming service for Whiskers",
                    "veterinarian": "Groomer Mike",
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            ]
            
            for appointment in sample_appointments:
                await db.appointments.insert_one(appointment)
                print(f"✅ Added appointment: {appointment['appointment_type']}")
        
        # Sample Visits
        print("\n🏥 Adding sample visits...")
        if user_ids:
            sample_visits = [
                {
                    "_id": ObjectId(),
                    "user_id": user_ids[0],
                    "visit_date": datetime.utcnow() - timedelta(days=30),
                    "visit_type": "Emergency",
                    "reason": "Buddy injured his paw during play",
                    "diagnosis": "Minor cut, cleaned and bandaged",
                    "treatment": "Antiseptic cleaning, bandage, pain medication",
                    "cost": 125.00,
                    "veterinarian": "Dr. Sarah Wilson",
                    "follow_up_required": False,
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            ]
            
            for visit in sample_visits:
                await db.visits.insert_one(visit)
                print(f"✅ Added visit record: {visit['visit_type']}")
        
        # Verify data was added
        print("\n📊 Verifying sample data...")
        collections = ['users', 'pets', 'orders', 'adoptions', 'appointments', 'visits']
        
        for collection_name in collections:
            count = await db[collection_name].count_documents({})
            print(f"✅ {collection_name}: {count} documents")
        
        print(f"\n🎉 Sample data added successfully!")
        
        return True
        
    except Exception as e:
        print(f"❌ Failed to add sample data: {e}")
        return False
        
    finally:
        client.close()

if __name__ == "__main__":
    print("🚀 Adding sample data to PetLove database...")
    success = asyncio.run(add_sample_data())
    
    if success:
        print("\n✨ Sample data is ready for testing!")
    else:
        print("\n💥 Failed to add sample data!")
