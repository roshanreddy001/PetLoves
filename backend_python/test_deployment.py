#!/usr/bin/env python3
"""
Test script to verify all imports work correctly for deployment
"""

def test_imports():
    try:
        print("Testing FastAPI import...")
        from fastapi import FastAPI
        print("✓ FastAPI imported successfully")
        
        print("Testing Pydantic import...")
        from pydantic import BaseModel
        print("✓ Pydantic imported successfully")
        
        print("Testing Motor import...")
        from motor.motor_asyncio import AsyncIOMotorClient
        print("✓ Motor imported successfully")
        
        print("Testing PyMongo import...")
        from pymongo import MongoClient
        print("✓ PyMongo imported successfully")
        
        print("Testing other dependencies...")
        from python_multipart import multipart
        import email_validator
        from dotenv import load_dotenv
        print("✓ All other dependencies imported successfully")
        
        print("Testing custom models...")
        from models.base import BaseMongoModel, PyObjectId
        from models.user import User, UserCreate
        from models.pet import Pet, PetCreate
        print("✓ Custom models imported successfully")
        
        print("\n🎉 All imports successful! Deployment should work.")
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    test_imports()
