import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for missing Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ComparisonMap = ({ reportedLocation, resolvedLocation, distance }) => {
  const mapRef = useRef();
  
  // Convert coordinates to [lat, lng] format
  const reportedPos = [
    reportedLocation.coordinates[1],
    reportedLocation.coordinates[0]
  ];
  
  const resolvedPos = [
    resolvedLocation.coordinates[1],
    resolvedLocation.coordinates[0]
  ];

  // Calculate midpoint for distance label
  const midPoint = [
    (reportedPos[0] + resolvedPos[0]) / 2,
    (reportedPos[1] + resolvedPos[1]) / 2
  ];

  // Auto-fit map to markers
  useEffect(() => {
    if (mapRef.current) {
      const bounds = L.latLngBounds([reportedPos, resolvedPos]);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [reportedPos, resolvedPos]);

  return (
    <div className="comparison-map">
      <h3>Location Comparison</h3>
      <p className="distance-display">
        Distance: <strong>{distance.toFixed(2)} meters</strong>
      </p>
      
      <MapContainer 
        center={midPoint} 
        zoom={15} 
        style={{ height: '400px', width: '100%' }}
        whenCreated={map => mapRef.current = map}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Reported Location Marker */}
        <Marker position={reportedPos}>
          <Tooltip permanent direction="top" offset={[0, -10]}>
            <span className="map-label reported">Reported Location</span>
          </Tooltip>
        </Marker>
        
        {/* Resolved Location Marker */}
        <Marker position={resolvedPos}>
          <Tooltip permanent direction="top" offset={[0, -10]}>
            <span className="map-label resolved">Resolved Location</span>
          </Tooltip>
        </Marker>
        
        {/* Connecting Line with Distance */}
        <Polyline 
          positions={[reportedPos, resolvedPos]} 
          color="#3b82f6" 
          weight={3}
          dashArray="5, 10"
        >
          <Tooltip 
            permanent 
            className="distance-tooltip"
            direction="center"
            position={midPoint}
          >
            {distance.toFixed(2)} meters
          </Tooltip>
        </Polyline>
      </MapContainer>
    </div>
  );
};

export default ComparisonMap;