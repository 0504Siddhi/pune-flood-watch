import React, { useState } from 'react';
import type { WeatherSimulation, ThresholdConfig } from '../types';
import { Sliders, Sun, CloudRain, CloudLightning, RefreshCw, Settings2 } from 'lucide-react';

interface SimulationControlsProps {
  weather: WeatherSimulation;
  thresholds: ThresholdConfig;
  onUpdateWeather: (newWeather: WeatherSimulation) => void;
  onUpdateThresholds: (newThresholds: ThresholdConfig) => void;
  onResetDefaults: () => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  weather,
  thresholds,
  onUpdateWeather,
  onUpdateThresholds,
  onResetDefaults,
}) => {
  const [showThresholdModal, setShowThresholdModal] = useState(false);

  // Quick Preset Handlers
  const handlePreset = (preset: 'dry' | 'moderate' | 'heavy') => {
    if (preset === 'dry') {
      onUpdateWeather({
        intensityMmPerHour: 6,
        cumulative24hMm: 12,
        damDischargeCusecs: 0,
        simulationPreset: 'dry',
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } else if (preset === 'moderate') {
      onUpdateWeather({
        intensityMmPerHour: 22,
        cumulative24hMm: 52,
        damDischargeCusecs: 9500,
        simulationPreset: 'moderate',
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } else if (preset === 'heavy') {
      onUpdateWeather({
        intensityMmPerHour: 54,
        cumulative24hMm: 135,
        damDischargeCusecs: 34000,
        simulationPreset: 'heavy',
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }
  };

  const handleSliderChange = (field: keyof WeatherSimulation, value: number) => {
    onUpdateWeather({
      ...weather,
      [field]: value,
      simulationPreset: 'custom',
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  };

  return (
    <div className="simulation-panel">
      {/* Simulation Header */}
      <div className="sim-header">
        <div className="sim-title-group">
          <div className="sim-icon-badge">
            <Sliders size={18} />
          </div>
          <div>
            <h3 className="sim-title">Rule-based Risk Simulator & Weather Controls</h3>
            <p className="sim-subtitle">
              Adjust rainfall and Khadakwasla dam spillway inputs to recalculate hotspot risk in real-time.
            </p>
          </div>
        </div>
        <div className="sim-actions-group">
          <span className="sim-live-badge">
            <span className="sim-dot"></span> SIMULATED / MANUAL DATA
          </span>
          <button
            type="button"
            className="btn-threshold-toggle"
            onClick={() => setShowThresholdModal(!showThresholdModal)}
            title="Configure Risk Cutoffs and Weights"
          >
            <Settings2 size={15} />
            <span>Config Thresholds</span>
          </button>
        </div>
      </div>

      {/* Preset Quick Actions for Hackathon Evaluator */}
      <div className="presets-row">
        <span className="preset-label">Reproduce Scenario:</span>
        <div className="preset-buttons">
          <button
            type="button"
            className={`btn-preset preset-low ${weather.simulationPreset === 'dry' ? 'active' : ''}`}
            onClick={() => handlePreset('dry')}
          >
            <Sun size={15} />
            <span>Low Risk (Dry / 6mm/h)</span>
          </button>
          <button
            type="button"
            className={`btn-preset preset-medium ${weather.simulationPreset === 'moderate' ? 'active' : ''}`}
            onClick={() => handlePreset('moderate')}
          >
            <CloudRain size={15} />
            <span>Medium Risk (Monsoon / 22mm/h)</span>
          </button>
          <button
            type="button"
            className={`btn-preset preset-high ${weather.simulationPreset === 'heavy' ? 'active' : ''}`}
            onClick={() => handlePreset('heavy')}
          >
            <CloudLightning size={15} />
            <span>High Risk (Deluge + 34k cusecs)</span>
          </button>
        </div>
      </div>

      {/* Interactive Sliders */}
      <div className="sliders-grid">
        {/* Rainfall Intensity */}
        <div className="slider-card">
          <div className="slider-top">
            <label className="slider-label">Rainfall Rate (Intensity)</label>
            <span className="slider-val highlight-blue">{weather.intensityMmPerHour} mm/hr</span>
          </div>
          <input
            type="range"
            min={0}
            max={75}
            step={1}
            value={weather.intensityMmPerHour}
            onChange={(e) => handleSliderChange('intensityMmPerHour', Number(e.target.value))}
            className="styled-range blue"
          />
          <div className="slider-scale">
            <span>0 (None)</span>
            <span>25 (Moderate)</span>
            <span>50+ (Cloudburst)</span>
          </div>
        </div>

        {/* 24-Hour Cumulative */}
        <div className="slider-card">
          <div className="slider-top">
            <label className="slider-label">24h Cumulative Precipitation</label>
            <span className="slider-val highlight-cyan">{weather.cumulative24hMm} mm</span>
          </div>
          <input
            type="range"
            min={0}
            max={180}
            step={2}
            value={weather.cumulative24hMm}
            onChange={(e) => handleSliderChange('cumulative24hMm', Number(e.target.value))}
            className="styled-range cyan"
          />
          <div className="slider-scale">
            <span>0 mm</span>
            <span>60 mm</span>
            <span>150+ mm (Catchment Deluge)</span>
          </div>
        </div>

        {/* Khadakwasla Dam Spillway Discharge */}
        <div className="slider-card">
          <div className="slider-top">
            <label className="slider-label">Khadakwasla Dam Spillway</label>
            <span className="slider-val highlight-purple">
              {weather.damDischargeCusecs.toLocaleString()} cusecs
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={45000}
            step={1000}
            value={weather.damDischargeCusecs}
            onChange={(e) => handleSliderChange('damDischargeCusecs', Number(e.target.value))}
            className="styled-range purple"
          />
          <div className="slider-scale">
            <span>0 (Gates Closed)</span>
            <span>15,000</span>
            <span>35,000+ (Riverbed Warning)</span>
          </div>
        </div>
      </div>

      {/* Threshold Config Modal */}
      {showThresholdModal && (
        <div className="threshold-modal-backdrop" onClick={() => setShowThresholdModal(false)}>
          <div className="threshold-modal" onClick={(e) => e.stopPropagation()}>
            <div className="threshold-modal-header">
              <div className="flex items-center gap-2">
                <Settings2 size={18} className="text-sky-600" />
                <h4 className="font-bold text-slate-800">Rule-based Threshold Configuration</h4>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setShowThresholdModal(false)}
              >
                ✕
              </button>
            </div>

            <p className="threshold-modal-desc">
              Adjust classification cutoffs and scoring factor weights to test mathematical sensitivity.
            </p>

            <div className="threshold-controls-grid">
              <div className="threshold-field">
                <label>Low Risk Upper Bound (Score 0 to X):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={10}
                    max={50}
                    value={thresholds.lowCutoff}
                    onChange={(e) =>
                      onUpdateThresholds({
                        ...thresholds,
                        lowCutoff: Number(e.target.value),
                      })
                    }
                    className="threshold-number-input"
                  />
                  <span className="text-sm text-slate-500">Default: 35</span>
                </div>
              </div>

              <div className="threshold-field">
                <label>High Risk Trigger Threshold (Score X to 100):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={45}
                    max={85}
                    value={thresholds.highCutoff}
                    onChange={(e) =>
                      onUpdateThresholds({
                        ...thresholds,
                        highCutoff: Number(e.target.value),
                      })
                    }
                    className="threshold-number-input"
                  />
                  <span className="text-sm text-slate-500">Default: 65</span>
                </div>
              </div>

              <div className="threshold-field full-width">
                <label className="font-semibold text-slate-700">Scoring Weight Distribution</label>
                <div className="weight-display-grid">
                  <div className="weight-tag">Intensity: {Math.round(thresholds.weights.intensityWeight * 100)}%</div>
                  <div className="weight-tag">24h Rain: {Math.round(thresholds.weights.cumulativeWeight * 100)}%</div>
                  <div className="weight-tag">Terrain: {Math.round(thresholds.weights.terrainWeight * 100)}%</div>
                  <div className="weight-tag">Dam Spillway: {Math.round(thresholds.weights.damDischargeWeight * 100)}%</div>
                  <div className="weight-tag">History: {Math.round(thresholds.weights.historyWeight * 100)}%</div>
                </div>
              </div>
            </div>

            <div className="threshold-modal-footer">
              <button
                type="button"
                className="btn-reset"
                onClick={() => {
                  onResetDefaults();
                }}
              >
                <RefreshCw size={14} />
                <span>Reset System Defaults</span>
              </button>
              <button
                type="button"
                className="btn-apply"
                onClick={() => setShowThresholdModal(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
