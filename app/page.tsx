import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Section */}
      <header className="bg-linear-to-r from-sdge-navy via-sdge-blue to-sdge-green text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center flex flex-col gap-4 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">PREVAIL</h1>
            <p className="text-xl md:text-2xl opacity-95">
              Predictive Response for Emergency Volume Assessment in Incident
              Locations
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-block bg-sdge-yellow text-sdge-navy font-bold py-2 px-6 rounded-lg hover:bg-sdge-yellow-dark transition duration-300"
          >
            View Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 md:px-8">
        {/* Introduction Section */}
        <section id="introduction" className="py-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-sdge-navy border-b-4 border-sdge-yellow pb-3">
            Introduction
          </h2>

          <p className="text-lg md:text-xl mb-4 text-gray-700 leading-relaxed">
            Extreme weather events are the single largest cause of power outages
            in the United States, costing an estimated $20 to $55 billion
            annually. For utility operators like San Diego Gas & Electric
            (SDG&E), the challenge is not just preventing these outages, but
            responding to them efficiently when they inevitably occur.
            Currently, the industry standard for severe weather response is
            largely reactive: utilities often wait for a customer to report a
            &quot;lights out&quot; event before a repair crew is assigned and
            dispatched.
          </p>

          <p className="text-lg md:text-xl mb-4 text-gray-700 leading-relaxed">
            This &quot;wait-and-see&quot; approach creates significant
            operational bottlenecks. If an operator underestimates a
            storm&apos;s severity, crews are scrambled at the last minute,
            delaying restoration and increasing safety risks for the public.
            Conversely, if they overestimate the danger, contract crews sit idle
            on standby, racking up unnecessary costs that are ultimately passed
            on to the community.
          </p>

          <p className="text-lg md:text-xl mb-4 text-gray-700 leading-relaxed">
            While recent advancements in machine learning have successfully
            modeled <em>where</em> and <em>when</em> an outage might occur,
            there is a massive gap in the research regarding the &quot;input
            side&quot; of the restoration equation: the specific human labor
            resources required to fix it. Existing models can predict a grid
            failure, but they fail to quantify how many people need to be sent
            in the truck.
          </p>

          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            To address this gap, we created <strong>PREVAIL</strong> (Predictive
            Response for Emergency Volume Assessment in Incident Locations).
            PREVAIL transitions the decision-making process from reactive to
            proactive. By explicitly predicting the specific crew size required
            for impending weather-driven outages over a weekly planning window,
            we aim to optimize resource allocation before the weather event even
            makes landfall.
          </p>
        </section>

        {/* Map of Outages */}
        <div className="my-12 bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
          <Image
            src="outage_map.png"
            alt="Geospatial Visualization of SDG&E's Historical Power Outages"
            className="w-full h-auto rounded-md mb-4"
            width={800}
            height={600}
          />
          <p className="text-center text-gray-600 font-medium italic text-sm md:text-base leading-relaxed">
            Geospatial distribution of historical power outages across the SDG&E service territory, color-coded by primary cause. The density and variety of these events illustrate the logistical complexity of coordinating a proactive emergency response.
          </p>
        </div>

        {/* Methods Section */}
