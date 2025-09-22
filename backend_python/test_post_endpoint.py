#!/usr/bin/env python3
"""
Test script to verify the POST /api/users endpoint works correctly
"""

import requests
import json

# Test data
test_user = {
    "name": "Test User",
    "email": "test@example.com",
    "password": "testpassword123",
    "phone": "1234567890"
}

def test_local_endpoint():
    """Test the endpoint locally"""
    url = "http://localhost:5000/api/users"
    
    try:
        response = requests.post(url, json=test_user)
        print(f"Local test - Status Code: {response.status_code}")
        print(f"Local test - Response: {response.text}")
        return response.status_code == 201
    except Exception as e:
        print(f"Local test failed: {e}")
        return False

def test_production_endpoint():
    """Test the endpoint on production"""
    url = "https://petloves-nedk.onrender.com/api/users"
    
    try:
        response = requests.post(url, json=test_user)
        print(f"Production test - Status Code: {response.status_code}")
        print(f"Production test - Response: {response.text}")
        return response.status_code == 201
    except Exception as e:
        print(f"Production test failed: {e}")
        return False

def test_get_endpoint():
    """Test the GET endpoint to verify it works"""
    url = "https://petloves-nedk.onrender.com/api/users"
    
    try:
        response = requests.get(url)
        print(f"GET test - Status Code: {response.status_code}")
        print(f"GET test - Response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"GET test failed: {e}")
        return False

if __name__ == "__main__":
    print("Testing POST /api/users endpoint...")
    print("\n1. Testing GET endpoint first:")
    test_get_endpoint()
    
    print("\n2. Testing POST endpoint on production:")
    test_production_endpoint()
    
    print("\n3. Testing POST endpoint locally (if server is running):")
    test_local_endpoint()
