import React from 'react';
import { X, ShieldAlert, PhoneCall, Database, AlertCircle, Cpu } from 'lucide-react';

interface LimitationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LimitationsDrawer: React.FC<LimitationsDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content limitations-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <div className="modal-icon-badge bg-amber-100 text-amber-700">
              <ShieldAlert size={18} />
            </div>
            <div>
              <h3 className="modal-title">System Transparency & Data Limitations</h3>
              <p className="modal-subtitle">Hackathon MVP Disclosure for Environmental Hacks (WeMakeDevs)</p>
            </div>
          </div>
          <button type="button" className="btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="limitations-body">
          {/* Section 1: Non-Emergency Disclaimer */}
          <div className="transparency-card bg-amber-50 border-amber-200">
            <div className="flex items-start gap-2">
              <AlertCircle size={20} className="text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-900 text-sm">Not an Official Emergency Dispatch System</h4>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  Pune Flood Watch is a community prototype and technology demonstration. It does <strong>NOT</strong> have official municipal authority, certified flood-forecasting certification, or direct integration with Indian Meteorological Department (IMD) doppler radars. Never base life-safety decisions solely on this application.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Pune Emergency Helplines */}
          <div className="transparency-card">
            <div className="flex items-center gap-2 mb-2 text-slate-800 font-bold text-sm">
              <PhoneCall size={16} className="text-sky-600" />
              <span>Official Pune Municipal & Emergency Helplines</span>
            </div>
            <div className="emergency-numbers-grid">
              <div className="emergency-item">
                <span className="emergency-label">PMC Disaster Management Cell:</span>
                <span className="emergency-val font-mono font-bold text-rose-700">020-25501269 / 020-25506800</span>
              </div>
              <div className="emergency-item">
                <span className="emergency-label">All-India Emergency Response:</span>
                <span className="emergency-val font-mono font-bold text-rose-700">112</span>
              </div>
              <div className="emergency-item">
                <span className="emergency-label">Pune Fire Brigade Control:</span>
                <span className="emergency-val font-mono font-bold text-rose-700">101 / 020-26451707</span>
              </div>
              <div className="emergency-item">
                <span className="emergency-label">Pune Traffic Police Helpline:</span>
                <span className="emergency-val font-mono font-bold text-rose-700">020-26208225</span>
              </div>
            </div>
          </div>

          {/* Section 3: Data Sources & Assumptions */}
          <div className="transparency-card">
            <div className="flex items-center gap-2 mb-2 text-slate-800 font-bold text-sm">
              <Database size={16} className="text-indigo-600" />
              <span>Telemetry Sources & Simulation Baseline</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li>
                <strong>Current Rainfall & Dam Discharge:</strong> Locally simulated demo inputs controllable via the top slider controls. No live telemetry API is claimed or fabricated.
              </li>
              <li>
                <strong>Hotspot Geospatial Coordinates:</strong> Illustrative approximate coordinates for Sinhagad Road, Ambil Odha, and Ekta Nagar based on verified historical news reports (2019 flash flood & July 2024 Khadakwasla spillway inundation).
              </li>
              <li>
                <strong>Community Reports:</strong> Stored locally in browser LocalStorage. Crowdsourced reports are distinctly marked as <em>Unverified Citizen Observations</em> and do not skew model weights.
              </li>
            </ul>
          </div>

          {/* Section 4: AWS Cloud Integration Architecture */}
          <div className="transparency-card">
            <div className="flex items-center gap-2 mb-2 text-slate-800 font-bold text-sm">
              <Cpu size={16} className="text-emerald-600" />
              <span>AWS Cloud Production Architecture (Phase 2 Roadmap)</span>
            </div>
            <div className="text-xs text-slate-600 leading-relaxed space-y-1">
              <p>The frontend is fully statically compiled (<code className="bg-slate-100 px-1 py-0.5 rounded">npm run build</code>) for instant hosting on <strong>Amazon S3 + CloudFront CDN</strong>.</p>
              <p className="mt-1">For Phase 2 production integration, the code structure separates logic for:</p>
              <div className="bg-slate-50 p-2 rounded border border-slate-200 mt-2 font-mono text-[11px] text-slate-700">
                • <strong>AWS Lambda + API Gateway:</strong> Validates & ingests citizen reports.<br/>
                • <strong>Amazon DynamoDB:</strong> Stores verified reports with geospatial indexes.<br/>
                • <strong>Amazon SNS / SES:</strong> Broadcasts regional emergency notifications.<br/>
                • <strong>AWS IoT Core:</strong> Ingests water-level sensor telemetry along Ambil Odha culverts.
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-done w-full" onClick={onClose}>
            I Understand the Limitations
          </button>
        </div>
      </div>
    </div>
  );
};
