#!/usr/bin/env python3
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Check if MONGODB_URI exists
mongodb_uri = os.getenv("MONGODB_URI")
if mongodb_uri:
    print("✅ MONGODB_URI found")
    print(f"URI starts with: {mongodb_uri[:30]}...")
else:
    print("❌ MONGODB_URI not found")

# List all environment variables that start with MONGO
print("\nMongoDB related environment variables:")
for key, value in os.environ.items():
    if 'MONGO' in key.upper():
        print(f"{key}: {value[:50]}...")
