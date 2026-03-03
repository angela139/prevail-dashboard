import Link from "next/link";
import DashboardContainer from "../components/DashboardContainer";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          PREVAIL - A Crew Allocation Interface for Inclement Weather Conditions in San Diego
        </h1>
        <p className="text-gray-600 mb-8">
          Translating extreme meteorological forecasts into actionable, AI-driven workforce logistics.
        </p>

        <DashboardContainer />
      </div>
    </div>
  );
}
