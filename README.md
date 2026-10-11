# Pune Flood Watch (पुणे पूr वॉच)
**Hyperlocal Monsoon Waterlogging & Flood Risk Intelligence MVP**  
*Built for Environmental Hacks by WeMakeDevs*

---

## 1. Problem Statement & Context
During Pune's monsoon season, intense cloudbursts in the Western Ghats and urban catchments frequently cause severe waterlogging and flash inundation across vulnerable bottlenecks:
1. **Sinhagad Road Corridor:** Backwater stagnation when Khadakwasla Dam spillway discharges exceed 30,000 cusecs into the Mutha River.
2. **Ambil Odha Stream Basin:** Historic natural stormwater channel prone to violent flash flooding (such as the catastrophic September 2019 cloudburst in Katraj/Sahakar Nagar).
3. **Ekta Nagar Riverbed Cluster:** Low-elevation residential settlement situated directly on the Mutha river floodplain below the high flood line.

Residents and responders need:
- **Hotspot-level risk intelligence** instead of city-wide generalized forecasts.
- **Explainable, deterministic calculations** explaining *why* a particular area is at risk.
- **Crowdsourced citizen reporting** with clear methodological separation from verified historical disaster logs.
- **Simulated emergency broadcast previews** without triggering false alerts.

---

## 2. Architecture Overview

### Frontend Architecture
- **Framework:** React 19 + TypeScript + Vite 8
- **Styling:** Modular Vanilla CSS design system with curated dark-navy monsoon palettes, glassmorphism badges, and responsive CSS grid.
- **Mapping:** Leaflet with live OpenStreetMap tiles and custom HTML DivIcon pulse markers colored by risk score (Green/Amber/Red).
- **Icons:** Lucide React icons.
- **Persistence:** LocalStorage for immediate persistence and offline caching of citizen reports.

### Deterministic Risk Scoring Formulation
The risk engine (`src/utils/riskEngine.ts`) computes a deterministic composite score $S \in [0, 100]$:
$$S = \min\left(100, \sum w_i \cdot F_i\right)$$

Where factors $F_i$ are normalized from 0 to 100:
1. **Rainfall Intensity ($F_{\text{intensity}}$):** Normalized against 50 mm/h peak cloudburst rate ($w_1 = 0.35$).
2. **24-Hour Cumulative Rainfall ($F_{\text{cumulative}}$):** Normalized against 120 mm saturated catchment baseline ($w_2 = 0.25$).
3. **Low-Lying Terrain Vulnerability ($F_{\text{terrain}}$):** Hotspot-specific topographic depression factor (Sinhagad Rd: 82%, Ambil Odha: 88%, Ekta Nagar: 94%) ($w_3 = 0.20$).
4. **Khadakwasla Dam Spillway Discharge ($F_{\text{dam}}$):** Normalized against 35,000 cusecs emergency release threshold ($w_4 = 0.10$). Directly affects Mutha riverbank zones.
5. **Historical Incidents Frequency ($F_{\text{history}}$):** Verified PMC past inundations count ($w_5 = 0.10$).

**Classification Cutoffs (Configurable in UI):**
- $\text{Score} < 35 \implies$ **Low Risk (Green)**
- $35 \le \text{Score} < 65 \implies$ **Medium Watch (Amber)**
- $\text{Score} \ge 65 \implies$ **High Flood Risk (Red / Pulsing)**

### Target AWS Cloud Architecture (Phase 2 Roadmap)
```
                                 [ CloudFront CDN Edge ]
                                            │
                                            ▼
                               [ S3 Static Website Bucket ]
                               (HTML / JS / CSS Bundle)
                                            │
                ┌───────────────────────────┴───────────────────────────┐
                ▼                                                       ▼
      [ Amazon API Gateway ]                                  [ AWS IoT Core ]
                │                                                       │
                ▼                                                       ▼
      [ AWS Lambda (Node.js) ]                               [ Water Level Sensors ]
     (Validate & Ingest Reports)                            (Ambil Odha Culverts)
         │               │
         ▼               ▼
[ Amazon DynamoDB ]   [ Amazon SNS / SES ]
(Geo-indexed Reports) (Civil Defense Flash SMS / Email)
```

---

## 3. Quickstart & Local Setup

### Prerequisites
- Node.js $\ge$ 18.x
- npm $\ge$ 9.x

### Installation & Launch
```bash
# 1. Clone or navigate to the repository
cd pune-flood-watch

# 2. Install dependencies
npm install

# 3. Run the unit test suite
npm test

# 4. Start local development server
npm run dev
```
Open **http://localhost:5173** in your browser.

### Production Build Validation
```bash
npm run build
```
Generates an optimized, statically compiled bundle in the `dist/` directory ready for S3 deployment.

---

## 4. How to Reproduce & Judge Core Features

### Reproducing Risk Scenarios
Use the **Deterministic Risk Simulator** quick action buttons at the top of the dashboard:

