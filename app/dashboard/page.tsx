import Link from "next/link";
import DashboardContainer from "../components/DashboardContainer";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          San Diego Crew Predictions Dashboard
        </h1>
        <p className="text-gray-600 mb-8">
          Historical weather-related outages and AI-powered crew predictions
        </p>

        <DashboardContainer />
      </div>
    </div>
  );
}
