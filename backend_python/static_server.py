from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi import Request
import os

def setup_static_files(app):
    """Setup static file serving for the React frontend"""
    
    # Mount static files directory
    if os.path.exists("static"):
        app.mount("/assets", StaticFiles(directory="static/assets"), name="assets")
    
    # Catch-all route for SPA (Single Page Application) routing
    @app.get("/{full_path:path}")
    async def serve_spa(request: Request, full_path: str):
        # Skip API routes
        if full_path.startswith("api/"):
            return
        
        # Check if it's a static file request
        if os.path.exists("static") and full_path:
            file_path = os.path.join("static", full_path)
            if os.path.isfile(file_path):
                return FileResponse(file_path)
        
        # Default to index.html for SPA routing
        if os.path.exists("static/index.html"):
            return FileResponse("static/index.html")
        else:
            return {"message": "Frontend not built. Run 'npm run build' first."}
