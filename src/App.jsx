import React, { useState, useEffect } from 'react';
import LogForm from './components/LogForm';
import LogList from './components/LogList';
import Chart from './components/Chart';
import * as apiService from './services/api';

const App = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const fetchedLogs = await apiService.getLogs();
      setLogs(fetchedLogs);
    } catch (err) {
      setError('Failed to load logs');
    }
  };

  const handleLogSubmit = async (logData) => {
    setIsLoading(true);
    setError(null);

    try {
      const newLog = await apiService.submitLog(logData);
      setLogs(prevLogs => [newLog, ...prevLogs]);
    } catch (err) {
      setError('Failed to submit log. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLog = async (logId, updates) => {
    try {
      const updatedLog = await apiService.updateLog(logId, updates);
      setLogs(prevLogs =>
        prevLogs.map(log => log.id === logId ? updatedLog : log)
      );
    } catch (err) {
      setError('Failed to update log');
    }
  };

  const handleDeleteLog = async (logId) => {
    try {
      const updatedLogs = await apiService.deleteLog(logId);
      setLogs(updatedLogs);
    } catch (err) {
      setError('Failed to delete log');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            DevDiary
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Track your development tasks and get AI-powered suggestions to boost your productivity
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Log Form */}
        <LogForm onSubmit={handleLogSubmit} isLoading={isLoading} />

        {/* Charts */}
        <Chart logs={logs} />

        {/* Log List */}
        <LogList
          logs={logs}
          onUpdateLog={handleUpdateLog}
          onDeleteLog={handleDeleteLog}
        />
      </div>
    </div>
  );
};

export default App;
