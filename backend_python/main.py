from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

from routers import users, pets, orders, adoptions, appointments, visits
from static_server import setup_static_files

# Load environment variables
load_dotenv()

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
        print("✅ Connected to MongoDB successfully!")
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        
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

# Include routers without /api prefix (fallback for deployment issues)
app.include_router(users.router, prefix="/users", tags=["users-fallback"])
app.include_router(pets.router, prefix="/pets", tags=["pets-fallback"])
app.include_router(orders.router, prefix="/orders", tags=["orders-fallback"])
app.include_router(adoptions.router, prefix="/adoptions", tags=["adoptions-fallback"])
app.include_router(appointments.router, prefix="/appointments", tags=["appointments-fallback"])
app.include_router(visits.router, prefix="/visits", tags=["visits-fallback"])

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

# Setup static file serving for production
setup_static_files(app)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
