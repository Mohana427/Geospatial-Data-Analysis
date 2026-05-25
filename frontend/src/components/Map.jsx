import React from 'react';
import DeckGL from '@deck.gl/react';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import { ScatterplotLayer } from '@deck.gl/layers';
import { Map } from 'react-map-gl/maplibre';

const INITIAL_VIEW_STATE = {
  longitude: -98.5795,
  latitude: 39.8283,
  zoom: 4,
  pitch: 45,
  bearing: 0
};

// Using a free map style from Carto via Maplibre
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

const colorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78]
];

export default function DeckGLMap({ salesData, stores, hotspots, viewState, onViewStateChange }) {
  
  const layers = [
    // 3D Hexagon Layer for Sales Density
    new HexagonLayer({
      id: 'heatmap',
      data: salesData,
      elevationRange: [0, 200000],
      elevationScale: salesData && salesData.length ? 50 : 0,
      extruded: true,
      getPosition: d => [d.lon, d.lat],
      getWeight: d => d.sales,
      radius: 30000,
      coverage: 0.8,
      colorRange,
      upperPercentile: 100,
      pickable: true,
      autoHighlight: true,
      transitions: {
        elevationScale: 3000
      }
    }),
    
    // Existing Stores Layer
    new ScatterplotLayer({
      id: 'existing-stores',
      data: stores,
      getPosition: d => [d.lon, d.lat],
      getFillColor: [0, 255, 255, 200],
      getLineColor: [0, 255, 255, 255],
      lineWidthMinPixels: 2,
      getRadius: 20000,
      radiusMinPixels: 6,
      radiusMaxPixels: 20,
      stroked: true,
      pickable: true
    }),

    // Recommended Target Locations Layer
    new ScatterplotLayer({
      id: 'target-locations',
      data: hotspots,
      getPosition: d => [d.lon, d.lat],
      getFillColor: [255, 0, 255, 200],
      getLineColor: [255, 0, 255, 255],
      lineWidthMinPixels: 3,
      getRadius: 30000,
      radiusMinPixels: 10,
      radiusMaxPixels: 30,
      stroked: true,
      pickable: true
    })
  ];

  const getTooltip = ({object, layer}) => {
    if (!object) return null;
    if (layer.id === 'heatmap') {
      return `Total Sales Density: $${(object.elevationValue || 0).toFixed(2)}\nCount: ${object.points.length}`;
    }
    if (layer.id === 'existing-stores') {
      return `Existing Store\n${object.name}`;
    }
    if (layer.id === 'target-locations') {
      return `Expansion Target\nHotspot Score: ${object.score.toExponential(2)}`;
    }
  };

  return (
    <DeckGL
      layers={layers}
      viewState={viewState || INITIAL_VIEW_STATE}
      onViewStateChange={onViewStateChange}
      controller={true}
      getTooltip={getTooltip}
    >
      <Map reuseMaps mapStyle={MAP_STYLE} />
    </DeckGL>
  );
}
