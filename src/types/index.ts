export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface VerifiedIncident {
  year: number;
  monsoonDate: string;
  description: string;
  severity: 'Severe' | 'Critical' | 'Moderate';
  pmcRecordId: string;
  keyDrivers: string[];
}

export interface Hotspot {
  id: string;
  name: string;
  marathiName: string;
  ward: string;
  coordinates: [number, number]; // [lat, lng]
  coordNote: string;
  lowLyingFactor: number; // 0.0 to 1.0 (terrain vulnerability)
  historicalIncidentCount: number; // weight of past flooding
  drainageCapacity: 'Low' | 'Moderate' | 'Fair';
  waterwayProximity: string;
  summary: string;
  vulnerabilityDetails: string;
  verifiedIncidents: VerifiedIncident[];
}

export interface WeatherSimulation {
  intensityMmPerHour: number; // current rainfall rate mm/h
  cumulative24hMm: number;    // past 24 hours rainfall mm
  damDischargeCusecs: number; // Khadakwasla dam spillway release
  simulationPreset: 'dry' | 'moderate' | 'heavy' | 'custom';
  lastUpdated: string;
}

export interface ScoringWeights {
  intensityWeight: number; // default 0.35
  cumulativeWeight: number;// default 0.25
  terrainWeight: number;   // default 0.20
  damDischargeWeight: number; // default 0.10
  historyWeight: number;   // default 0.10
}

export interface ThresholdConfig {
  lowCutoff: number;       // default 35
  highCutoff: number;      // default 65
  maxIntensityRef: number; // default 50 mm/h
  maxCumulativeRef: number;// default 120 mm
  maxDamDischargeRef: number; // default 35000 cusecs
  maxHistoryRef: number;   // default 5 incidents
  weights: ScoringWeights;
}

export interface FactorBreakdown {
  intensityScore: number;
  cumulativeScore: number;
  terrainScore: number;
  damDischargeScore: number;
  historyScore: number;
}

export interface RiskAssessment {
  hotspotId: string;
  score: number; // 0 to 100
  level: RiskLevel;
  factorBreakdown: FactorBreakdown;
  explanation: string;
  keyConcerns: string[];
  recommendedPrecautions: string[];
  calculatedAt: string;
}

export interface CommunityReport {
  id: string;
  hotspotId: string;
  hotspotName: string;
  waterDepth: 'Ankle-deep (< 15 cm)' | 'Knee-deep (15 - 50 cm)' | 'Waist-deep (> 50 cm)' | 'Submerged / Impassable';
  severityLevel: 'Low' | 'Medium' | 'High';
  landmark: string;
  description: string;
  reportedAt: string;
  timeObserved?: string;
  verifiedStatus: 'Unverified Citizen Observation';
}
