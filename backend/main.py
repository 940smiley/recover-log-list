from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import create_db_and_tables
from routers import files, cloud, ai, items, image, categories, stats, training, settings
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    try:
        # Ensure required directories exist
        os.makedirs("../data/logs", exist_ok=True)
        os.makedirs("../data/training_runs", exist_ok=True)
        
        # Initialize database
        create_db_and_tables()
        logger.info("Database initialized successfully")
        
        # Validate AI service
        try:
            from services.ai import ai_service
            logger.info("AI service loaded successfully")
        except Exception as e:
            logger.warning(f"AI service initialization warning: {e}")
        
        # Check rclone availability
        try:
            from services.rclone import rclone_service
            rclone_service.list_remotes()
            logger.info("Rclone service available")
        except Exception as e:
            logger.warning(f"Rclone not available: {e}")
        
        logger.info("Application startup completed")
        
    except Exception as e:
        logger.error(f"Startup failed: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("Application shutdown")

app = FastAPI(
    title="Collectibles Log Book API",
    description="A comprehensive API for managing collectibles with AI-powered features",
    version="1.0.0",
    lifespan=lifespan
)

# Mount the logs directory to serve images
try:
    app.mount("/images", StaticFiles(directory="../data/logs"), name="images")
except Exception as e:
    logger.warning(f"Could not mount images directory: {e}")

# Configure CORS with environment support
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",  # Alternative port
    "http://127.0.0.1:3001",
]

# Add environment variable support for additional origins
import os
additional_origins = os.getenv("CORS_ORIGINS", "").split(",")
origins.extend([origin.strip() for origin in additional_origins if origin.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(files.router)
app.include_router(cloud.router)
app.include_router(ai.router)
app.include_router(items.router)
app.include_router(image.router)
app.include_router(categories.router)
app.include_router(stats.router)
app.include_router(training.router)
app.include_router(settings.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Collectibles Log Book API"}
