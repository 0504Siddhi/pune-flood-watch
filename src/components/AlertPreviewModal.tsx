import React, { useState } from 'react';
import type { Hotspot, RiskAssessment, WeatherSimulation } from '../types';
import { X, BellRing, Smartphone, MessageSquare, AlertTriangle, ShieldAlert } from 'lucide-react';

interface AlertPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotspot: Hotspot | null;
  assessment: RiskAssessment | null;
  weather: WeatherSimulation;
}

export const AlertPreviewModal: React.FC<AlertPreviewModalProps> = ({
  isOpen,
  onClose,
  hotspot,
  assessment,
  weather,
}) => {
  const [activeChannel, setActiveChannel] = useState<'sms' | 'whatsapp' | 'push'>('sms');

  if (!isOpen || !hotspot || !assessment) return null;

  const marathiWarning = `पुणे पूर चेतावणी (सिम्युलेटेड): ${hotspot.marathiName} परिसरात अतिवृष्टी (${weather.intensityMmPerHour} mm/h) व खडकवासला विसर्ग (${weather.damDischargeCusecs.toLocaleString()} cusecs) मुळे पुराचा उच्च धोका. सखल भागातील नागरिकांनी सतर्क राहावे. आपत्कालीन संपर्क: PMC 020-25501269 / 112`;

  const englishWarning = `[PUNE FLOOD WATCH - SIMULATED ALERT] HIGH WATERLOGGING RISK for ${hotspot.name}. Compounding factors: ${weather.intensityMmPerHour} mm/hr rainfall intensity + ${weather.damDischargeCusecs.toLocaleString()} cusecs Khadakwasla spillway release. Ground floors and riverbank basements at risk of water ingress. Avoid travel through low culverts. Emergency Helpline: PMC Disaster Cell 020-25501269 / 112.`;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content alert-preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header bg-rose-50 border-b border-rose-100">
          <div className="flex items-center gap-2">
            <div className="modal-icon-badge bg-rose-500 text-white">
              <ShieldAlert size={18} />
            </div>
            <div>
              <h3 className="modal-title text-rose-900">Simulated Emergency Broadcast Preview</h3>
              <p className="modal-subtitle text-rose-700">High Flood Risk protocol for {hotspot.name}</p>
            </div>
          </div>
          <button type="button" className="btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Prominent Safety Notice */}
        <div className="alert-simulation-notice">
          <AlertTriangle size={18} className="text-amber-600 flex-shrink-0" />
          <div>
            <strong>SIMULATED PREVIEW ONLY:</strong> No actual SMS, email, or SNS push notifications are sent.
            This demonstrates the message payload that an integrated AWS SNS / Pinpoint service would dispatch when a hotspot triggers the High Risk threshold ({assessment.score}/100).
          </div>
        </div>

        {/* Channel Selector */}
        <div className="alert-channel-selector">
          <button
            type="button"
            className={`btn-channel ${activeChannel === 'sms' ? 'active' : ''}`}
            onClick={() => setActiveChannel('sms')}
          >
            <Smartphone size={16} />
            <span>Cellular Flash SMS</span>
          </button>
          <button
            type="button"
            className={`btn-channel ${activeChannel === 'whatsapp' ? 'active' : ''}`}
            onClick={() => setActiveChannel('whatsapp')}
          >
            <MessageSquare size={16} />
            <span>Citizen WhatsApp Alert</span>
          </button>
          <button
            type="button"
            className={`btn-channel ${activeChannel === 'push' ? 'active' : ''}`}
            onClick={() => setActiveChannel('push')}
          >
            <BellRing size={16} />
            <span>Mobile Push Notification</span>
          </button>
        </div>

        {/* Alert Preview Mockup Phone View */}
        <div className="mockup-phone-frame">
          <div className="mockup-header-bar">
            <span>9:41</span>
            <span className="font-semibold text-xs">PUNE-DISASTER-CELL (SIMULATED)</span>
            <span>4G 100%</span>
          </div>

          <div className="mockup-bubble-container">
            {activeChannel === 'sms' && (
              <div className="sms-bubble">
                <div className="bubble-sender">FROM: GOV-PMCFWD</div>
                <div className="bubble-body font-mono text-xs text-slate-800">
                  {englishWarning}
                </div>
                <div className="bubble-footer text-right text-[10px] text-slate-400 mt-2">
                  Delivered • Flash Priority 1
                </div>
              </div>
            )}

            {activeChannel === 'whatsapp' && (
              <div className="whatsapp-bubble">
                <div className="wa-header">
                  <span className="font-bold text-emerald-800">🚨 Pune Municipal Flood Watch (Official Bot)</span>
                </div>
                <div className="wa-body text-xs text-slate-800 mt-1 whitespace-pre-line">
                  {englishWarning}
                  {'\n\n'}
                  <strong>मराठी संदेश:</strong>
                  {'\n'}
                  {marathiWarning}
                </div>
                <div className="wa-actions mt-3 flex gap-2">
                  <button type="button" className="wa-action-btn">📞 Call PMC Helpline (020-25501269)</button>
                  <button type="button" className="wa-action-btn">📍 View Evacuation Shelters</button>
                </div>
              </div>
            )}

            {activeChannel === 'push' && (
              <div className="push-notification-banner">
                <div className="push-top flex items-center justify-between text-xs text-rose-700 font-bold">
                  <span className="flex items-center gap-1">
                    <ShieldAlert size={14} /> PUNE FLOOD WATCH • CRITICAL ALERT
                  </span>
                  <span className="text-slate-400 font-normal">Now</span>
                </div>
                <div className="push-headline font-bold text-slate-900 text-sm mt-1">
                  High Risk Active: {hotspot.name}
                </div>
                <div className="push-text text-xs text-slate-600 mt-1">
                  Score {assessment.score}/100. Backwater waterlogging predicted due to {weather.intensityMmPerHour} mm/h rain & Khadakwasla discharge. Exercise extreme caution.
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer justify-between">
          <span className="text-xs text-slate-400">AWS SNS / SES integration endpoint ready</span>
          <button type="button" className="btn-cancel" onClick={onClose}>
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
