import React, { useState, useEffect } from 'react';
import DeckGLMap from './components/Map';
import { Target, Map as MapIcon, BarChart3, TrendingUp, Store } from 'lucide-react';

function App() {
  const [salesData, setSalesData] = useState([]);
  const [stores, setStores] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [viewState, setViewState] = useState({
    longitude: -98.5795,
    latitude: 39.8283,
    zoom: 4,
    pitch: 45,
    bearing: 0
  });

  useEffect(() => {
    // Fetch data from backend
    const fetchData = async () => {
      try {
        const salesRes = await fetch('http://localhost:8000/sales');
        const sales = await salesRes.json();
        setSalesData(sales);

        const storesRes = await fetch('http://localhost:8000/stores');
        const storesData = await storesRes.json();
        setStores(storesData);

        const hotspotsRes = await fetch('http://localhost:8000/hotspots');
        const hotspotsData = await hotspotsRes.json();
        setHotspots(hotspotsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const totalSales = salesData.reduce((acc, curr) => acc + curr.sales, 0);

  const handleTargetClick = (target) => {
    setViewState({
      longitude: target.lon,
      latitude: target.lat,
      zoom: 7,
      pitch: 60,
      bearing: 0,
      transitionDuration: 1500
    });
  };

  return (
    <div className="dashboard-container">
      {/* 3D Map Background */}
      <DeckGLMap 
        salesData={salesData} 
        stores={stores} 
        hotspots={hotspots}
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
      />

      {/* Header Overlay */}
      <header className="header-panel glass-panel">
        <MapIcon size={32} color="#0ff" />
        <h1 className="header-title">Expansion Analysis 3D</h1>
      </header>

      {/* Sidebar Overlay */}
      <aside className="sidebar-panel glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <BarChart3 color="#0ff" size={24} />
          <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Overview</h2>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Total Data Points</div>
          <div className="stat-value">{salesData.length.toLocaleString()}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Existing Stores</div>
          <div className="stat-value">{stores.length}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Volume Detected</div>
          <div className="stat-value">${(totalSales / 1000).toFixed(1)}k</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
          <Target color="#f0f" size={24} />
          <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Top Targets</h2>
        </div>
        
        <div className="targets-list">
          {hotspots.map((target, index) => (
            <div 
              key={target.id} 
              className="target-card"
              onClick={() => handleTargetClick(target)}
            >
              <div>
                <div className="target-title">Target {index + 1}</div>
                <div className="target-subtitle">Lat: {target.lat.toFixed(2)}, Lon: {target.lon.toFixed(2)}</div>
              </div>
              <Store color="#f0f" size={20} />
            </div>
          ))}
        </div>
      </aside>

      {/* Legend */}
      <div className="legend-panel glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <TrendingUp size={20} color="#c5c6c7" />
          <span style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase' }}>Legend</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'linear-gradient(to right, orange, red)' }}></div>
            <span style={{ fontSize: '12px' }}>High Sales Density</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #0ff', background: 'rgba(0,255,255,0.2)' }}></div>
            <span style={{ fontSize: '12px' }}>Existing Store</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #f0f', background: 'rgba(255,0,255,0.4)' }}></div>
            <span style={{ fontSize: '12px' }}>Expansion Target</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
