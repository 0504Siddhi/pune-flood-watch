# Pune Flood Watch 

Monsoon flood risk for known waterlogging spots in Pune, with an explainable score and a citizen reporting form.

Built for **Environmental Hacks** (Bharat Builds Tour by WeMakeDevs, in collaboration with AWS Builder Center), Heat and Water track.

- **Live demo (hosted on Amazon S3):** http://pune-flood-watch-siddhi-2026.s3-website-ap-southeast-2.amazonaws.com/
- 
- **Team:** Nexovate

> **Important:** This is a hackathon prototype. Rainfall and Khadakwasla dam discharge are **simulated inputs**, not live data. The sample citizen reports and the past-flooding list are **sample data for demonstration**. Do not use this app to make safety decisions. For emergencies call **112** or **101**, and follow official advisories from the Pune Municipal Corporation (PMC).

---

## 1. The problem

During the monsoon, certain places in Pune, such as Sinhagad Road, Ambil Odha and Ekta Nagar, are reported to waterlog quickly. Residents often find out only when water is already on the road, because forecasts and warnings usually cover the whole city or river basin, not the specific spots people live in and travel through.

Residents need:
- **Spot-level risk** instead of one city-wide forecast.
- **An explanation** of why a spot is at risk, not just a colour.
- **A way to share what they see**, kept clearly separate from past flooding records so unverified reports never change the risk score.

## 2. What the app does

- Shows a risk level (Low, Medium, High) and a score out of 100 for three hotspots: Sinhagad Road Corridor, Ambil Odha Stream Basin and Ekta Nagar Riverbed Settlement.
- Lets you change rainfall intensity, 24-hour rainfall and Khadakwasla spillway discharge (all simulated) and see every hotspot recalculate immediately.
- Explains each score factor by factor, with the points each one contributes.
- Shows the hotspots on an interactive map, coloured by risk.
- Previews what a High-risk alert would look like (SMS, WhatsApp, push), in English and Marathi. **No message is actually sent.**
- Lets residents submit a waterlogging report (hotspot, depth, landmark, description). Reports are labelled **Unverified Citizen Observation**, are saved only in your browser (LocalStorage), and **do not change the risk score**.
- Lets you change the risk thresholds and factor weights in the app to see how the classification responds.

## 3. How the risk score works

The score is a transparent rule, **not a trained machine learning model**.

```
Score = min(100, sum of weight x factor)
```

Each factor is scaled from 0 to 100:

| Factor | Weight | How it is scaled |
| :--- | :---: | :--- |
| Rainfall intensity | 0.35 | Against 50 mm/h (cloudburst rate) |
| 24-hour rainfall | 0.25 | Against 120 mm |
| Terrain vulnerability | 0.20 | Estimated per hotspot (Sinhagad Road 82%, Ambil Odha 88%, Ekta Nagar 94%) |
| Khadakwasla dam discharge | 0.10 | Against 35,000 cusecs |
| Past incidents | 0.10 | From the count of past flooding events in the sample list |

Classification (cutoffs can be changed in the app):
- Below 35: **Low** (green)
- 35 to 64: **Medium watch** (amber)
- 65 and above: **High** (red)

Example: with the Monsoon preset (22 mm/h, 52 mm in 24 h, 9,500 cusecs), Sinhagad Road scores 53/100 (rain intensity 15.4 + 24-hour rain 10.8 + terrain 16.4 + dam 2.7 + past incidents 8).

The terrain percentages are estimates for the demo, not surveyed measurements.

## 4. Try it yourself

Use the quick scenario buttons in the simulator panel:

| Scenario | Inputs | What you should see |
| :--- | :--- | :--- |
| Low Risk (Dry) | 6 mm/h, 12 mm in 24 h, 0 cusecs | All hotspots Low (green) |
| Medium Risk (Monsoon) | 22 mm/h, 52 mm in 24 h, 9,500 cusecs | All hotspots Medium watch (scores about 53 to 56) |
| High Risk (Deluge) | 54 mm/h, 135 mm in 24 h, 34,000 cusecs | Hotspots turn High (red, pulsing markers) and the alert preview becomes available |

**Preview an alert:** apply the High Risk preset, open a High-risk card and click *Preview High-Risk Alert*. Switch between SMS, WhatsApp and push formats. The banner states that nothing is sent.

**Submit a report:** click *+ Report Waterlogging*, fill in the form and submit. The new report appears at the top of the Citizen Observations list, labelled unverified, and stays after a refresh because it is stored in your browser.

**Past flooding list:** the second tab lists past flooding reported in the news, such as the September 2019 Ambil Odha flood and July 2024 flooding linked to Khadakwasla releases. It is a sample list kept separate from citizen reports.

## 5. Tech stack

- React, TypeScript and Vite
- Leaflet with OpenStreetMap tiles for the map
- Lucide icons
- Plain CSS design system
- LocalStorage for citizen reports
- Rule-based scoring in `src/utils/riskEngine.ts`

## 6. How AWS is used

**Amazon S3 static website hosting.** The app compiles to static files (`index.html`, JavaScript and CSS) and is served directly from an S3 bucket in the Asia Pacific (Sydney) region, `ap-southeast-2`. There is no backend in this version.

Deployment steps (done in the S3 console):
1. Run `npm run build` to create the `dist/` folder.
2. Create an S3 bucket and turn off "Block all public access".
3. Upload the **contents** of `dist/` (so `index.html` is at the top level of the bucket).
4. Enable static website hosting with `index.html` as the index document.
5. Add a bucket policy that allows public `s3:GetObject` on the bucket's objects.
6. Open the bucket's website endpoint.

**Not built yet (planned next):** a Lambda function with API Gateway to receive reports, DynamoDB to store them, SNS or SES to send real email alerts, and live rainfall from a weather service. CloudFront is not used.

No AWS access keys or secrets are included in this repository.

## 7. Run locally

Requirements: Node.js 18 or newer and npm.

```bash
npm install
npm test        # run the unit tests
npm run dev     # start the dev server
npm run build   # create the production bundle in dist/
```

Open http://localhost:5173 while the dev server is running.

## 8. Data sources and limitations

- Rainfall, 24-hour rainfall and Khadakwasla discharge are **simulated inputs**. The app does not connect to IMD radar, PMC sensors or live dam data.
- Hotspot coordinates are **approximate**, based on places named in public news reports.
- The past-flooding list and the three sample citizen reports are **demonstration data**.
- Terrain vulnerability values are **estimates**.
- Citizen reports are unverified and stay in your own browser. They are not shared with anyone.
- The risk score is a simple rule. It has not been validated against real flood records and is not a warning system.
- This is not an official PMC or government tool.

## 9. AI tools used

- Google Antigravity: code generation and edits
- Claude (Anthropic): project planning, wording and documentation

## 10. Emergency contacts

For a life-safety emergency in India, call **112**. For fire, call **101**. For flood advisories and the Pune Municipal Corporation Disaster Management Cell, check official PMC channels at https://pmc.gov.in.
