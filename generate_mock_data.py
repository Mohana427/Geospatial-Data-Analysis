import json
import random

def generate_data():
    # Bounding box roughly for the contiguous US
    lat_min, lat_max = 25.0, 49.0
    lon_min, lon_max = -125.0, -66.0

    # Major city clusters (lat, lon) to generate more demand around them
    cities = [
        (40.7128, -74.0060),  # NYC
        (34.0522, -118.2437), # LA
        (41.8781, -87.6298),  # Chicago
        (29.7604, -95.3698),  # Houston
        (33.4484, -112.0740), # Phoenix
        (39.9526, -75.1652),  # Philadelphia
        (29.4241, -98.4936),  # San Antonio
        (32.7157, -117.1611), # San Diego
        (32.7767, -96.7970),  # Dallas
        (37.3382, -121.8863), # San Jose
        (47.6062, -122.3321), # Seattle
        (39.7392, -104.9903), # Denver
        (33.7490, -84.3880),  # Atlanta
        (25.7617, -80.1918)   # Miami
    ]

    sales_data = []
    # Generate 5000 sales points
    for _ in range(5000):
        # 70% chance to be near a city, 30% random
        if random.random() < 0.7:
            city = random.choice(cities)
            lat = city[0] + random.uniform(-2, 2)
            lon = city[1] + random.uniform(-2, 2)
        else:
            lat = random.uniform(lat_min, lat_max)
            lon = random.uniform(lon_min, lon_max)
        
        sales = round(random.uniform(100, 5000), 2)
        sales_data.append({
            "lat": lat,
            "lon": lon,
            "sales": sales
        })

    # Generate existing stores
    existing_stores = []
    # Pick a few cities to have stores
    store_cities = random.sample(cities, 6)
    for i, city in enumerate(store_cities):
        lat = city[0] + random.uniform(-0.5, 0.5)
        lon = city[1] + random.uniform(-0.5, 0.5)
        existing_stores.append({
            "id": f"store_{i+1}",
            "lat": lat,
            "lon": lon,
            "name": f"Store {i+1}"
        })

    with open("sales_data.json", "w") as f:
        json.dump(sales_data, f)
    
    with open("existing_stores.json", "w") as f:
        json.dump(existing_stores, f)

    print("Generated sales_data.json and existing_stores.json")

if __name__ == "__main__":
    generate_data()
