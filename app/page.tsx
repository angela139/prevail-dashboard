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
    PREVAIL isn't just a set of numbers; it's a living tool. We’ve turned our complex machine learning models into an interactive dashboard that helps utility managers &quot;see&quot; into the past to better plan for the future. By validating our model against real-world historical storms, we’ve proven that data-driven staging is ready for the real world.
  </p>

  {/* Key Metrics Dashboard */}
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
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 text-center hover:shadow-md transition-shadow"
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

  <div className="space-y-16">
    {/* Feature 1: The Big Picture */}
    <div className="flex flex-col md:flex-row gap-8 items-center">
      <div className="md:w-1/2">
        <h3 className="text-2xl font-bold mb-4 text-sdge-navy">
          1. The "Bird's Eye" View
        </h3>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          Managers start by picking a historical storm week, from 2021 to 2024. 
          The dashboard instantly summarizes the <strong>total crew count</strong> needed for the 
          entire region.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          Think of this as an early warning validation tool. It lets leadership see 
          exactly how many people they would have needed to call in before a weather 
          event hit the grid.
        </p>
      </div>
      <div className="md:w-1/2">
        <Image 
          src="dashboard_top_bar.png" 
          alt="A top-level analytics bar showing the total number of required crew numbers needed to deal with outages for the week."
          width={600}
          height={200}
          className="rounded-xl shadow-md border border-gray-100"
        />
      </div>
    </div>

    {/* Feature 2: The Interactive Heatmap */}
    <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
      <div className="md:w-1/2">
        <h3 className="text-2xl font-bold mb-4 text-sdge-navy">
          2. Mapping the Danger Zones
        </h3>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          Our map doesn't just show dots; it shows <strong>impact zones</strong>. Using a 
          color-coded &quot;honeycomb&quot; grid, we highlight high-risk areas in red 
          and lower-risk areas in yellow.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          By clicking on any cell, an operator gets a localized report: the exact temperature, 
          wind speeds, and—most importantly, how many crew members our AI recommended versus what 
          actually happened for instant validation.
        </p>
      </div>
      <div className="md:w-1/2">
        <Image 
          src="dashboard_map.png" 
          alt="An interactive H3 map showing color-coded hazard zones."
          width={600}
          height={400}
          className="rounded-xl shadow-md border border-gray-100"
        />
      </div>
    </div>

    {/* Feature 3: Actionable Dispatch Cards */}
    <div className="flex flex-col md:flex-row gap-8 items-center">
      <div className="md:w-1/2">
        <h3 className="text-2xl font-bold mb-4 text-sdge-navy">
          3. Clear Staging Orders
        </h3>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          Below the map, we provide <strong>logistics cards</strong>. These aren't abstract data points; 
          they serve as simulated &quot;marching orders&quot;.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          Each card lists the specific GPS coordinates and the exact number of personnel 
          required. This allows a dispatcher to move from a visual map to a 
          concrete staging plan in seconds.
        </p>
      </div>
      <div className="md:w-1/2">
        <Image 
          src="dashboard_cards.png" 
          alt="Detailed crew allocation cards with GPS coordinates."
          width={600}
          height={300}
          className="rounded-xl shadow-md border border-gray-100"
        />
      </div>
    </div>
  </div>

  <div className="mt-16 p-8 bg-sdge-navy rounded-2xl text-white">
    <h3 className="text-2xl font-bold mb-4">The Verdict</h3>
    <p className="text-lg leading-relaxed">
      By comparing our AI&apos;s predictions to years of real SDG&E logs, we found that <strong>over 70%</strong> of our predictions 
      land within just one person of the actual need. This confirms that PREVAIL can 
      confidently reduce the time communities spend in the dark while saving utilities millions 
      in standby costs.
    </p>
  </div>
</section>

        {/* Discussion Section */}
