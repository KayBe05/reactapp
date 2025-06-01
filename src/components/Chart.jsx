import React from 'react';
import { TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Chart = ({ logs }) => {
  if (logs.length === 0) return null;

  // Prepare data for charts
  const categoryData = logs.reduce((acc, log) => {
    acc[log.category] = (acc[log.category] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(categoryData).map(([category, count]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    count
  }));

  // Daily activity data for line chart
  const dailyData = logs.reduce((acc, log) => {
    const date = new Date(log.timestamp).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const lineChartData = Object.entries(dailyData)
    .map(([date, count]) => ({ date, tasks: count }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-6">
        <TrendingUp className="text-green-600 mr-2" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">Your Productivity Overview</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">Tasks by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {lineChartData.length > 1 && (
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Daily Activity</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="tasks" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{logs.length}</div>
          <div className="text-sm text-blue-600">Total Tasks</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{Object.keys(categoryData).length}</div>
          <div className="text-sm text-green-600">Categories</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {logs.reduce((acc, log) => acc + (log.suggestions?.length || 0), 0)}
          </div>
          <div className="text-sm text-purple-600">AI Suggestions</div>
        </div>
      </div>
    </div>
  );
};

export default Chart;
