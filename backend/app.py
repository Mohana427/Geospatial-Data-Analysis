from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import os
from analysis import calculate_hotspots

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SALES_DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "sales_data.json")
STORES_DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "existing_stores.json")

@app.get("/sales")
def get_sales():
    with open(SALES_DATA_PATH, 'r') as f:
        return json.load(f)

@app.get("/stores")
def get_stores():
    with open(STORES_DATA_PATH, 'r') as f:
        return json.load(f)

@app.get("/hotspots")
def get_hotspots():
    hotspots = calculate_hotspots(SALES_DATA_PATH, STORES_DATA_PATH)
    return hotspots

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
