import React from 'react';
import type { Hotspot, RiskAssessment, WeatherSimulation } from '../types';
import { ShieldCheck, AlertTriangle, AlertOctagon, Info, ChevronRight, BellRing, Droplets, Mountain, History, Waves } from 'lucide-react';

interface HotspotCardProps {
  hotspot: Hotspot;
  assessment: RiskAssessment;
  weather: WeatherSimulation;
  isSelected: boolean;
  onSelect: () => void;
  onOpenReportModal: (hotspotId: string) => void;
  onOpenAlertPreview: (hotspotId: string) => void;
}

export const HotspotCard: React.FC<HotspotCardProps> = ({
  hotspot,
  assessment,
  weather,
  isSelected,
  onSelect,
  onOpenReportModal,
  onOpenAlertPreview,
}) => {
  const { level, score, factorBreakdown, explanation, keyConcerns, recommendedPrecautions } = assessment;

  const riskBadgeConfig = {
    Low: {
      label: 'Low Risk',
      bgClass: 'badge-low',
      icon: <ShieldCheck size={18} className="text-emerald-600" />,
      colorHex: '#10b981',
    },
    Medium: {
      label: 'Medium Watch',
      bgClass: 'badge-medium',
      icon: <AlertTriangle size={18} className="text-amber-600" />,
      colorHex: '#f59e0b',
    },
    High: {
      label: 'High Flood Risk',
      bgClass: 'badge-high',
      icon: <AlertOctagon size={18} className="text-rose-600" />,
      colorHex: '#ef4444',
    },
  }[level];

  return (
    <div
      className={`hotspot-card ${isSelected ? 'selected' : ''} risk-${level.toLowerCase()}`}
      onClick={onSelect}
    >
      {/* Top Banner & Name */}
      <div className="card-top-header">
        <div className="card-heading-group">
          <div className="card-ward">{hotspot.ward}</div>
          <h3 className="card-title">{hotspot.name}</h3>
          <div className="card-marathi-title">{hotspot.marathiName}</div>
        </div>

        <div className="card-score-badge-group">
          <div className={`risk-pill ${riskBadgeConfig.bgClass}`}>
            {riskBadgeConfig.icon}
            <span>{riskBadgeConfig.label}</span>
          </div>
          <div className="score-radial">
            <span className="score-num">{score}</span>
            <span className="score-denom">/100</span>
          </div>
        </div>
      </div>

      {/* Illustrative Coordinate Notice */}
      <div className="coord-disclaimer-pill">
        <Info size={13} />
        <span>{hotspot.coordNote}</span>
      </div>

      {/* Human-Readable Explanation Box */}
      <div className="explanation-box">
        <div className="explanation-title">
          <span>Rule-based Risk Analysis</span>
        </div>
        <p className="explanation-text">{explanation}</p>
      </div>

      {/* Input Metrics Used (Requirement 3: Each hotspot displays inputs used) */}
      <div className="inputs-metrics-grid">
        <div className="metric-cell">
          <div className="metric-header">
            <Droplets size={13} className="text-blue-500" />
            <span>Rain Intensity</span>
          </div>
          <div className="metric-value">{weather.intensityMmPerHour} mm/h</div>
          <div className="metric-sub">Contributes {factorBreakdown.intensityScore} pts</div>
        </div>

        <div className="metric-cell">
          <div className="metric-header">
            <Droplets size={13} className="text-cyan-500" />
            <span>24h Rainfall</span>
          </div>
          <div className="metric-value">{weather.cumulative24hMm} mm</div>
          <div className="metric-sub">Contributes {factorBreakdown.cumulativeScore} pts</div>
        </div>

        <div className="metric-cell">
          <div className="metric-header">
            <Mountain size={13} className="text-amber-500" />
            <span>Terrain Vulnerability (estimated)</span>
          </div>
          <div className="metric-value">{Math.round(hotspot.lowLyingFactor * 100)}%</div>
          <div className="metric-sub">Contributes {factorBreakdown.terrainScore} pts</div>
        </div>

        <div className="metric-cell">
          <div className="metric-header">
            <Waves size={13} className="text-indigo-500" />
            <span>Dam Spillway</span>
          </div>
          <div className="metric-value">{(weather.damDischargeCusecs / 1000).toFixed(1)}k cusecs</div>
          <div className="metric-sub">Contributes {factorBreakdown.damDischargeScore} pts</div>
        </div>

        <div className="metric-cell">
          <div className="metric-header">
            <History size={13} className="text-slate-500" />
            <span>Verified Incidents</span>
          </div>
          <div className="metric-value">{hotspot.historicalIncidentCount} events</div>
          <div className="metric-sub">Contributes {factorBreakdown.historyScore} pts</div>
        </div>
      </div>

      {/* Key Concerns & Precautions */}
      {keyConcerns.length > 0 && (
        <div className="concerns-list">
          <div className="concerns-title">Key Vulnerability Factors:</div>
          <ul>
            {keyConcerns.map((concern, idx) => (
              <li key={idx}>{concern}</li>
            ))}
          </ul>
        </div>
      )}

      {recommendedPrecautions.length > 0 && (
        <div className="concerns-list" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
          <div className="concerns-title" style={{ color: '#166534' }}>Recommended Citizen Precautions:</div>
          <ul style={{ color: '#14532d' }}>
            {recommendedPrecautions.map((precaution, idx) => (
              <li key={idx}>{precaution}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="card-actions-bar" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="btn-report-hotspot"
          onClick={() => onOpenReportModal(hotspot.id)}
        >
          <span>Report Waterlogging Here</span>
          <ChevronRight size={14} />
        </button>

        {level === 'High' && (
          <button
            type="button"
            className="btn-alert-preview"
            onClick={() => onOpenAlertPreview(hotspot.id)}
            title="Preview simulated emergency broadcast"
          >
            <BellRing size={14} />
            <span>Preview High-Risk Alert</span>
          </button>
        )}
      </div>
    </div>
  );
};
