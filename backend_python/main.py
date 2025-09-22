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

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://petlover-5qxxu7vm4-roshanreddy001s-projects.vercel.app",
        "https://petloves-nedk.onrender.com",
        "https://*.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(pets.router, prefix="/api/pets", tags=["pets"])
app.include_router(orders.router, prefix="/api/orders", tags=["orders"])
app.include_router(adoptions.router, prefix="/api/adoptions", tags=["adoptions"])
app.include_router(appointments.router, prefix="/api/appointments", tags=["appointments"])
app.include_router(visits.router, prefix="/api/visits", tags=["visits"])

@app.get("/api")
async def root():
    return {"message": "PetLove API Running!"}

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
