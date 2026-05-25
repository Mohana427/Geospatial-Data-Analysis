import json
import math
from scipy.stats import gaussian_kde
import numpy as np

def calculate_hotspots(sales_data_path, existing_stores_path):
    with open(sales_data_path, 'r') as f:
        sales = json.load(f)
    with open(existing_stores_path, 'r') as f:
        stores = json.load(f)

    # Filter out points that are too close to existing stores (e.g. within ~1 degree lat/lon)
    # This simulates finding "storeless demand"
    def distance(p1, p2):
        return math.sqrt((p1['lat'] - p2['lat'])**2 + (p1['lon'] - p2['lon'])**2)

    storeless_sales = []
    for s in sales:
        too_close = False
        for store in stores:
            if distance(s, store) < 1.5:  # roughly 100 miles
                too_close = True
                break
        if not too_close:
            storeless_sales.append(s)
            
    if not storeless_sales:
        return []

    # Calculate KDE on storeless sales to find hotspots
    lats = [s['lat'] for s in storeless_sales]
    lons = [s['lon'] for s in storeless_sales]
    weights = [s['sales'] for s in storeless_sales]

    # Perform KDE
    kde = gaussian_kde(np.vstack([lats, lons]), weights=weights)

    # Evaluate KDE on a grid to find local maxima
    lat_bins = np.linspace(min(lats), max(lats), 50)
    lon_bins = np.linspace(min(lons), max(lons), 50)
    lat_grid, lon_grid = np.meshgrid(lat_bins, lon_bins)
    
    positions = np.vstack([lat_grid.ravel(), lon_grid.ravel()])
    densities = kde(positions)
    
    # Get top 3 indices
    top_indices = densities.argsort()[-3:][::-1]
    
    hotspots = []
    for i, idx in enumerate(top_indices):
        hotspots.append({
            "id": f"new_loc_{i+1}",
            "lat": float(lat_grid.ravel()[idx]),
            "lon": float(lon_grid.ravel()[idx]),
            "score": float(densities[idx])
        })
        
    return hotspots