<section id="discussion" className="py-16">
  <h2 className="text-3xl md:text-4xl font-bold mb-8 text-sdge-navy border-b-4 border-sdge-blue pb-3">
    Discussion
  </h2>
  <p className="text-lg md:text-xl mb-10 text-gray-700 leading-relaxed">
    PREVAIL proves that we can turn weather data into a strategic roadmap for utility crews. While our AI is highly accurate, real-world engineering always comes with unique hurdles. We believe in being transparent about where our model stands today and where we plan to take it tomorrow.
  </p>

  {/* Challenges & Limitations */}
  <div className="mb-16">
    <h3 className="text-2xl font-bold mb-6 text-sdge-navy flex items-center">
      <span className="bg-sdge-yellow w-2 h-8 mr-3 rounded-full"></span>
      Current Challenges
    </h3>
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h4 className="font-bold text-sdge-navy mb-3">The Human Element</h4>
        <p className="text-gray-600 text-base leading-relaxed">
          AI can predict a storm, but it can&apos;t always predict a last-minute judgment call in the dispatch room. Sometimes, human priorities change in ways that raw weather data just can&apos;t see.
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h4 className="font-bold text-sdge-navy mb-3">Map Resolution</h4>
        <p className="text-gray-600 text-base leading-relaxed">
          While our &quot;honeycomb&quot; grid is robust, linking ZIP-code-level logs to specific GPS stations creates a small amount of &quot;geographic noise&quot;. This is an area we are constantly refining.
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h4 className="font-bold text-sdge-navy mb-3">Data Privacy</h4>
        <p className="text-gray-600 text-base leading-relaxed">
          To keep the grid secure, we omitted highly sensitive infrastructure details from the public dashboard. Security is our priority, even if it means showing less detail to the public.
        </p>
      </div>
    </div>
  </div>

  {/* Future Work - The Road Ahead */}
  <div>
    <h3 className="text-2xl font-bold mb-6 text-sdge-navy flex items-center">
      <span className="bg-sdge-green w-2 h-8 mr-3 rounded-full"></span>
      The Road Ahead
    </h3>
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start bg-gray-50 p-6 rounded-2xl border border-gray-100">
        <div className="md:w-1/4 font-bold text-sdge-navy text-xl">Real-Time Forecasting</div>
        <div className="md:w-3/4 text-gray-700 leading-relaxed">
          The next step is simple: plug in a live weather API. This would allow PREVAIL to generate &quot;on-the-fly&quot; staging orders as storms evolve in real-time, rather than looking only at historical data.
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 items-start bg-gray-50 p-6 rounded-2xl border border-gray-100">
        <div className="md:w-1/4 font-bold text-sdge-navy text-xl">Traffic & Logistics</div>
        <div className="md:w-3/4 text-gray-700 leading-relaxed">
          By adding live road closure and traffic data, we can tell crews not just <em>how many</em> people are needed, but exactly <em>how long</em> it will take to get there during a storm.
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start bg-gray-50 p-6 rounded-2xl border border-gray-100">
        <div className="md:w-1/4 font-bold text-sdge-navy text-xl">Hardware Predictions</div>
        <div className="md:w-3/4 text-gray-700 leading-relaxed">
          We want to predict more than just crew size—we want to predict <strong>gear</strong>. Future versions could forecast whether a team needs a new transformer or just a vegetation clearing kit.
        </div>
      </div>
    </div>
  </div>
</section>

        {/* Conclusion Section */}
<section id="conclusion" className="py-16">
  <h2 className="text-3xl md:text-4xl font-bold mb-8 text-sdge-navy border-b-4 border-sdge-green pb-3">
    Conclusion
  </h2>
  
  <div className="bg-sdge-navy text-white p-8 md:p-12 rounded-3xl shadow-xl">
    <p className="text-xl md:text-2xl mb-8 leading-relaxed font-light">
      PREVAIL proves that we no longer have to wait for the lights to go out before we act. By turning complex weather data into exact workforce numbers, we&apos;ve built a template for a more resilient, proactive energy grid.
    </p>

    <div className="grid md:grid-cols-2 gap-8 mb-8">
      <div>
        <h3 className="text-sdge-green text-xl font-bold mb-3 uppercase tracking-wider">For the Utility</h3>
        <p className="text-gray-300 leading-relaxed">
          Accurate staging means drastically reducing the cost of keeping contract crews on standby. It turns a &quot;guess&quot; into a data-driven strategy, ensuring every dollar spent on storm response is used efficiently.
        </p>
      </div>
      <div>
        <h3 className="text-sdge-green text-xl font-bold mb-3 uppercase tracking-wider">For the Community</h3>
        <p className="text-gray-300 leading-relaxed">
          More importantly, PREVAIL helps get the power back on faster. By having the right teams in the right place before a storm hits, we can minimize downtime for hospitals, businesses, and families.
        </p>
      </div>
    </div>

    <p className="text-lg md:text-xl border-t border-white/20 pt-8 leading-relaxed">
      As extreme weather becomes more frequent, tools like PREVAIL will be the backbone of a reliable society. We are proud to set a new data-driven standard—turning the &quot;wait-and-see&quot; approach of the past into a proactive promise for the future.
    </p>
  </div>
</section>

        Here is the updated Links Section including the fourth button for your project poster. I've maintained the styling to ensure it fits the visual hierarchy of your other resources.

TypeScript
      {/* Links Section */}
      <section id="links" className="py-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-sdge-navy border-b-4 border-sdge-yellow pb-3">
          Project Resources
        </h2>

        <div className="flex flex-wrap gap-4 mb-8">
          <a
            href="https://drive.google.com/file/d/1aDDRVbBco3-nBUmyfxG56a_Er-7WwS8c/view?usp=sharing"
            className="inline-block px-6 py-3 bg-sdge-green text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors duration-300"
          >
            Project Report
          </a>
          
          {/* Project Poster Button */}
          <a
            href="https://drive.google.com/file/d/1KsqX11ybkPWF1jv9Z1-Hk2r8OQH_xg4M/view?usp=sharing" 
            className="inline-block px-6 py-3 border-2 border-sdge-green text-sdge-green font-semibold rounded-lg hover:bg-sdge-green hover:text-white transition-all duration-300"
          >
            Project Poster
          </a>

          <a
            href="https://github.com/adityasurap/PREVAIL"
            className="inline-block px-6 py-3 bg-sdge-navy text-white font-semibold rounded-lg hover:bg-sdge-blue transition-colors duration-300"
          >
            Project Repository
          </a>
          
          <a
            href="https://github.com/angela139/prevail-dashboard"
            className="inline-block px-6 py-3 border-2 border-sdge-navy text-sdge-navy font-semibold rounded-lg hover:bg-sdge-navy hover:text-white transition-all duration-300"
          >
            Website Repository
          </a>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-sdge-navy">
          <p className="text-sm text-gray-600 italic leading-relaxed">
            <strong>Access Note:</strong> Due to a data privacy agreement with SDG&E, the primary project repository is currently private. Please contact Aditya Surapaneni to request access for academic review.
          </p>
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
