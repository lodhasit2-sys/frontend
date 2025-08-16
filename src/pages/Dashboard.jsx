import React from "react";

function Dashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

      {/* Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-gray-500">Funds Collected</h3>
          <p className="text-2xl font-bold text-blue-900">₹12 Cr</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-gray-500">Active Workers</h3>
          <p className="text-2xl font-bold text-blue-900">85,000</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-gray-500">Pending Approvals</h3>
          <p className="text-2xl font-bold text-blue-900">1,245</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-gray-500">Total Schemes</h3>
          <p className="text-2xl font-bold text-blue-900">42</p>
        </div>
      </div>

      {/* Placeholder Chart */}
      <div className="bg-white shadow-md rounded-xl p-6 h-64 flex items-center justify-center text-gray-400">
        📊 Chart Placeholder
      </div>

      {/* Table Placeholder */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Applications</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Scheme</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2">1001</td>
              <td className="p-2">Ramesh Kumar</td>
              <td className="p-2">Health Benefit</td>
              <td className="p-2 text-green-600">Approved</td>
            </tr>
            <tr className="border-b">
              <td className="p-2">1002</td>
              <td className="p-2">Sita Devi</td>
              <td className="p-2">Education Support</td>
              <td className="p-2 text-yellow-600">Pending</td>
            </tr>
            <tr>
              <td className="p-2">1003</td>
              <td className="p-2">Amit Sharma</td>
              <td className="p-2">Housing Aid</td>
              <td className="p-2 text-red-600">Rejected</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
