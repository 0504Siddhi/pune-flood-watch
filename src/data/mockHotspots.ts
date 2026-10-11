import type { Hotspot, CommunityReport } from '../types';

export const PUNE_HOTSPOTS: Hotspot[] = [
  {
    id: 'sinhagad-rd',
    name: 'Sinhagad Road Corridor',
    marathiName: 'सिंहगड रस्ता परिसर',
    ward: 'Sinhagad Road / Warje Karvenagar Ward No. 34',
    coordinates: [18.4735, 73.8248],
    coordNote: 'Illustrative / Approximate Coordinates (Near Vitthalwadi & Rajaram Bridge)',
    lowLyingFactor: 0.82,
    historicalIncidentCount: 4,
    drainageCapacity: 'Low',
    waterwayProximity: 'Mutha River Basin & Right Bank Canal',
    summary: 'Major arterial corridor prone to backwater inundation when Khadakwasla dam releases exceed 30,000 cusecs.',
    vulnerabilityDetails:
      'The corridor runs parallel to the Mutha river with multiple low-level approach culverts. During peak catchment rains in the Western Ghats (Khadakwasla/Panshet/Varasgaon), spillway releases restrict gravity discharge of urban stormwater outfalls.',
    verifiedIncidents: [
      {
        year: 2024,
        monsoonDate: '25 July 2024',
        severity: 'Critical',
        description:
          'Khadakwasla Dam released over 35,000 cusecs into Mutha River following 24h catchment deluge. Water breached service roads near Vitthalwadi, inundated ground-floor societies, and forced traffic diversions along Rajaram Bridge.',
        pmcRecordId: 'PMC-DISASTER-LOG-2024-0725-SR',
        keyDrivers: ['Khadakwasla spillway release (35,000+ cusecs)', 'Backflow into roadside stormwater outfalls'],
      },
      {
        year: 2021,
        monsoonDate: '18 August 2021',
        severity: 'Moderate',
        description:
          'Prolonged continuous rainfall caused severe water pooling outside Pu La Deshpande Garden and Anand Nagar junction, stalling two-wheelers and buses.',
        pmcRecordId: 'PMC-DISASTER-LOG-2021-0818-SR',
        keyDrivers: ['Urban stormwater drain clogging', 'Surface runoff from elevated bypass'],
      },
      {
        year: 2019,
        monsoonDate: '26 September 2019',
        severity: 'Severe',
        description:
          'Backwater accumulation from swollen Mutha river submerged residential basements and caused prolonged power outages.',
        pmcRecordId: 'PMC-DISASTER-LOG-2019-0926-SR',
        keyDrivers: ['Simultaneous intense local shower + dam spillway opening'],
      },
    ],
  },
  {
    id: 'ambil-odha',
    name: 'Ambil Odha Stream Basin',
    marathiName: 'आंबील ओढा खोरे (सहकार नगर / पद्मावती)',
    ward: 'Dhankawadi - Sahakarnagar Ward No. 37',
    coordinates: [18.4965, 73.852],
    coordNote: 'Illustrative / Approximate Coordinates (Aranyeshwar / Tangewala Colony stretch)',
    lowLyingFactor: 0.88,
    historicalIncidentCount: 5,
    drainageCapacity: 'Low',
    waterwayProximity: 'Ambil Odha Natural Stormwater Nullah (Katraj to Parvati)',
    summary: 'High flash-flood vulnerability due to upstream Katraj catchment runoff and natural nullah bottlenecks.',
    vulnerabilityDetails:
      'Originating from Katraj hill slopes, Ambil Odha traverses heavily constructed urban settlements. Channel constrictions, culvert bottlenecks, and bridge piers create severe backwater surges during sudden cloudburst events.',
    verifiedIncidents: [
      {
        year: 2019,
        monsoonDate: '25 September 2019',
        severity: 'Critical',
        description:
          'Catastrophic flash flood occurred after 100+ mm cloudburst in upper Katraj catchment within 3 hours. Odha overflowed violently, collapsing compound walls in Tangewala Colony and Gururaj Society, causing extensive loss of property and vehicle washaway.',
        pmcRecordId: 'PMC-DISASTER-LOG-2019-0925-AO',
        keyDrivers: ['Sudden localized cloudburst (>100 mm in 3 hrs)', 'Culvert constriction & encroachment in natural stream'],
      },
      {
        year: 2023,
        monsoonDate: '22 July 2023',
        severity: 'Moderate',
        description:
          'Precautionary evacuation alert issued after stream water rose within 1.5 feet of embankment retaining wall near Aranyeshwar.',
        pmcRecordId: 'PMC-DISASTER-LOG-2023-0722-AO',
        keyDrivers: ['High stream velocity following continuous downpour in south Pune'],
      },
    ],
  },
  {
    id: 'ekta-nagar',
    name: 'Ekta Nagar Riverbed Settlement',
    marathiName: 'एकता नगर (आनंद नगर परिसर)',
    ward: 'Sinhagad Road / Hingne Khurd Ward No. 35',
    coordinates: [18.4812, 73.829],
    coordNote: 'Illustrative / Approximate Coordinates (Low-elevation riverfront housing cluster)',
    lowLyingFactor: 0.94,
    historicalIncidentCount: 4,
    drainageCapacity: 'Low',
    waterwayProximity: 'Direct Mutha River Floodplain (Immediate Left Bank)',
    summary: 'Extreme topographic depression directly adjacent to Mutha riverbed; first residential zone submerged during dam release.',
    vulnerabilityDetails:
      'Constructed in low-lying riverbed floodplain topography, Ekta Nagar sits topographically lower than the river high-flood line (HFL). Water ingress begins rapidly once river levels exceed standard bed capacity.',
    verifiedIncidents: [
      {
        year: 2024,
        monsoonDate: '25 July 2024',
        severity: 'Critical',
        description:
          'Water from Mutha River flooded Ekta Nagar lanes up to 4–5 feet. National Disaster Response Force (NDRF) and Pune Fire Brigade deployed rubber rescue boats to evacuate over 400 stranded residents from ground floors.',
        pmcRecordId: 'PMC-DISASTER-LOG-2024-0725-EN',
        keyDrivers: ['35,000+ cusecs discharge from Khadakwasla Dam', 'Settlement situated below river high-flood embankment line'],
      },
      {
        year: 2019,
        monsoonDate: '26 September 2019',
        severity: 'Severe',
        description:
          'Floodwaters entered ground floor homes and destroyed parked two-wheelers. Emergency shelters opened in nearby civic schools.',
        pmcRecordId: 'PMC-DISASTER-LOG-2019-0926-EN',
        keyDrivers: ['River overflow coinciding with intense monsoon runoff'],
      },
    ],
  },
];

