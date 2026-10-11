import type { Hotspot, WeatherSimulation, ThresholdConfig, RiskAssessment, RiskLevel, FactorBreakdown } from '../types';

export const DEFAULT_THRESHOLDS: ThresholdConfig = {
  lowCutoff: 35,
  highCutoff: 65,
  maxIntensityRef: 50,      // 50 mm/h constitutes intense cloudburst/monsoon deluge in Pune
  maxCumulativeRef: 120,    // 120 mm saturated catchment ground
  maxDamDischargeRef: 35000,// 35,000 cusecs Khadakwasla spillway triggers Mutha riverbank alerts
  maxHistoryRef: 5,         // Baseline reference count of major historical inundations
  weights: {
    intensityWeight: 0.35,
    cumulativeWeight: 0.25,
    terrainWeight: 0.20,
    damDischargeWeight: 0.10,
    historyWeight: 0.10,
  },
};

/**
 * Calculates a deterministic, explainable risk score (0 to 100)
 * for a specific hotspot given weather conditions and threshold configuration.
 */
export function calculateHotspotRisk(
  hotspot: Hotspot,
  weather: WeatherSimulation,
  thresholds: ThresholdConfig = DEFAULT_THRESHOLDS
): RiskAssessment {
  const { weights } = thresholds;

  // 1. Rainfall Intensity Component (0 - 100)
  const normalizedIntensity = Math.min(100, (weather.intensityMmPerHour / thresholds.maxIntensityRef) * 100);
  const intensityScore = normalizedIntensity * weights.intensityWeight;

  // 2. Cumulative 24h Rain Component (0 - 100)
  const normalizedCumulative = Math.min(100, (weather.cumulative24hMm / thresholds.maxCumulativeRef) * 100);
  const cumulativeScore = normalizedCumulative * weights.cumulativeWeight;

  // 3. Low-lying terrain & elevation vulnerability (0 - 100)
  const normalizedTerrain = Math.min(100, hotspot.lowLyingFactor * 100);
  const terrainScore = normalizedTerrain * weights.terrainWeight;

  // 4. Dam discharge factor (0 - 100)
  // Riverbed hotspots (like Ekta Nagar and Sinhagad Road) are disproportionately affected by Mutha River release
  const isDirectRiverine = hotspot.waterwayProximity.toLowerCase().includes('mutha');
  const damMultiplier = isDirectRiverine ? 1.0 : 0.4;
  const normalizedDam = Math.min(100, (weather.damDischargeCusecs / thresholds.maxDamDischargeRef) * 100) * damMultiplier;
  const damDischargeScore = normalizedDam * weights.damDischargeWeight;

  // 5. Historical Incident frequency (0 - 100)
  const normalizedHistory = Math.min(100, (hotspot.historicalIncidentCount / thresholds.maxHistoryRef) * 100);
  const historyScore = normalizedHistory * weights.historyWeight;

  // Composite raw score capped at 0 - 100
  const rawScore = intensityScore + cumulativeScore + terrainScore + damDischargeScore + historyScore;
  const score = Math.min(100, Math.max(0, Math.round(rawScore)));

  // Risk Classification
  let level: RiskLevel = 'Low';
  if (score >= thresholds.highCutoff) {
    level = 'High';
  } else if (score >= thresholds.lowCutoff) {
    level = 'Medium';
  }

  // Factor breakdown for transparent inspection
  const factorBreakdown: FactorBreakdown = {
    intensityScore: Math.round(intensityScore * 10) / 10,
    cumulativeScore: Math.round(cumulativeScore * 10) / 10,
    terrainScore: Math.round(terrainScore * 10) / 10,
    damDischargeScore: Math.round(damDischargeScore * 10) / 10,
    historyScore: Math.round(historyScore * 10) / 10,
  };

  // Human-readable, explainable rationale
  const { explanation, keyConcerns, recommendedPrecautions } = generateExplanation(
    hotspot,
    weather,
    score,
    level,
    factorBreakdown
  );

  return {
    hotspotId: hotspot.id,
    score,
    level,
    factorBreakdown,
    explanation,
    keyConcerns,
    recommendedPrecautions,
    calculatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

function generateExplanation(
  hotspot: Hotspot,
  weather: WeatherSimulation,
  score: number,
  level: RiskLevel,
  _breakdown: FactorBreakdown
): { explanation: string; keyConcerns: string[]; recommendedPrecautions: string[] } {
  const concerns: string[] = [];
  const precautions: string[] = [];

  if (weather.intensityMmPerHour >= 30) {
    concerns.push(`Intense precipitation rate (${weather.intensityMmPerHour} mm/hr) overwhelms stormwater drains.`);
  } else if (weather.intensityMmPerHour >= 15) {
    concerns.push(`Moderate rainfall intensity (${weather.intensityMmPerHour} mm/hr) creating localized surface pooling.`);
  }

  if (weather.cumulative24hMm >= 75) {
    concerns.push(`High 24h soil saturation (${weather.cumulative24hMm} mm) prevents natural percolation.`);
  }

  if (weather.damDischargeCusecs >= 20000 && hotspot.waterwayProximity.toLowerCase().includes('mutha')) {
    concerns.push(`Significant Khadakwasla dam spillway release (${weather.damDischargeCusecs.toLocaleString()} cusecs) raises Mutha water levels.`);
  }

  if (hotspot.lowLyingFactor >= 0.75) {
    concerns.push(`Topographic depression (${Math.round(hotspot.lowLyingFactor * 100)}% vulnerability) creates backwater retention.`);
  }

  let explanation = '';

  if (level === 'High') {
    explanation = `High risk (Score: ${score}/100) triggered by compounding factors: ${weather.intensityMmPerHour} mm/h rain intensity combined with ${hotspot.name}'s low-lying terrain and limited drainage capacity. High probability of road inundation and basement water ingress.`;
    precautions.push('Avoid travel via waterlogged underpasses and low-lying arterial corridors.');
    precautions.push('Move vehicles and ground-floor valuables to elevated parking areas.');
    precautions.push('Keep emergency battery backups ready and monitor PMC disaster cell announcements.');
  } else if (level === 'Medium') {
    explanation = `Elevated watch (Score: ${score}/100) active: Moderate rainfall (${weather.intensityMmPerHour} mm/h) combined with past 24h accumulation (${weather.cumulative24hMm} mm) may cause localized curb overflow and slow-moving traffic along ${hotspot.name}.`;
    precautions.push('Exercise caution during peak travel hours; expect localized waterlogging.');
    precautions.push('Report blocked stormwater catchpits to municipal ward helpline.');
  } else {
    explanation = `Normal baseline (Score: ${score}/100): Current rainfall inputs (${weather.intensityMmPerHour} mm/h) and discharge levels remain well within the natural drainage threshold for ${hotspot.name}.`;
    precautions.push('No active alerts. Follow routine monsoon travel guidance.');
  }

  if (concerns.length === 0) {
    concerns.push('Rainfall and dam discharge metrics are within normal seasonal range.');
  }

  return { explanation, keyConcerns: concerns, recommendedPrecautions: precautions };
}