| Preset | Inputs Simulated | Expected Result & Behavior |
| :--- | :--- | :--- |
| **☀️ Low Risk (Dry)** | 6 mm/h rain, 12 mm 24h, 0 cfs dam release | All 3 hotspots display **Low Risk** (Score 15-28/100, Green badge). Explanations state normal seasonal baseline. |
| **🌧️ Medium Risk (Monsoon)** | 22 mm/h rain, 52 mm 24h, 9,500 cfs dam release | Sinhagad Road and Ambil Odha escalate to **Medium Watch** (Score 45-58/100, Amber badge). Warning indicates localized road ponding. |
| **⛈️ High Risk (Deluge + 34k cfs)** | 54 mm/h rain, 135 mm 24h, 34,000 cfs spillway release | All hotspots trigger **High Flood Risk** (Score 72-91/100, Crimson pulsating markers). Action buttons activate simulated broadcast preview. |

### Inspecting Configurable Thresholds
1. Click **Config Thresholds** (gear icon) in the simulator panel.
2. Change the High Risk Trigger cutoff from `65` to `50` or adjust factor weights.
3. Observe how hotspots immediately recalculate classification without page reloads.

### Demonstrating Simulated High-Risk Alert
1. Apply the **High Risk** preset.
2. On any High-Risk card (e.g. *Ekta Nagar* or *Sinhagad Road*), click **Preview High-Risk Alert**.
3. Toggle between **Cellular Flash SMS**, **Citizen WhatsApp Alert**, and **Mobile Push Notification**.
4. Notice realistic Marathi + English bilingual text with Pune Municipal Disaster Cell emergency numbers.
5. Notice the explicit banner: *Simulated preview only — no actual SMS/Email is transmitted in this MVP*.

### Demonstrating Citizen Waterlogging Reporting
1. Click **+ Report Waterlogging** in the header.
2. Select a hotspot, choose water depth (e.g. *Knee-deep*), enter a landmark (e.g. *Near Vitthalwadi Bus Stop*), and enter description.
3. Click **Submit Citizen Report**.
4. Verify the success state with confirmation ID (`#rep-xxxx`).
5. Close the modal and see the new submission appear at the top of the **Citizen Observations** feed, distinctly labeled as **Unverified Citizen Observation**.
6. Refresh the page: the report persists via browser LocalStorage.

### Demarcation of Citizen Reports vs Official Historical Incidents
1. Click the **Verified Historical Incidents** tab in the intelligence feed.
2. Compare the official records (2019 Katraj/Ambil Odha flash floods and July 2024 Khadakwasla 35,000 cusecs inundation with official PMC disaster log numbers) against unverified crowd submissions.
3. Review the methodology notice: unverified crowd reports do not manipulate deterministic model weights to prevent false feedback loops.

---

## 5. AWS S3 Static Website Deployment Guide

### Architecture
The frontend compiles into static assets (`index.html`, JavaScript chunks, CSS bundles) in `./dist`, making it a perfect fit for **Amazon S3 Static Website Hosting** with optional **Amazon CloudFront** SSL/CDN acceleration.

### Prerequisites for AWS Deployment
1. AWS CLI installed and configured (`aws configure` with appropriate IAM permissions for S3).
2. A globally unique S3 bucket name (e.g. `pune-flood-watch-mvp-2026`).

### Step-by-Step Deployment Commands

```bash
# Step 1: Compile the production build
npm run build

# Step 2: Create the S3 Bucket (choose your AWS region, e.g., ap-south-1 for Mumbai)
aws s3 mb s3://pune-flood-watch-mvp --region ap-south-1

# Step 3: Disable Block Public Access for static website hosting
aws s3api put-public-access-block \
    --bucket pune-flood-watch-mvp \
    --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# Step 4: Apply Bucket Policy granting public Read access for web assets
cat <<EOF > s3-policy.json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::pune-flood-watch-mvp/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy --bucket pune-flood-watch-mvp --policy file://s3-policy.json

# Step 5: Configure S3 Static Website Hosting
aws s3 website s3://pune-flood-watch-mvp/ --index-document index.html --error-document index.html

# Step 6: Sync compiled dist/ files to the S3 bucket
aws s3 sync dist/ s3://pune-flood-watch-mvp/ --delete

# Step 7: Access the website
# The website will be available at:
# http://pune-flood-watch-mvp.s3-website.ap-south-1.amazonaws.com
```

### Security & Credential Hygiene
- **Zero hardcoded credentials:** No AWS Access Keys, Secret Keys, or Session Tokens exist anywhere in this repository or client bundle.
- **Client-Side Safety:** No backend AWS SDK calls are executed client-side without AWS Cognito / STS authentication.

---

## 6. Official Pune Emergency Contacts
For actual life-safety flood emergencies in Pune:
- **Pune Municipal Corporation (PMC) Disaster Management Cell:** `020-25501269` / `020-25506800`
- **All-India Emergency Response Support System (ERSS):** `112`
- **Pune Fire Brigade Control:** `101` / `020-26451707`
- **Pune City Traffic Police Helpline:** `020-26208225`

---

## 7. Data Sources & Limitations Disclaimer
- **Prototype Status:** Built as a hackathon MVP demonstration for *Environmental Hacks by WeMakeDevs*.
- **Telemetry Notice:** Weather metrics and Khadakwasla dam spillway figures are locally simulated demo inputs. This system does not claim real-time live telemetry integration with IMD doppler radar or PMC SCADA gauges.
- **Geographic Precision:** Coordinates for hotspots are illustrative approximate markers based on publicly documented historical flood news reports.
- **Non-Emergency Disclaimer:** This application does not possess official municipal emergency status. Always follow official advisories issued by the District Collector and PMC Disaster Management Authority.
