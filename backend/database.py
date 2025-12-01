from sqlmodel import SQLModel, create_engine
import os

DATABASE_FILE_NAME = "database.db"
DATABASE_URL = f"sqlite:///../data/{DATABASE_FILE_NAME}"

# Ensure data directory exists
os.makedirs("../data", exist_ok=True)

engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
