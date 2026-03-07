# PREVAIL - The Website

**PREVAIL** (Predictive Response for Emergency Volume Assessment in Incident Locations) is an interactive data science dashboard built for San Diego Gas & Electric (SDG&E). It uses an ensemble machine learning model trained on historical outage, weather, and dispatch records from 2021–2025 to predict the number of repair crew members needed during weather-driven power outages.

The dashboard lets utility managers select a historical storm week and instantly see a color-coded H3 hexagon map of the SDG&E service territory, summarizing predicted crew demand by region alongside key weather metrics. Below the map, actionable dispatch cards provide GPS coordinates and exact crew counts, turning AI predictions into concrete staging orders.

## Project Links

- **Report:** [Link to Report](https://drive.google.com/file/d/16w2mj_5NbRraMXm2SwYJ1Rj6MAptrRpT/view?usp=sharing)
- **Poster:** [Link to Poster](https://drive.google.com/file/d/1KsqX11ybkPWF1jv9Z1-Hk2r8OQH_xg4M/view)
- **Website:** [Link to Website](https://angela139.github.io/prevail-dashboard/)
- **Project Repository (private):** [Link to Project Repository](https://github.com/adityasurap/PREVAIL) 

---

## Running the Website Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the project root and add your [Mapbox](https://www.mapbox.com/) token:

   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```
