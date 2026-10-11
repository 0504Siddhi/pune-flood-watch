import React, { useState } from 'react';
import type { CommunityReport, Hotspot } from '../types';
import { MessageSquare, ShieldCheck, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface CommunityFeedProps {
  reports: CommunityReport[];
  hotspots: Hotspot[];
  onOpenReportModal: () => void;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({
  reports,
  hotspots,
  onOpenReportModal,
}) => {
  const [activeTab, setActiveTab] = useState<'citizen' | 'verified'>('citizen');

  // Collect all verified incidents across all hotspots
  const allVerifiedIncidents = hotspots.flatMap((spot) =>
    spot.verifiedIncidents.map((incident) => ({
      ...incident,
      hotspotName: spot.name,
      marathiName: spot.marathiName,
    }))
  );

  return (
    <div className="community-feed-container">
      {/* Feed Tabs */}
      <div className="feed-header-tabs">
        <div className="flex gap-2">
          <button
            type="button"
            className={`feed-tab-btn ${activeTab === 'citizen' ? 'active' : ''}`}
            onClick={() => setActiveTab('citizen')}
          >
            <MessageSquare size={16} />
            <span>Citizen Observations ({reports.length})</span>
            <span className="unverified-tag">Unverified</span>
          </button>
          <button
            type="button"
            className={`feed-tab-btn ${activeTab === 'verified' ? 'active' : ''}`}
            onClick={() => setActiveTab('verified')}
          >
            <ShieldCheck size={16} />
            <span>Past flooding reported in news (sample list) ({allVerifiedIncidents.length})</span>
            <span className="verified-tag">Sample data</span>
          </button>
        </div>

        <button
          type="button"
          className="btn-new-report"
          onClick={onOpenReportModal}
        >
          + Report Local Waterlogging
        </button>
      </div>

      {/* Critical Scientific Disclaimer Banner (Requirement 7 & 9) */}
      <div className="feed-methodology-banner">
        <AlertTriangle size={15} className="text-amber-500 flex-shrink-0" />
        <span>
          <strong>Methodology Separation Notice:</strong> Citizen reports are crowd-sourced and unverified by PMC disaster management.
          Unverified citizen reports are shown for awareness only and do not change the risk score.
        </span>
      </div>

      {/* Content Area */}
      {activeTab === 'citizen' ? (
        <div className="reports-list">
          <div className="text-xs text-slate-500">Sample reports for demonstration. Not real incidents.</div>
          {reports.length === 0 ? (
            <div className="empty-feed">No community reports submitted yet. Be the first to share an observation.</div>
          ) : (
            reports.map((report) => (
              <div key={report.id} className="citizen-report-card">
                <div className="report-card-top">
                  <div className="report-location-badge">
                    <span className="font-semibold text-slate-800">{report.hotspotName}</span>
                    <span className="report-landmark text-slate-500">📍 {report.landmark}</span>
                  </div>
                  <div className="report-meta">
                    <span className="unverified-badge">{report.verifiedStatus}</span>
                    <span className="report-time flex items-center gap-1 text-xs text-slate-400">
                      <Clock size={12} />
                      {report.reportedAt} {report.timeObserved ? `(${report.timeObserved})` : ''}
                    </span>
                  </div>
                </div>

                <p className="report-desc">{report.description}</p>

                <div className="report-card-bottom">
                  <span className={`depth-badge depth-${report.severityLevel.toLowerCase()}`}>
                    Depth: {report.waterDepth}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">ID: #{report.id}</span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="verified-incidents-list">
          {allVerifiedIncidents.map((incident, idx) => (
            <div key={idx} className="verified-incident-card">
              <div className="verified-card-top">
                <div className="verified-location-title">
                  <h4 className="font-bold text-slate-900">{incident.hotspotName}</h4>
                  <span className="text-xs text-slate-500">{incident.marathiName}</span>
                </div>
                <div className="verified-badge-pill">
                  <CheckCircle size={14} className="text-emerald-600" />
                  <span>Verified PMC Disaster Log ({incident.year})</span>
                </div>
              </div>

              <div className="verified-date-row">
                <span className="font-semibold text-slate-700">Date: {incident.monsoonDate}</span>
                <span className="log-code font-mono text-xs">{incident.pmcRecordId}</span>
              </div>

              <p className="verified-desc">{incident.description}</p>

              <div className="drivers-row">
                <span className="drivers-label">Documented Root Causes:</span>
                <div className="drivers-tags">
                  {incident.keyDrivers.map((driver, dIdx) => (
                    <span key={dIdx} className="driver-tag">
                      {driver}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
