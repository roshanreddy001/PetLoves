#!/usr/bin/env python3
import sys
import os

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("Python path:", sys.path)
print("Current directory:", os.getcwd())
print("Files in current directory:", os.listdir('.'))

try:
    print("Trying to import fastapi...")
    from fastapi import FastAPI
    print("✓ FastAPI imported successfully")
except Exception as e:
    print("✗ FastAPI import failed:", e)

try:
    print("Trying to import routers.users...")
    from routers import users
    print("✓ routers.users imported successfully")
except Exception as e:
    print("✗ routers.users import failed:", e)

try:
    print("Trying to import models.user...")
    from models.user import User
    print("✓ models.user imported successfully")
except Exception as e:
    print("✗ models.user import failed:", e)
