from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import create_db_and_tables
from routers import files, cloud, ai, items, image, categories, stats, training, settings
import os

app = FastAPI(title="Collectibles Log Book API")

# Ensure logs directory exists
os.makedirs("../data/logs", exist_ok=True)

# Mount the logs directory to serve images
app.mount("/images", StaticFiles(directory="../data/logs"), name="images")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

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
