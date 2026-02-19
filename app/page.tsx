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
            Explain the problem you&apos;re addressing and why it matters. Keep
            it accessible to a general audience - think about explaining this to
            your friends and family.
          </p>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            What motivated this project? Why should people care about this
            problem?
          </p>
        </section>

        {/* Methods Section */}
        <section id="methods" className="py-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-sdge-navy border-b-4 border-sdge-green pb-3">
            Methods
          </h2>
          <p className="text-lg md:text-xl mb-4 text-gray-700 leading-relaxed">
            Describe your approach to solving the problem. Focus on the big
            picture rather than technical details.
          </p>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            You can use dropdown sections or expandable content for more
            technical details if needed.
          </p>
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
