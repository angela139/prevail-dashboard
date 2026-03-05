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
            src="prevail_outage_map.png"
            alt="Geospatial analysis of SDG&E power outages"
            className="w-full h-auto rounded-md mb-4"
            width={800}
            height={600}
          />
          <p className="text-center text-gray-600 font-medium italic text-sm md:text-base leading-relaxed">
            Geography acts as a &apos;switch&apos; for grid vulnerabilities:
            coastal zones face equipment failures, while inland regions are
            dominated by weather-driven risks.
          </p>
        </div>

        {/* Methods Section */}
        <section id="methods" className="py-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-sdge-navy border-b-4 border-sdge-green pb-3">
            Methods
          </h2>

          <p className="text-lg md:text-xl mb-8 text-gray-700 leading-relaxed">
            To build a system capable of predicting future grid vulnerabilities
            and crew sizes, we designed a two-stage artificial intelligence
            pipeline. This required a robust data engineering process to combine
            weather telemetry with human dispatch records.
          </p>

          {/* Data Collection */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold mb-4 text-sdge-navy">
              Data Collection & Preparation
            </h3>
            <p className="text-lg md:text-xl mb-4 text-gray-700 leading-relaxed">
              Our project integrates three distinct, high-volume datasets
              provided by SDG&E spanning from 2014 to 2024. First, we utilized
              historical outage data from SDG&E&apos;s Outage Management System,
              which contains over 460,000 records that serve as our &quot;ground
              truth&quot; for when and where the grid failed. Second, to
              understand the human response, we used resource allocation logs
              from SDG&E&apos;s field operations system SORT, which track the
              exact number of personnel dispatched. Finally, we integrated
              meteorological sensor data featuring over 75 million hourly
              readings of wind gusts, sustained wind speed, temperature, and
              humidity.
            </p>
            <p className="text-lg md:text-xl mb-4 text-gray-700 leading-relaxed">
              Because the human dispatch logs were tracked by ZIP code rather
              than exact GPS coordinates, we engineered a spatial proxy to link
              these dispatch records to the exact outages within a shared
              12-hour response window. This allowed us to successfully recover
              over 1,500 labeled instances of high-impact storm responses.
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              To standardize all of this data, we mapped all spatial locations
              into a uniform &quot;honeycomb&quot; grid using H3 hexagons. We
              aggregated our weather data to the hourly level and established
              dynamic, percentile-based thresholds to flag &quot;extreme&quot;
              weather hours. To ensure our models could actually predict the{" "}
              <em>future</em>, we structured our targets to look ahead, training
              the system to learn the atmospheric conditions 1, 3, 6, 12, or 24
              hours <em>before</em> an outage actually commenced.
            </p>
          </div>

          {/* Stage 1 */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold mb-4 text-sdge-navy">
              Stage 1: Predicting Weather-Related Outages
            </h3>
            <p className="text-lg md:text-xl mb-4 text-gray-700 leading-relaxed">
              The first component of our predictive framework is a
              classification model designed to act as a &quot;weather
              filter.&quot; Before we can predict crew size, we must forecast if
              a weather-related outage will actually happen.
            </p>
            <p className="text-lg md:text-xl mb-4 text-gray-700 leading-relaxed">
              During our initial testing, we found that aggregating weather by
              the week smoothed out sudden, violent storm spikes, so we pivoted
              to daily aggregation. We engineered specific features to capture
              the physical drivers of grid failure, such as the absolute change
              in temperature from the previous day, and the interaction between
              high wind and high heat, which causes power lines to sag and sway
              into each other. We also added spatial awareness to the model so
              it could recognize if neighboring hexagons were experiencing high
              winds.
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              We utilized an XGBoost model for this task. A critical challenge
              in outage prediction is the asymmetry of real-world costs: a False
              Positive (predicting an outage that doesn&apos;t happen) just
              results in minor standby costs, but a False Negative (missing an
              actual storm outage) results in massive operational disruptions.
              To solve this, we applied an imbalance ratio to our model,
              mathematically penalizing the AI much more harshly for missing an
              outage than for raising a false alarm.
            </p>
          </div>

          {/* Stage 2 */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-4 text-sdge-navy">
              Stage 2: Predicting Crew Size
            </h3>
            <p className="text-lg md:text-xl mb-6 text-gray-700 leading-relaxed">
              Once a high-risk time window is identified, our framework shifts
              to resource quantification. We tested two different modeling
              approaches to see which provided the best operational utility.
            </p>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
              <h4 className="text-xl font-bold mb-3 text-sdge-navy">
                Approach 1: Initial Dispatch Response
              </h4>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                This pipeline focused on predicting the initial crew size
                required for a specific outage right when it happens. We started
                with a linear LASSO regression model — its L1 regularization
                automatically performed feature selection across our 200+
                correlated weather, infrastructure, lag, and rolling variables,
                establishing a baseline Mean Absolute Error (MAE) of{" "}
                <strong>1.02 crew members</strong>. Because crew sizes are
                discrete counts, we transitioned to an XGBoost model utilizing a
                Poisson objective function, which naturally fits the
                zero-bounded, right-skewed shape of dispatch data and prevents
                physically impossible negative predictions. This reduced our MAE
                to <strong>0.99 crew members</strong>.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Finally, we combined both models into a Stacking Ensemble,
                feeding the outputs of both the linear and non-linear models
                into a final meta-learner. This architecture leverages
                LASSO&apos;s stability for standard conditions and
                XGBoost&apos;s flexibility for extreme, compounding storm events
                — achieving a final MAE of <strong>0.89 crew members</strong>{" "}
                and an operational accuracy of <strong>over 70%</strong>. In
                practice, this means nearly three-quarters of all predictions
                fall safely within a strict one-person tolerance, requiring
                minimal manual adjustment by dispatchers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-xl font-bold mb-3 text-sdge-navy">
                Approach 2: Cumulative Job Volume
              </h4>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Instead of just looking at the first truck sent out, our second
                pipeline estimated the <em>total</em> workforce burden generated
                over the entire lifespan of an outage. We aggregated all
                overlapping repair jobs associated with an event to calculate a
                cumulative resource count.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We established an ElasticNet regression baseline, which
                struggled with the complex, non-linear dynamics of weather and
                job duration. We then transitioned to a Random Forest Regressor
                comprised of 200 decision trees. To handle massive outliers, we
                log-transformed the target variable and engineered specific
                severity flags for keywords like &quot;Lightning&quot; and
                &quot;Wind.&quot; This high-flexibility model successfully
                captured the drivers of total workforce volume, drastically
                reducing our prediction MAE down to just 0.511 crew members.
              </p>

              {/* Image of Crew Size Model Accuracy*/}
              <div className="my-4 bg-white rounded-lg">
                <Image
                  src="prevail_crew_size_model_accuracy.png"
                  alt="Predicted vs. Actual Crew Size for Crew Size Prediction Model"
                  className="w-full h-auto rounded-md mb-2 border border-gray-100"
                  width={800}
                  height={600}
                />
                <p className="text-center text-gray-600 font-medium italic text-sm md:text-base leading-relaxed">
                  Our best crew size prediction model achieves highly accurate
                  predictions across a wide range of event sizes, with points
                  tightly clustered around the ideal 1:1 line.
                </p>
              </div>
            </div>
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
              { label: "Final MAE", value: "0.89", unit: "crew members" },
              {
                label: "Operational Accuracy",
                value: ">70%",
                unit: "within ±1 person",
              },
              {
                label: "Training Samples",
                value: "1,500+",
                unit: "storm responses",
              },
              {
                label: "Weather Readings",
                value: "75M+",
                unit: "hourly records",
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