<section id="methods" className="py-16">
  <h2 className="text-3xl md:text-4xl font-bold mb-8 text-sdge-navy border-b-4 border-sdge-green pb-3">
    Methods
  </h2>

  <p className="text-lg md:text-xl mb-8 text-gray-700 leading-relaxed">
    To build a system capable of predicting crew sizes before a storm hits, we designed an intelligent data pipeline. This required a robust engineering process to combine millions of weather data points with years of historical human dispatch records into a single, unified "truth."
  </p>

  {/* Data Collection & Preparation */}
  <div className="mb-10">
    <h3 className="text-2xl font-bold mb-4 text-sdge-navy">
      Data Collection & Preparation
    </h3>
    <p className="text-lg md:text-xl mb-4 text-gray-700 leading-relaxed">
      Our project integrates three high-volume datasets provided by SDG&E, spanning from <strong>2021 to 2025</strong>. We combined outage records (the "where"), resource logs (the "who"), and weather sensor data (the "why") to see how the environment dictates the human response.
    </p>
    <p className="text-lg md:text-xl mb-4 text-gray-700 leading-relaxed">
      Because weather stations and dispatch logs use different formats, we mapped everything to a uniform <strong>"honeycomb" grid</strong> using H3 hexagons. We even "imputed" or filled in missing time gaps in the records to ensure our dataset was as complete and dense as possible.
    </p>

    {/* Technical Deep Dive Dropdown */}
    <details className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200 cursor-pointer">
      <summary className="font-bold text-sdge-navy text-lg">
        Technical Details: Data Cleaning & Merging
      </summary>
      <div className="mt-4 text-gray-700 space-y-3">
        <p>• <strong>Normalization:</strong> All timestamps were converted to UTC for consistency across disparate data sources.</p>
        <p>• <strong>Aggregation:</strong> We used a unique pair-ID strategy (outage + station) to account for multiple sensors recording the same event, taking the maximum duration to plan for "worst-case" scenarios.</p>
        <p>• <strong>Keyword Parsing:</strong> We scanned thousands of text descriptions for keywords like "wind," "storm," and "lightning" to verify that outages were truly weather-driven.</p>
      </div>
    </details>
  </div>

  {/* Feature Engineering */}
  <div className="mb-10">
    <h3 className="text-2xl font-bold mb-4 text-sdge-navy">
      Feature Engineering: Teaching the AI "Context"
    </h3>
    <p className="text-lg md:text-xl mb-4 text-gray-700 leading-relaxed">
      An AI is only as good as the features it learns from. We didn't just look at the current temperature; we engineered specialized features that capture the <strong>physics of the grid</strong>. For example, we calculated "Lag" features to tell the model what the weather was like 1, 6, and 24 hours <em>before</em> a failure, capturing the cumulative stress on a power line.
    </p>
    <ul className="list-disc ml-8 text-lg text-gray-700 space-y-2 mb-6">
      <li><strong>Thermal Stress:</strong> Tracking how much the temperature changed in 24 hours.</li>
      <li><strong>The "Galloping" Effect:</strong> Combining wind speed and heat to predict when power lines might sag and sway into each other.</li>
      <li><strong>Neighbor Awareness:</strong> Looking at weather in surrounding areas to recognize widespread storm fronts.</li>
    </ul>
  </div>

  {/* The Predictive Model */}
  <div className="mb-10">
    <h3 className="text-2xl font-bold mb-4 text-sdge-navy">
      Predicting Crew Size: Our Three-Stage AI
    </h3>
    <p className="text-lg md:text-xl mb-6 text-gray-700 leading-relaxed">
      We built our final engine by combining the strengths of different modeling approaches into a <strong>Stacking Ensemble</strong>. This allows our system to be stable during normal days but flexible enough to react to violent, unpredictable storms.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h4 className="font-bold text-sdge-navy border-b mb-2">1. The Baseline</h4>
        <p className="text-sm">A linear model (LASSO) to filter through 200+ variables and find the most important drivers.</p>
      </div>
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h4 className="font-bold text-sdge-navy border-b mb-2">2. The Refinement</h4>
        <p className="text-sm">A non-linear model (XGBoost) using a "Poisson" approach to understand that crews come in whole numbers (1, 2, 3), not decimals.</p>
      </div>
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h4 className="font-bold text-sdge-navy border-b mb-2">3. The Ensemble</h4>
        <p className="text-sm">A final "meta-learner" that combines both predictions to give us our most accurate result.</p>
      </div>
    </div>

    {/* Model Performance Graphic */}
    <div className="my-8 bg-white p-6 rounded-xl border border-gray-200 shadow-md">
      <Image
        src="model_error.png"
        alt="Predicted vs. Actual Crew Size Accuracy Graph for the LASSO Model"
        className="w-full h-auto rounded-md mb-4"
        width={800}
        height={600}
      />
      <p className="text-center text-gray-700 italic">
        Regression parity plot for the LASSO model. The results demonstrate high precision for standard, low-volume crew dispatches, while showing increased variance and a tendency to underestimate for rare, high-capacity emergency events.
      </p>
    </div>
  </div>

  {/* Dashboard Integration */}
<div className="mb-6">
  <h3 className="text-2xl font-bold mb-4 text-sdge-navy">
    From Code to Control Room
  </h3>
  <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-4">
    To prove our system works in the real world, we built an interactive dashboard using <strong>Next.js</strong>. Because our dataset covers 2021 to 2025, the dashboard currently acts as a powerful <strong>retrospective tool</strong>. 
  </p>
  <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
    Users can select past storm weeks to see exactly how our model would have performed. The system processes those historical weather logs and generates a color-coded map, allowing us to validate our "high-risk" red hexagons against actual past dispatches. This proves that the framework is ready to be connected to live weather APIs for real-time, life-saving logistical planning in the future.
  </p>
