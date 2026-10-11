import React, { useState } from 'react';
import type { Hotspot, CommunityReport } from '../types';
import { X, Send, CheckCircle2, AlertCircle, Info, MapPin } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotspots: Hotspot[];
  initialHotspotId?: string;
  onSubmitReport: (report: CommunityReport) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  hotspots,
  initialHotspotId,
  onSubmitReport,
}) => {
  const [hotspotId, setHotspotId] = useState(initialHotspotId || hotspots[0]?.id || '');
  const [waterDepth, setWaterDepth] = useState<CommunityReport['waterDepth']>('Knee-deep (15 - 50 cm)');
  const [landmark, setLandmark] = useState('');
  const [description, setDescription] = useState('');
  const [timeObserved, setTimeObserved] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedId, setSubmittedId] = useState('');

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!hotspotId) {
      newErrors.hotspotId = 'Please select a hotspot location.';
    }
    if (!landmark.trim()) {
      newErrors.landmark = 'Please specify the exact lane, junction, or landmark.';
    } else if (landmark.trim().length < 3) {
      newErrors.landmark = 'Landmark description must be at least 3 characters.';
    }
    if (!description.trim()) {
      newErrors.description = 'Please describe the observed waterlogging condition.';
    } else if (description.trim().length < 8) {
      newErrors.description = 'Description must be at least 8 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedSpot = hotspots.find((h) => h.id === hotspotId);
    const newId = `rep-${Date.now().toString().slice(-4)}`;

    let severityLevel: 'Low' | 'Medium' | 'High' = 'Medium';
    if (waterDepth.includes('Ankle')) severityLevel = 'Low';
    if (waterDepth.includes('Waist') || waterDepth.includes('Submerged')) severityLevel = 'High';

    const newReport: CommunityReport = {
      id: newId,
      hotspotId,
      hotspotName: selectedSpot ? selectedSpot.name : 'Pune Hotspot',
      waterDepth,
      severityLevel,
      landmark: landmark.trim(),
      description: description.trim(),
      reportedAt: 'Just now',
      timeObserved: timeObserved.trim() || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      verifiedStatus: 'Unverified Citizen Observation',
    };

    onSubmitReport(newReport);
    setSubmittedId(newId);
    setIsSuccess(true);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setLandmark('');
    setDescription('');
    setTimeObserved('');
    setErrors({});
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <div className="modal-icon-badge">
              <MapPin size={18} />
            </div>
            <div>
              <h3 className="modal-title">Report Local Waterlogging</h3>
              <p className="modal-subtitle">Tell us what you see to help other Pune residents</p>
            </div>
          </div>
          <button type="button" className="btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {isSuccess ? (
          <div className="modal-success-state">
            <CheckCircle2 size={54} className="text-emerald-500 animate-bounce" />
            <h4 className="success-heading">Observation Recorded Locally!</h4>
            <p className="success-message">
              Report <strong>#{submittedId}</strong> has been saved and displayed in the Community Feed.
            </p>
            <div className="success-notice-box">
              <Info size={16} className="text-sky-600 flex-shrink-0" />
              <span>
                Note: In accordance with scientific safety protocols, citizen submissions are labeled as{' '}
                <strong>Unverified Citizen Observations</strong> and do not automatically alter algorithmic flood model thresholds.
              </span>
            </div>
            <button type="button" className="btn-done" onClick={handleReset}>
              Close & View in Feed
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="report-form">
            <div className="form-info-banner">
              <AlertCircle size={15} className="text-amber-600 flex-shrink-0" />
              <span>
                For active life-safety emergencies, call Pune Municipal Corporation (PMC) Disaster Cell directly at{' '}
                <strong>020-25501269</strong> or <strong>112</strong>.
              </span>
            </div>

            {/* Hotspot Selection */}
            <div className="form-group">
              <label htmlFor="hotspot-select">Select Hotspot Area *</label>
              <select
                id="hotspot-select"
                value={hotspotId}
                onChange={(e) => setHotspotId(e.target.value)}
                className={`form-input ${errors.hotspotId ? 'input-error' : ''}`}
              >
                {hotspots.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.marathiName})
                  </option>
                ))}
              </select>
              {errors.hotspotId && <span className="error-text">{errors.hotspotId}</span>}
            </div>

            {/* Severity / Water Depth */}
            <div className="form-group">
              <label htmlFor="water-depth-select">Observed Water Accumulation Level *</label>
              <select
                id="water-depth-select"
                value={waterDepth}
                onChange={(e) => setWaterDepth(e.target.value as CommunityReport['waterDepth'])}
                className="form-input"
              >
                <option value="Ankle-deep (< 15 cm)">Ankle-deep (&lt; 15 cm) - Minor ponding, passable</option>
                <option value="Knee-deep (15 - 50 cm)">Knee-deep (15 - 50 cm) - Difficult for two-wheelers</option>
                <option value="Waist-deep (> 50 cm)">Waist-deep (&gt; 50 cm) - Impassable, residential ingress</option>
                <option value="Submerged / Impassable">Submerged / Impassable - Dangerous current / closed road</option>
              </select>
            </div>

            {/* Landmark */}
            <div className="form-group">
              <label htmlFor="landmark-input">Specific Landmark / Cross Street *</label>
              <input
                id="landmark-input"
                type="text"
                placeholder="e.g. Near Pu La Deshpande Garden or Tangewala Colony bridge"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className={`form-input ${errors.landmark ? 'input-error' : ''}`}
              />
              {errors.landmark && <span className="error-text">{errors.landmark}</span>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="desc-input">Ground Conditions & Flow Observation *</label>
              <textarea
                id="desc-input"
                rows={3}
                placeholder="Describe current status: e.g. Drains backflowing, water entering compound, traffic stuck..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`form-input ${errors.description ? 'input-error' : ''}`}
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            {/* Optional Time */}
            <div className="form-group">
              <label htmlFor="time-input">Time of Observation (Optional)</label>
              <input
                id="time-input"
                type="text"
                placeholder="e.g. 20:15 IST or 10 mins ago"
                value={timeObserved}
                onChange={(e) => setTimeObserved(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="text-xs text-slate-500">
                For this demo, reports are saved only in your browser.
              </span>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" className="btn-cancel" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  <Send size={15} />
                  <span>Submit Citizen Report</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