export const INITIAL_COMMUNITY_REPORTS: CommunityReport[] = [
  {
    id: 'rep-001',
    hotspotId: 'sinhagad-rd',
    hotspotName: 'Sinhagad Road Corridor',
    waterDepth: 'Knee-deep (15 - 50 cm)',
    severityLevel: 'Medium',
    landmark: 'Opposite Pu La Deshpande Garden, near Bus Stop',
    description: 'Service road has knee-deep water accumulation. Vehicles moving at crawl; two-wheelers taking pedestrian walkway.',
    reportedAt: '15 mins ago',
    timeObserved: '19:45 IST',
    verifiedStatus: 'Unverified Citizen Observation',
  },
  {
    id: 'rep-002',
    hotspotId: 'ekta-nagar',
    hotspotName: 'Ekta Nagar Riverbed Settlement',
    waterDepth: 'Waist-deep (> 50 cm)',
    severityLevel: 'High',
    landmark: 'Lane No. 3, near community temple',
    description: 'Water has reached the entrance gates of residential buildings. Elderly citizens being shifted to first floor.',
    reportedAt: '35 mins ago',
    timeObserved: '19:25 IST',
    verifiedStatus: 'Unverified Citizen Observation',
  },
  {
    id: 'rep-003',
    hotspotId: 'ambil-odha',
    hotspotName: 'Ambil Odha Stream Basin',
    waterDepth: 'Ankle-deep (< 15 cm)',
    severityLevel: 'Low',
    landmark: 'Tangewala Colony culvert bridge',
    description: 'Nullah water level is elevated but currently contained within concrete retaining walls. Debris collecting at grate.',
    reportedAt: '1 hour ago',
    timeObserved: '18:50 IST',
    verifiedStatus: 'Unverified Citizen Observation',
  },
];
