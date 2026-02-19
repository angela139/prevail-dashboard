export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-sdge-navy via-sdge-blue to-sdge-green text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">PREVAIL</h1>
          <p className="text-xl md:text-2xl opacity-95">
            Predictive Response for Emergency Volume Assessment in Incident Locations
          </p>
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
            Extreme weather events are the single largest cause of power outages in the United States, costing an estimated $20 to $55 billion annually. For utility operators like San Diego Gas & Electric (SDG&E), the challenge is not just preventing these outages, but responding to them efficiently when they inevitably occur. Currently, the industry standard for severe weather response is largely reactive: utilities often wait for a customer to report a &quot;lights out&quot; event before a repair crew is assigned and dispatched.
          </p>

          <p className="text-lg md:text-xl mb-4 text-gray-700 leading-relaxed">
            This &quot;wait-and-see&quot; approach creates significant operational bottlenecks. If an operator underestimates a storm&apos;s severity, crews are scrambled at the last minute, delaying restoration and increasing safety risks for the public. Conversely, if they overestimate the danger, contract crews sit idle on standby, racking up unnecessary costs that are ultimately passed on to the community.
          </p>

          <p className="text-lg md:text-xl mb-4 text-gray-700 leading-relaxed">
            While recent advancements in machine learning have successfully modeled <em>where</em> and <em>when</em> an outage might occur, there is a massive gap in the research regarding the &quot;input side&quot; of the restoration equation: the specific human labor resources required to fix it. Existing models can predict a grid failure, but they fail to quantify how many people need to be sent in the truck.
          </p>

          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            To address this gap, we created <strong>PREVAIL</strong> (Predictive Response for Emergency Volume Assessment in Incident Locations). PREVAIL transitions the decision-making process from reactive to proactive. By explicitly predicting the specific crew size required for impending weather-driven outages over a weekly planning window, we aim to optimize resource allocation before the weather event even makes landfall.
          </p>
        </section>

        {/* Methods Section */}
        <section id="methods" className="py-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-sdge-navy border-b-4 border-sdge-green pb-3">
            Methods
          </h2>
          
          <p className="text-lg md:text-xl mb-8 text-gray-700 leading-relaxed">
            To build a system capable of predicting future grid vulnerabilities and crew sizes, we designed a two-stage artificial intelligence pipeline. This required a robust data engineering process to combine weather telemetry with human dispatch records.
          </p>

          {/* Data Collection */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold mb-4 text-sdge-navy">Data Collection & Preparation</h3>
            <p className="text-lg md:text-xl mb-4 text-gray-700 leading-relaxed">
              Our project integrates three distinct, high-volume datasets provided by SDG&E spanning from 2014 to 2024. First, we utilized historical outage data from SDG&E's Outage Management System, which contains over 460,000 records that serve as our &quot;ground truth&quot; for when and where the grid failed. Second, to understand the human response, we used resource allocation logs from SDG&E's field operations system SORT, which track the exact number of personnel dispatched. Finally, we integrated meteorological sensor data featuring over 75 million hourly readings of wind gusts, sustained wind speed, temperature, and humidity.
            </p>
            <p className="text-lg md:text-xl mb-4 text-gray-700 leading-relaxed">
              Because the human dispatch logs were tracked by ZIP code rather than exact GPS coordinates, we engineered a spatial proxy to link these dispatch records to the exact outages within a shared 12-hour response window. This allowed us to successfully recover over 1,500 labeled instances of high-impact storm responses.
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              To standardize all of this data, we mapped all spatial locations into a uniform &quot;honeycomb&quot; grid using H3 hexagons. We aggregated our weather data to the hourly level and established dynamic, percentile-based thresholds to flag &quot;extreme&quot; weather hours. To ensure our models could actually predict the <em>future</em>, we structured our targets to look ahead, training the system to learn the atmospheric conditions 1, 3, 6, 12, or 24 hours <em>before</em> an outage actually commenced.
            </p>
          </div>

          {/* Stage 1 */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold mb-4 text-sdge-navy">Stage 1: Predicting Weather-Related Outages</h3>
            <p className="text-lg md:text-xl mb-4 text-gray-700 leading-relaxed">
              The first component of our predictive framework is a classification model designed to act as a &quot;weather filter.&quot; Before we can predict crew size, we must forecast if a weather-related outage will actually happen.
            </p>
            <p className="text-lg md:text-xl mb-4 text-gray-700 leading-relaxed">
              During our initial testing, we found that aggregating weather by the week smoothed out sudden, violent storm spikes, so we pivoted to daily aggregation. We engineered specific features to capture the physical drivers of grid failure, such as the absolute change in temperature from the previous day, and the interaction between high wind and high heat, which causes power lines to sag and sway into each other. We also added spatial awareness to the model so it could recognize if neighboring hexagons were experiencing high winds.
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              We utilized an XGBoost model for this task. A critical challenge in outage prediction is the asymmetry of real-world costs: a False Positive (predicting an outage that doesn&apos;t happen) just results in minor standby costs, but a False Negative (missing an actual storm outage) results in massive operational disruptions. To solve this, we applied an imbalance ratio to our model, mathematically penalizing the AI much more harshly for missing an outage than for raising a false alarm.
            </p>
          </div>

          {/* Stage 2 */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-4 text-sdge-navy">Stage 2: Predicting Crew Size</h3>
            <p className="text-lg md:text-xl mb-6 text-gray-700 leading-relaxed">
              Once a high-risk time window is identified, our framework shifts to resource quantification. We tested two different modeling approaches to see which provided the best operational utility.
            </p>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
              <h4 className="text-xl font-bold mb-3 text-sdge-navy">Approach 1: Initial Dispatch Response</h4>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                This pipeline focused on predicting the initial crew size required for a specific outage right when it happens. We started with a linear LASSO regression model to filter out noisy variables, establishing a baseline Mean Absolute Error (MAE) of 1.02 crew members. Because crew sizes are distinct counts, we transitioned to a Gradient Boosting Regressor utilizing a &quot;Poisson&quot; objective function, which is specifically designed for whole-number count data.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Finally, we combined both models into a Stacking Ensemble. By feeding the predictions of both the linear and non-linear models into a final meta-learner, we smoothed out the biases of each, achieving a final MAE of 0.89 crew members.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h4 className="text-xl font-bold mb-3 text-sdge-navy">Approach 2: Cumulative Job Volume</h4>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Instead of just looking at the first truck sent out, our second pipeline estimated the <em>total</em> workforce burden generated over the entire lifespan of an outage. We aggregated all overlapping repair jobs associated with an event to calculate a cumulative resource count.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We established an ElasticNet regression baseline, which struggled with the complex, non-linear dynamics of weather and job duration. We then transitioned to a Random Forest Regressor comprised of 200 decision trees. To handle massive outliers, we log-transformed the target variable and engineered specific severity flags for keywords like &quot;Lightning&quot; and &quot;Wind.&quot; This high-flexibility model successfully captured the drivers of total workforce volume, drastically reducing our prediction MAE down to just 0.511 crew members.
              </p>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section id="results" className="py-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-sdge-navy border-b-4 border-sdge-yellow pb-3">
            Results
          </h2>
          <p className="text-lg md:text-xl mb-4 text-gray-700 leading-relaxed">
            Showcase your findings with visualizations and key insights.
            Remember: pictures and plots should tell your story!
          </p>
          {/* Add your figures, charts, and visualizations here */}
        </section>

        {/* Conclusion Section */}
        <section id="conclusion" className="py-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-sdge-navy border-b-4 border-sdge-green pb-3">
            Impact & Conclusion
          </h2>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            What&apos;s the impact of your work? What did you learn? What comes
            next?
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
            DSC 180A Project | Your Name | 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
