import Link from "next/link";
import DashboardContainer from "../components/DashboardContainer";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline text-sm">
          &larr; Back to Home
        </Link>
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 mt-2 leading-tight">
          PREVAIL &mdash; A Crew Allocation Interface for Inclement Weather
          Conditions in San Diego
        </h1>
        <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8">
          Translating extreme meteorological forecasts into actionable,
          AI-driven workforce logistics.
        </p>

        <DashboardContainer />
      </div>
    </div>
  );
}
