import React, { useState, useEffect, useMemo } from 'react';
import { PUNE_HOTSPOTS, INITIAL_COMMUNITY_REPORTS } from './data/mockHotspots';
import type { WeatherSimulation, ThresholdConfig, RiskAssessment, CommunityReport } from './types';
import { DEFAULT_THRESHOLDS, calculateHotspotRisk } from './utils/riskEngine';
import { PuneMapView } from './components/PuneMapView';
import { SimulationControls } from './components/SimulationControls';
import { HotspotCard } from './components/HotspotCard';
import { ReportModal } from './components/ReportModal';
import { CommunityFeed } from './components/CommunityFeed';
import { AlertPreviewModal } from './components/AlertPreviewModal';
import { LimitationsDrawer } from './components/LimitationsDrawer';
import {
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
  Droplets,
  Waves,
  Info,
  Layers,
  MapPin,
  ExternalLink,
} from 'lucide-react';

const STORAGE_KEY = 'pune_flood_watch_reports';

export const App: React.FC = () => {
  // Weather Simulation State
  const [weather, setWeather] = useState<WeatherSimulation>({
    intensityMmPerHour: 22,
    cumulative24hMm: 52,
    damDischargeCusecs: 9500,
    simulationPreset: 'moderate',
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });

  // Configurable Thresholds State
  const [thresholds, setThresholds] = useState<ThresholdConfig>(DEFAULT_THRESHOLDS);

  // Selected Hotspot for focused inspection
  const [selectedHotspotId, setSelectedHotspotId] = useState<string>('sinhagad-rd');

  // Modals & Panels State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [modalTargetHotspotId, setModalTargetHotspotId] = useState<string>('sinhagad-rd');
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertTargetHotspotId, setAlertTargetHotspotId] = useState<string>('sinhagad-rd');
  const [isLimitationsOpen, setIsLimitationsOpen] = useState(false);

  // Community Reports State with LocalStorage persistence
  const [reports, setReports] = useState<CommunityReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore localStorage parse errors
    }
    return INITIAL_COMMUNITY_REPORTS;
  });

  // Save to LocalStorage whenever reports update
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch (e) {
      console.warn('Could not save reports to localStorage', e);
    }
  }, [reports]);

  // Recalculate deterministic risk for all hotspots reactively
  const assessments: Record<string, RiskAssessment> = useMemo(() => {
    const map: Record<string, RiskAssessment> = {};
    PUNE_HOTSPOTS.forEach((spot) => {
      map[spot.id] = calculateHotspotRisk(spot, weather, thresholds);
    });
    return map;
  }, [weather, thresholds]);

  // Stats summary counts
  const summaryCounts = useMemo(() => {
    let high = 0;
    let medium = 0;
    let low = 0;
    Object.values(assessments).forEach((a) => {
      if (a.level === 'High') high++;
      else if (a.level === 'Medium') medium++;
      else low++;
    });
    return { high, medium, low };
  }, [assessments]);

  // Handle new community report submission
  const handleAddReport = (newReport: CommunityReport) => {
    setReports((prev) => [newReport, ...prev]);
  };

  const handleOpenReportModal = (hotspotId?: string) => {
    if (hotspotId) setModalTargetHotspotId(hotspotId);
    setIsReportModalOpen(true);
  };

  const handleOpenAlertPreview = (hotspotId: string) => {
    setAlertTargetHotspotId(hotspotId);
    setIsAlertModalOpen(true);
  };

  const alertTargetHotspot = PUNE_HOTSPOTS.find((h) => h.id === alertTargetHotspotId) || PUNE_HOTSPOTS[0];

  return (
    <div className="app-layout">
      {/* Top Banner: Hackathon & Simulation Status */}
      <div className="top-utility-bar">
        <div className="utility-container">
          <div className="utility-left">
            <span className="utility-notice">
              ⚠️ Local Deterministic Risk Engine • Not Live Municipal Telemetry
            </span>
          </div>
          <div className="utility-right">
            <button
              type="button"
              className="utility-btn"
              onClick={() => setIsLimitationsOpen(true)}
            >
              <Info size={13} />
              <span>Data Sources & Limitations</span>
            </button>
            <span className="utility-divider">|</span>
            <span className="text-xs text-sky-200">PMC Helpline: 020-25501269</span>
          </div>
        </div>
      </div>

      {/* Main Header / Nav */}
      <header className="main-header">
        <div className="header-container">
          <div className="brand-group">
            <div className="brand-icon-wrapper">
              <Droplets size={26} className="text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="brand-title">Pune Flood Watch</h1>
                <span className="brand-badge-marathi">पुणे पूर वॉच</span>
              </div>
              <p className="brand-subtitle">
                Monsoon flood risk for known waterlogging spots in Pune
              </p>
            </div>
          </div>

          <div className="header-actions">
            <button
              type="button"
              className="btn-header-report"
              onClick={() => handleOpenReportModal(selectedHotspotId)}
            >
              <MapPin size={16} />
              <span>Report Waterlogging</span>
            </button>
            <button
              type="button"
              className="btn-header-info"
              onClick={() => setIsLimitationsOpen(true)}
              title="View system design and limitations"
            >
              <Layers size={16} />
              <span>System Info</span>
            </button>
          </div>
        </div>
      </header>

      {/* Live System Summary Strip */}
      <section className="summary-strip">
        <div className="summary-container">
          <div className="summary-metric">
            <span className="summary-label">High Flood Risk</span>
            <span className="summary-value text-rose-500 flex items-center gap-1">
              <ShieldAlert size={18} />
              {summaryCounts.high} Hotspot{summaryCounts.high !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="summary-metric">
            <span className="summary-label">Medium Watch</span>
            <span className="summary-value text-amber-500 flex items-center gap-1">
              <AlertTriangle size={18} />
              {summaryCounts.medium} Hotspot{summaryCounts.medium !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="summary-metric">
            <span className="summary-label">Normal / Low Risk</span>
            <span className="summary-value text-emerald-500 flex items-center gap-1">
              <ShieldCheck size={18} />
              {summaryCounts.low} Hotspot{summaryCounts.low !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="summary-metric">
            <span className="summary-label">Khadakwasla Dam Spillway</span>
            <span className="summary-value text-purple-600 flex items-center gap-1">
              <Waves size={18} />
              {weather.damDischargeCusecs.toLocaleString()} cusecs
            </span>
          </div>

          <div className="summary-metric">
            <span className="summary-label">Citizen Reports</span>
            <span className="summary-value text-sky-600 font-mono">
              {reports.length} Logged (Local)
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="content-container">
          {/* Simulation & Threshold Controls */}
          <SimulationControls
            weather={weather}
            thresholds={thresholds}
            onUpdateWeather={setWeather}
            onUpdateThresholds={setThresholds}
            onResetDefaults={() => setThresholds(DEFAULT_THRESHOLDS)}
          />

          {/* Interactive Map Section */}
          <section className="map-section">
            <PuneMapView
              hotspots={PUNE_HOTSPOTS}
              assessments={assessments}
              selectedHotspotId={selectedHotspotId}
              onSelectHotspot={setSelectedHotspotId}
            />
          </section>

          {/* Hotspots Detailed Risk Grid */}
          <section className="hotspots-section">
            <div className="section-header">
              <div>
                <h2 className="section-title">Critical Monsoon Hotspots</h2>
                <p className="section-subtitle">
                  Sinhagad Road, Ambil Odha, and Ekta Nagar terrain profiles with explainable algorithmic scoring
                </p>
                <p className="section-subtitle">
                  The same rainfall input is applied to all spots, so differences come from local factors like terrain, dam spillway and past incidents.
                </p>
              </div>
              <div className="hotspot-select-pills">
                {PUNE_HOTSPOTS.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    className={`hotspot-filter-pill ${selectedHotspotId === h.id ? 'active' : ''}`}
                    onClick={() => setSelectedHotspotId(h.id)}
                  >
                    <span>{h.name}</span>
                    <span className={`pill-dot ${assessments[h.id]?.level.toLowerCase()}`}></span>
                  </button>
                ))}
              </div>
            </div>

            <div className="hotspots-grid">
              {PUNE_HOTSPOTS.map((spot) => (
                <HotspotCard
                  key={spot.id}
                  hotspot={spot}
                  assessment={assessments[spot.id]}
                  weather={weather}
                  isSelected={selectedHotspotId === spot.id}
                  onSelect={() => setSelectedHotspotId(spot.id)}
                  onOpenReportModal={handleOpenReportModal}
                  onOpenAlertPreview={handleOpenAlertPreview}
                />
              ))}
            </div>
          </section>

          {/* Community Reports vs Verified Incidents Section */}
          <section className="community-section">
            <div className="section-header">
              <div>
                <h2 className="section-title">Field Intelligence & Historical Records</h2>
                <p className="section-subtitle">
                  Citizen reports are strictly demarcated from verified PMC disaster management incidents
                </p>
              </div>
            </div>

            <CommunityFeed
              reports={reports}
              hotspots={PUNE_HOTSPOTS}
              onOpenReportModal={() => handleOpenReportModal(selectedHotspotId)}
            />
          </section>
        </div>
      </main>

      {/* Footer with Project Credits & Disaster Contacts */}
      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-col">
            <div className="flex items-center gap-2">
              <Droplets size={20} className="text-sky-400" />
              <span className="font-bold text-slate-100">Pune Flood Watch</span>
            </div>
            <p className="footer-text mt-2">
              An explainable, community-centric waterlogging risk awareness prototype for Pune residents.
            </p>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Emergency Helplines</h4>
            <ul className="footer-links">
              <li>PMC Disaster Control: <strong className="text-rose-300">020-25501269</strong></li>
              <li>National Emergency: <strong className="text-rose-300">112</strong></li>
              <li>Fire Brigade: <strong className="text-rose-300">101</strong></li>
              <li>Traffic Police: <strong className="text-rose-300">020-26208225</strong></li>
            </ul>
          </div>

          <div className="footer-col">
            <button
              type="button"
              className="text-xs text-sky-400 hover:text-sky-300 underline flex items-center gap-1"
              onClick={() => setIsLimitationsOpen(true)}
            >
              <span>Limitations and data sources</span>
              <ExternalLink size={12} />
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-container">
            <span>© 2026 Pune Flood Watch</span>
            <span className="footer-disclaimer-note">
              Demonstration prototype with rule-based heuristics. Always adhere to official Pune Municipal Corporation advisories.
            </span>
          </div>
        </div>
      </footer>

      {/* Modals and Drawers */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        hotspots={PUNE_HOTSPOTS}
        initialHotspotId={modalTargetHotspotId}
        onSubmitReport={handleAddReport}
      />

      <AlertPreviewModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        hotspot={alertTargetHotspot}
        assessment={assessments[alertTargetHotspot.id]}
        weather={weather}
      />

      <LimitationsDrawer
        isOpen={isLimitationsOpen}
        onClose={() => setIsLimitationsOpen(false)}
      />
    </div>
  );
};

export default App;
