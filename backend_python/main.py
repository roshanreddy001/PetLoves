from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
import os
import time
import json
from datetime import datetime
from dotenv import load_dotenv

from routers import users, pets, orders, adoptions, appointments, visits, roshan_gpt
from static_server import setup_static_files

# Load environment variables
load_dotenv()

# Comprehensive debugging middleware
async def debug_middleware(request: Request, call_next):
    # Only debug specific endpoints
    debug_paths = ["/api/users/login", "/api/users/register", "/api/users/"]
    
    if not any(request.url.path.startswith(path) for path in debug_paths):
        return await call_next(request)
    
    start_time = time.time()
    
    # Log request details
    print("\nDETAILED REQUEST DEBUG:")
    print(f"Request Time: {datetime.now().isoformat()}")
    print(f"Method: {request.method}")
    print(f"Full URL: {request.url}")
    print(f"Client IP: {request.client.host if request.client else 'Unknown'}")
    
    # Headers analysis
    print("\nREQUEST HEADERS:")
    for key, value in request.headers.items():
        print(f"   {key}: {value}")
    
    # Query parameters
    if request.query_params:
        print("\nQUERY PARAMETERS:")
        for key, value in request.query_params.items():
            print(f"   {key}: {value}")
    
    # Body analysis
    print("\nREQUEST BODY:")
    try:
        # Read the body
        body = await request.body()
        print(f"   Raw Body Length: {len(body)} bytes")
        
        if body:
            try:
                # Try to parse as JSON
                body_json = json.loads(body.decode('utf-8'))
                print(f"   Body Type: JSON")
                print(f"   Body Keys: {list(body_json.keys()) if isinstance(body_json, dict) else 'Not a dict'}")
                print(f"   Body Content: {body_json}")
            except json.JSONDecodeError:
                print(f"   Body Type: Raw bytes")
                print(f"   Body Content: {body.decode('utf-8', errors='replace')}")
        else:
            print("   Body: Empty")
    except Exception as e:
        print(f"   Body Read Error: {str(e)}")
    
    # Process the request
    try:
        response = await call_next(request)
        
        # Calculate response time
        end_time = time.time()
        response_time = (end_time - start_time) * 1000  # Convert to milliseconds
        
        print("\nRESPONSE DEBUG:")
        print(f"   Status Code: {response.status_code}")
        print(f"   Response Time: {response_time:.2f}ms")
        print(f"   Response Headers: {dict(response.headers)}")
        
        # Try to read response body for logging (this is tricky with FastAPI)
        print("=====================================\n")
        
        return response
        
    except Exception as e:
        end_time = time.time()
        response_time = (end_time - start_time) * 1000
        
        print("\nREQUEST FAILED:")
        print(f"   Error: {str(e)}")
        print(f"   Error Type: {type(e).__name__}")
        print(f"   Response Time: {response_time:.2f}ms")
        print("=====================================\n")
        
        raise e

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    mongodb_uri = os.getenv("MONGODB_URI")
    print(f"Connecting to MongoDB with URI: {mongodb_uri[:50]}...")
    
    # Add SSL and timeout configurations
    app.mongodb_client = AsyncIOMotorClient(
        mongodb_uri,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=10000,
        socketTimeoutMS=10000,
        tls=True,
        tlsAllowInvalidCertificates=False
    )
    
    # Test the connection
    try:
        await app.mongodb_client.admin.command('ping')
        print("Connected to MongoDB successfully!")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        
    app.mongodb = app.mongodb_client.petlove
    yield
    # Shutdown
    app.mongodb_client.close()

app = FastAPI(
    title="PetLove API", 
    description="PetLove Backend API in Python", 
    version="1.0.0",
    lifespan=lifespan
)

# Add debugging middleware FIRST (before CORS)
@app.middleware("http")
async def add_debug_middleware(request: Request, call_next):
    return await debug_middleware(request, call_next)

# CORS middleware - Allow all origins for now to fix the issue
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins temporarily to fix CORS issue
    allow_credentials=False,  # Must be False when allow_origins is ["*"]
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)

# Include routers with /api prefix (primary endpoints)
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(pets.router, prefix="/api/pets", tags=["pets"])
app.include_router(orders.router, prefix="/api/orders", tags=["orders"])
app.include_router(adoptions.router, prefix="/api/adoptions", tags=["adoptions"])
app.include_router(appointments.router, prefix="/api/appointments", tags=["appointments"])
app.include_router(visits.router, prefix="/api/visits", tags=["visits"])
app.include_router(roshan_gpt.router, tags=["roshan-gpt"])

@app.get("/api")
async def root():
    return {"message": "PetLove API Running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Server is running"}

@app.get("/api/debug/routes")
async def debug_routes():
    """Debug endpoint to list all registered routes"""
    routes = []
    for route in app.routes:
        if hasattr(route, 'methods') and hasattr(route, 'path'):
            routes.append({
                "path": route.path,
                "methods": list(route.methods),
                "name": getattr(route, 'name', 'unknown')
            })
    return {"routes": routes}

@app.get("/api/database-info")
async def get_database_info():
    """Get information about the database and collections"""
    try:
        # Get database stats
        db = app.mongodb
        
        # List all collections
        collections = await db.list_collection_names()
        
        # Get document counts for each collection
        collection_stats = {}
        for collection_name in collections:
            count = await db[collection_name].count_documents({})
            collection_stats[collection_name] = count
        
        return {
            "database_name": "petlove",
            "mongodb_uri_connected": True,
            "collections": collections,
            "document_counts": collection_stats,
            "total_collections": len(collections)
        }
    except Exception as e:
        return {
            "error": str(e),
            "mongodb_uri_connected": False
        }

@app.post("/api/debug/test-login")
async def test_login_endpoint(request: Request):
    """Test endpoint to simulate login debugging"""
    body = await request.body()
    return {
        "message": "Debug test endpoint reached",
        "method": request.method,
        "headers": dict(request.headers),
        "body_length": len(body),
        "body_content": body.decode('utf-8') if body else None,
        "url": str(request.url)
    }

@app.post("/api/debug/test-register")
async def test_register_endpoint(request: Request):
    """Test endpoint to simulate register debugging"""
    body = await request.body()
    return {
        "message": "Debug test register endpoint reached",
        "method": request.method,
        "headers": dict(request.headers),
        "body_length": len(body),
        "body_content": body.decode('utf-8') if body else None,
        "url": str(request.url)
    }

# Setup static file serving for production
setup_static_files(app)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