</div>
</section>

        {/* Results Section */}
        <section id="results" className="py-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-sdge-navy border-b-4 border-sdge-yellow pb-3">
            Results
          </h2>
          <p className="text-lg md:text-xl mb-10 text-gray-700 leading-relaxed">
            The primary deliverable of this project is not merely a trained
            algorithm, but a fully functional, interactive web application: the
            PREVAIL dashboard. By translating our Stacking Ensemble&apos;s
            mathematical outputs into a visual interface, we connect raw
            meteorological data with proactive utility management —
            demonstrating high accuracy on historical events as a validated
            framework for future live deployment.
          </p>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: "Final MAE", value: "0.89", unit: "Crew Members" },
              {
                label: "Operational Accuracy",
                value: ">70%",
                unit: "Within ±1 Person",
              },
              {
                label: "Training Samples",
                value: "1,500+",
                unit: "Storm Responses",
              },
              {
                label: "Weather Readings",
                value: "75M+",
                unit: "Hourly Records",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 text-center"
              >
                <p className="text-2xl md:text-3xl font-bold text-sdge-navy">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 mt-1">{stat.unit}</p>
                <p className="text-xs font-semibold text-sdge-green uppercase tracking-wide mt-2">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Top-Level Analytics */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold mb-4 text-sdge-navy">
              Top-Level Analytics &amp; Navigation
            </h3>
            <p className="text-lg md:text-xl mb-4 text-gray-700 leading-relaxed">
              The dashboard experience is anchored by a weekly selection tool,
              allowing operators to select historical timeframes spanning 2019
              to 2024 to retrospectively analyze grid conditions and validate
              the model&apos;s predictions against past extreme weather events.
              Once a week is selected, a top-level analytics bar immediately
              updates with an instant snapshot of the week&apos;s environmental
              stress: maximum and average temperatures, maximum wind speed and
              wind gust, and average humidity.
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Most importantly, this section aggregates the model&apos;s
              predictions to display the{" "}
              <strong>total expected crew members</strong> required to handle
              all modeled outages for that week — giving utility leadership an
              immediate macro-level view of necessary resource scaling.
            </p>
          </div>

          {/* Geospatial Visualization */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold mb-4 text-sdge-navy">
              Geospatial Visualization
            </h3>
            <p className="text-lg md:text-xl mb-4 text-gray-700 leading-relaxed">
              Below the summary metrics lies the core visual component: an
              interactive map of San Diego overlaid with resolution&#8209;7 H3
              hexagons, isolating the specific areas where weather-driven
              outages occurred during the selected week. These hexagons are
              dynamically color-coded based on the model&apos;s{" "}
              <code className="bg-gray-100 px-1 rounded font-mono text-base">
                crew_size
              </code>{" "}
              predictions. A gradient from yellow to red communicates severity
              at a glance — yellower hexes indicate a standard, low-resource
              response, while redder hexes immediately highlight complex,
              high-resource disaster zones.
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Operators can click on any hexagon to pull up a detailed tooltip
              with localized metrics: Predicted Crew Size, historical outage
              count, Actual Crew Size (for instant validation), maximum and mean
              temperatures, wind speed, wind gust, and mean humidity. Users can
              also toggle utility district boundaries on or off to support
              regional planning.
            </p>
          </div>

          {/* Crew Allocation Cards */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-sdge-navy">
              Crew Allocation Details Cards
            </h3>
            <p className="text-lg md:text-xl mb-4 text-gray-700 leading-relaxed">
              The interactive map is supported by a series of &quot;Crew
              Allocation Details&quot; cards directly beneath it. Each card
              corresponds to an active hexagon — clicking a card highlights its
              hexagon and surfaces its tooltip. These cards serve as simulated
              marching orders for the control room, explicitly listing the exact
              geographic center (latitude and longitude), the unique hex
              identifier, required crew count, outage count, and localized
              weather conditions such as temperature and humidity.
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              By presenting both the visual heatmap and concrete, granular
              allocation numbers side-by-side — validated against real outage
              logs — the dashboard fulfills the project&apos;s primary
              objective: empowering operators to proactively stage the right
              number of crews in the exact right locations before a future storm
              makes landfall.
            </p>
          </div>
        </section>

        {/* Discussion Section */}
        <section id="discussion" className="py-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-sdge-navy border-b-4 border-sdge-blue pb-3">
            Discussion
          </h2>
          <p className="text-lg md:text-xl mb-10 text-gray-700 leading-relaxed">
            The PREVAIL framework demonstrates that translating meteorological
            telemetry into actionable workforce logistics is not only
            mathematically viable but operationally superior to traditional
            &quot;wait-and-see&quot; dispatching. However, while the stacking
            ensemble achieves high accuracy within a ±1 crew member tolerance,
            several factors influence the remaining error variance and the
            current scope of the dashboard.
          </p>

          {/* Limitations */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold mb-5 text-sdge-navy">
              Limitations
            </h3>
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-sdge-yellow">
                <p className="font-semibold text-sdge-navy mb-2">
                  Human Judgment in Dispatch
                </p>
                <p className="text-gray-700 leading-relaxed">
                  A portion of error variance is driven by field-level judgment
                  calls, shifting control room priorities, and administrative
                  nuances not captured by physical weather telemetry. Even a
                  perfect meteorological model cannot account for every
                  deviation in personnel assignment.
                </p>
              </div>
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-sdge-yellow">
                <p className="font-semibold text-sdge-navy mb-2">
                  Spatial Resolution Mismatch
                </p>
                <p className="text-gray-700 leading-relaxed">
                  SORT dispatch logs are aggregated at the ZIP code level while
                  weather data is recorded at specific station coordinates. The
                  12-hour spatial proxy used to link these sources within the H3
                  grid — while robust — introduces a minor degree of geographic
                  uncertainty that can affect localized predictions.
                </p>
              </div>
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-sdge-yellow">
                <p className="font-semibold text-sdge-navy mb-2">
                  Data Privacy Constraints
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Due to the sensitive nature of utility infrastructure, certain
                  granular details regarding asset vulnerability and grid
                  configurations were omitted from the public-facing dashboard.
                  These restrictions, while necessary for security, limit the
                  level of contextual detail available to the end-user.
                </p>
              </div>
            </div>
          </div>

          {/* Future Work */}
          <div>
            <h3 className="text-2xl font-bold mb-5 text-sdge-navy">
              Future Work
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <p className="font-bold text-sdge-navy mb-2">
                  Real-Time API Integration
                </p>
                <p className="text-gray-700 leading-relaxed text-base">
                  Integrating a live weather API would allow the model to
                  generate dynamic, on-the-fly workforce forecasts as storms
                  evolve — rather than relying on batch-processed historical
                  telemetry.
                </p>
              </div>
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <p className="font-bold text-sdge-navy mb-2">
                  Logistical Refinement
                </p>
                <p className="text-gray-700 leading-relaxed text-base">
                  Incorporating real-time traffic and road closure data would
                  allow the pipeline to adjust staging recommendations based on
                  actual crew travel times to incident locations during adverse
                  conditions.
                </p>
              </div>
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <p className="font-bold text-sdge-navy mb-2">
                  Multimodal Failure Prediction
                </p>
                <p className="text-gray-700 leading-relaxed text-base">
                  The Poisson architecture could be extended to predict specific
                  equipment failures — such as transformer blowouts versus
                  vegetation-related line faults — mapping hardware needs
                  alongside crew sizes for a truly holistic logistics solution.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusion Section */}
        <section id="conclusion" className="py-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-sdge-navy border-b-4 border-sdge-green pb-3">
            Impact &amp; Conclusion
          </h2>
          <p className="text-lg md:text-xl mb-4 text-gray-700 leading-relaxed">
            The PREVAIL framework successfully demonstrates that the transition
            from reactive to proactive grid management is not only
            mathematically viable but operationally essential. By shifting the
            analytical focus from traditional outage probability to explicit
            resource quantification, this project provides a scalable template
            for utility operators to manage the increasing volatility of extreme
            weather. The stacking ensemble proves that even within the complex,
            non-linear environment of storm response, machine learning can
            deliver reliable, localized logistics that bridge the gap between
            meteorological data and field-level action.
          </p>
          <p className="text-lg md:text-xl mb-4 text-gray-700 leading-relaxed">
            The broader impact of this work extends beyond operational
            efficiency — it directly affects community resilience. For utility
            providers like SDG&E, the ability to accurately stage crews before a
            weather event makes landfall means significantly reducing expensive
            standby contractor costs and, more importantly, minimizing the
            duration of power interruptions for critical infrastructure and
            residents.
          </p>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            As extreme weather events continue to grow in frequency and
            intensity, tools like PREVAIL will be fundamental in ensuring that
            the energy grid remains a reliable backbone for society — turning
            the &quot;wait-and-see&quot; approach of the past into a data-driven
            standard for the future.
          </p>
        </section>

        {/* Links Section */}
        <section id="links" className="py-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-sdge-navy border-b-4 border-sdge-yellow pb-3">
            Learn More
          </h2>
          <div className="flex flex-wrap gap-4">
            <a
              href="#"
              className="inline-block px-6 py-3 bg-sdge-green text-white font-semibold rounded-lg hover:bg-sdge-green-dark transition-colors duration-300"
            >
              Full Report
            </a>
            <a
              href="#"
              className="inline-block px-6 py-3 bg-sdge-navy text-white font-semibold rounded-lg hover:bg-sdge-blue transition-colors duration-300"
            >
              GitHub Repository
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-sdge-navy text-white py-8 mt-16">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <p className="text-base md:text-lg">
            DSC 180B &nbsp;|&nbsp; Aditya Surapaneni &middot; Angela Hu &middot;
            Subika Haider &middot; Suhani Sharma &nbsp;|&nbsp; 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
