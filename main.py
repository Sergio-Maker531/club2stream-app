from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os

# Créer l'application FastAPI
app = FastAPI(title="Club2Stream API", version="1.0.0")

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Clubs de démonstration
CLUBS = [
    {"id": 1, "name": "Berghain", "city": "Berlin", "genre": "Techno", "status": "live", "listeners": 234},
    {"id": 2, "name": "Pacha", "city": "Ibiza", "genre": "House", "status": "live", "listeners": 312},
    {"id": 3, "name": "Studio 54", "city": "New York", "genre": "Disco", "status": "live", "listeners": 278},
    {"id": 4, "name": "Bob Marley Club", "city": "Kingston", "genre": "Reggae", "status": "live", "listeners": 167},
]

@app.get("/")
async def root():
    return {"message": "🎵 Club2Stream API - Ready for streaming!", "status": "online"}

@app.get("/api/clubs")
async def get_clubs():
    return {"clubs": CLUBS}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "Club2Stream"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
