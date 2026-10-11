import { describe, it, expect } from 'vitest';
import { calculateHotspotRisk, DEFAULT_THRESHOLDS } from './riskEngine';
import type { Hotspot, WeatherSimulation, ThresholdConfig } from '../types';

const mockHotspot: Hotspot = {
  id: 'sinhagad-rd',
  name: 'Sinhagad Road',
  marathiName: 'सिंहगड रस्ता',
  ward: 'Warje-Karvenagar / Sinhagad Road Ward',
  coordinates: [18.4735, 73.8248],
  coordNote: 'Approximate / Illustrative Hotspot Coordinates',
  lowLyingFactor: 0.85,
  historicalIncidentCount: 4,
  drainageCapacity: 'Low',
  waterwayProximity: 'Mutha River & Mutha Right Bank Canal',
  summary: 'Notorious bottleneck along Mutha river channel',
  vulnerabilityDetails: 'Riverine backflow during Khadakwasla dam discharge',
  verifiedIncidents: [],
};

describe('Pune Flood Watch - Deterministic Risk Engine', () => {
  it('should compute Low risk under light dry monsoon baseline', () => {
    const dryWeather: WeatherSimulation = {
      intensityMmPerHour: 5,
      cumulative24hMm: 10,
      damDischargeCusecs: 0,
      simulationPreset: 'dry',
      lastUpdated: '10:00 AM',
    };

    const result = calculateHotspotRisk(mockHotspot, dryWeather);

    expect(result.level).toBe('Low');
    expect(result.score).toBeLessThan(DEFAULT_THRESHOLDS.lowCutoff);
    expect(result.explanation).toContain('Normal baseline');
    expect(result.factorBreakdown.intensityScore).toBeGreaterThanOrEqual(0);
  });

  it('should compute Medium risk during moderate showers', () => {
    const moderateWeather: WeatherSimulation = {
      intensityMmPerHour: 22,
      cumulative24hMm: 50,
      damDischargeCusecs: 10000,
      simulationPreset: 'moderate',
      lastUpdated: '10:00 AM',
    };

    const result = calculateHotspotRisk(mockHotspot, moderateWeather);

    expect(result.level).toBe('Medium');
    expect(result.score).toBeGreaterThanOrEqual(DEFAULT_THRESHOLDS.lowCutoff);
    expect(result.score).toBeLessThan(DEFAULT_THRESHOLDS.highCutoff);
    expect(result.explanation).toContain('Elevated watch');
  });

  it('should compute High risk under heavy cloudburst and dam spillway release', () => {
    const stormWeather: WeatherSimulation = {
      intensityMmPerHour: 55,
      cumulative24hMm: 135,
      damDischargeCusecs: 36000,
      simulationPreset: 'heavy',
      lastUpdated: '10:00 AM',
    };

    const result = calculateHotspotRisk(mockHotspot, stormWeather);

    expect(result.level).toBe('High');
    expect(result.score).toBeGreaterThanOrEqual(DEFAULT_THRESHOLDS.highCutoff);
    expect(result.explanation).toContain('High risk');
    expect(result.keyConcerns.length).toBeGreaterThan(0);
    expect(result.recommendedPrecautions.length).toBeGreaterThan(0);
  });

  it('should recalculate classification dynamically when custom thresholds are provided', () => {
    const weather: WeatherSimulation = {
      intensityMmPerHour: 20,
      cumulative24hMm: 45,
      damDischargeCusecs: 5000,
      simulationPreset: 'custom',
      lastUpdated: '10:00 AM',
    };

    // Standard thresholds gives Medium (approx 40-50 score)
    const standardResult = calculateHotspotRisk(mockHotspot, weather);

    // If we tighten thresholds so highCutoff is 40
    const sensitiveConfig: ThresholdConfig = {
      ...DEFAULT_THRESHOLDS,
      lowCutoff: 20,
      highCutoff: 40,
    };

    const sensitiveResult = calculateHotspotRisk(mockHotspot, weather, sensitiveConfig);
    expect(sensitiveResult.level).toBe('High');
    expect(sensitiveResult.score).toBe(standardResult.score); // Same deterministic score, different cutoff
  });

  it('should provide explainable breakdown whose parts correlate with score', () => {
    const weather: WeatherSimulation = {
      intensityMmPerHour: 30,
      cumulative24hMm: 60,
      damDischargeCusecs: 15000,
      simulationPreset: 'moderate',
      lastUpdated: '10:00 AM',
    };

    const result = calculateHotspotRisk(mockHotspot, weather);
    const sumOfFactors =
      result.factorBreakdown.intensityScore +
      result.factorBreakdown.cumulativeScore +
      result.factorBreakdown.terrainScore +
      result.factorBreakdown.damDischargeScore +
      result.factorBreakdown.historyScore;

    // Sum of factors should equal score within rounding tolerance
    expect(Math.abs(sumOfFactors - result.score)).toBeLessThanOrEqual(1.5);
  });
});
