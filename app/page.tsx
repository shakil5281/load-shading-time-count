// components/ElectricityDashboard.tsx
import React from 'react';

interface ElectricityData {
  uptimeHours: number;
  totalHours: number;
}

const ElectricityDashboard: React.FC = () => {
  // Example data: Replace this with actual API data if needed
  const data: ElectricityData = {
    uptimeHours: 16, // Example: Electricity was on for 16 hours today
    totalHours: 24, // Total hours in a day
  };

  const uptimePercentage = (data.uptimeHours / data.totalHours) * 100;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <h1 className="text-xl font-bold text-gray-700 mb-4">Electricity Uptime</h1>
        
        <div className="text-gray-600 mb-4">
          <p>Total Hours in a Day: <span className="font-semibold">{data.totalHours} hours</span></p>
          <p>Electricity On: <span className="font-semibold">{data.uptimeHours} hours</span></p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div
            className="bg-green-500 h-4 rounded-full"
            style={{ width: `${uptimePercentage}%` }}
          ></div>
        </div>

        <div className="text-sm text-gray-500">
          Electricity was on for <span className="font-semibold">{uptimePercentage.toFixed(2)}%</span> of the day.
        </div>
      </div>
    </div>
  );
};

export default ElectricityDashboard;
