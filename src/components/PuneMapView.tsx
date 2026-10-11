import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Hotspot, RiskAssessment } from '../types';
import { MapPin, Info, Layers } from 'lucide-react';

interface PuneMapViewProps {
  hotspots: Hotspot[];
  assessments: Record<string, RiskAssessment>;
  selectedHotspotId: string;
  onSelectHotspot: (id: string) => void;
}

export const PuneMapView: React.FC<PuneMapViewProps> = ({
  hotspots,
  assessments,
  selectedHotspotId,
  onSelectHotspot,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center on Southwest Pune (Sinhagad Rd / Parvati / Sahakar Nagar basin)
    const map = L.map(mapContainerRef.current, {
      center: [18.484, 73.836],
      zoom: 13,
      zoomControl: true,
      attributionControl: true,
    });

    mapInstanceRef.current = map;

    // OpenStreetMap standard tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers whenever risk assessments change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    hotspots.forEach((spot) => {
      const assessment = assessments[spot.id];
      const riskLevel = assessment?.level || 'Low';
      const score = assessment?.score ?? 0;

      const markerColor =
        riskLevel === 'High' ? '#ef4444' : riskLevel === 'Medium' ? '#f59e0b' : '#10b981';
      const ringPulse = riskLevel === 'High' ? 'marker-pulse-high' : '';

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="marker-container ${ringPulse}" style="background-color: ${markerColor}">
            <div class="marker-core">
              <span class="marker-score">${score}</span>
            </div>
            <div class="marker-arrow" style="border-top-color: ${markerColor}"></div>
          </div>
        `,
        iconSize: [36, 44],
        iconAnchor: [18, 42],
        popupAnchor: [0, -42],
      });

      const marker = L.marker(spot.coordinates, { icon: customIcon }).addTo(map);

      const popupContent = document.createElement('div');
      popupContent.className = 'leaflet-popup-card';
      popupContent.innerHTML = `
        <div style="font-family: inherit; min-width: 200px;">
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 600;">
            ${spot.ward}
          </div>
          <div style="font-size: 15px; font-weight: 700; color: #0f172a; margin-top: 2px;">
            ${spot.name}
          </div>
          <div style="font-size: 12px; color: #475569; margin-bottom: 8px;">
            ${spot.marathiName}
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; padding: 6px 8px; background: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0;">
            <span style="font-size: 12px; color: #64748b; font-weight: 500;">Risk Status</span>
            <span style="font-size: 12px; font-weight: 700; padding: 2px 8px; border-radius: 9999px; background: ${markerColor}20; color: ${markerColor}; border: 1px solid ${markerColor}60;">
              ${riskLevel} (${score}/100)
            </span>
          </div>
          <div style="font-size: 11px; color: #d97706; background: #fffbeb; padding: 4px 6px; border-radius: 4px; margin-bottom: 8px; border: 1px solid #fde68a;">
            ⚠ ${spot.coordNote}
          </div>
          <button id="btn-select-${spot.id}" style="width: 100%; background: #0284c7; color: white; border: none; padding: 6px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">
            View Explanatory Breakdown
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-select-${spot.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectSpot(spot.id);
          };
        }
      });

      marker.on('click', () => {
        onSelectSpot(spot.id);
      });

      markersRef.current[spot.id] = marker;
    });

    function onSelectSpot(id: string) {
      onSelectHotspot(id);
    }
  }, [hotspots, assessments, onSelectHotspot]);

  // Pan to selected hotspot when selectedHotspotId changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedHotspotId) return;

    const targetSpot = hotspots.find((h) => h.id === selectedHotspotId);
    if (targetSpot) {
      map.flyTo(targetSpot.coordinates, 14, { duration: 0.8 });
      const marker = markersRef.current[targetSpot.id];
      if (marker && !marker.isPopupOpen()) {
        marker.openPopup();
      }
    }
  }, [selectedHotspotId, hotspots]);

  return (
    <div className="map-view-wrapper">
      <div className="map-header-bar">
        <div className="map-title-row">
          <div className="map-badge">
            <MapPin size={16} className="text-sky-500" />
            <span>Interactive Hotspot Map</span>
          </div>
          <span className="map-coords-notice">
            <Info size={13} />
            Illustrative approximate coordinates for demo evaluation
          </span>
        </div>
        <div className="map-legend">
          <span className="legend-item"><span className="legend-dot green"></span> Low Risk</span>
          <span className="legend-item"><span className="legend-dot amber"></span> Medium Risk</span>
          <span className="legend-item"><span className="legend-dot red"></span> High Risk</span>
        </div>
      </div>

      <div className="leaflet-map-container" ref={mapContainerRef} style={{ height: '360px', width: '100%', borderRadius: '12px' }} />

      <div className="map-footer-caption">
        <Layers size={13} />
        <span>OpenStreetMap tiles loaded live. Click any pin or card to inspect rule-based calculation breakdown.</span>
      </div>
    </div>
  );
};
