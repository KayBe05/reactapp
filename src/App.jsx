import React, { useState, useEffect } from 'react';
import { 
  Code2, Calendar, TrendingUp, Settings, Download, Upload, 
  Moon, Sun, RefreshCw, Sparkles, BarChart3, Activity,
  CheckCircle2, Clock, Target, AlertTriangle, Coffee,
  BookOpen, Lightbulb, Zap, Star, Award, Trophy, X
} from 'lucide-react';
import LogForm from './components/LogForm';
import LogList from './components/LogList';
import Chart from './components/Chart';
import { submitLog, getLogs, updateLog, deleteLog, getAnalytics, exportData, importData } from './api';

function App() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('logs');
  const [analytics, setAnalytics] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotification, setShowNotification] = useState(null);

  // Load logs on mount
  useEffect(() => {
    loadLogs();
    loadAnalytics();
  }, []);

  const loadLogs = async () => {
    try {
      const data = await getLogs();
      setLogs(data);
    } catch (error) {
      showAlert('Failed to load logs', 'error');
    } finally {
      setIsInitialLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.warn('Failed to load analytics:', error);
    }
  };

  const handleSubmitLog = async (logData) => {
    setIsLoading(true);
    try {
      const newLog = await submitLog(logData);
      setLogs(prevLogs => [newLog, ...prevLogs]);
      loadAnalytics(); // Refresh analytics
      showAlert('Task logged successfully! Check out the AI suggestions below.', 'success');
    } catch (error) {
      showAlert('Failed to submit log. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLog = async (logId, updates) => {
    try {
      const updatedLog = await updateLog(logId, updates);
      setLogs(prevLogs => 
        prevLogs.map(log => log.id === logId ? updatedLog : log)
      );
      loadAnalytics(); // Refresh analytics
      if (updates.completed !== undefined) {
        showAlert(
          updates.completed ? 'Task marked as completed! 🎉' : 'Task marked as pending',
          updates.completed ? 'success' : 'info'
        );
      }
    } catch (error) {
      showAlert('Failed to update log', 'error');
    }
  };

  const handleDeleteLog = async (logId) => {
    try {
      const updatedLogs = await deleteLog(logId);
      setLogs(updatedLogs);
      loadAnalytics(); // Refresh analytics
      showAlert('Log deleted successfully', 'info');
    } catch (error) {
      showAlert('Failed to delete log', 'error');
    }
  };

  const handleExportData = () => {
    try {
      exportData();
      showAlert('Data exported successfully!', 'success');
    } catch (error) {
      showAlert('Failed to export data', 'error');
    }
  };

  const handleImportData = async (file) => {
    try {
      const importedLogs = await importData(file);
      setLogs(importedLogs);
      loadAnalytics();
      showAlert(`Successfully imported ${importedLogs.length} logs!`, 'success');
    } catch (error) {
      showAlert('Failed to import data. Please check the file format.', 'error');
    }
  };

  const showAlert = (message, type = 'info') => {
    setShowNotification({ message, type });
    setTimeout(() => setShowNotification(null), 4000);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = 'Developer'; // You can make this dynamic
    
    if (hour < 12) return `Good morning, ${name}! ☀️`;
    if (hour < 17) return `Good afternoon, ${name}! 🌤️`;
    if (hour < 21) return `Good evening, ${name}! 🌅`;
    return `Working late, ${name}? 🌙`;
  };

  const getMotivationalMessage = () => {
    const messages = [
      "Every line of code is a step forward! 🚀",
      "Debug today, deploy tomorrow! 💪",
      "Your future self will thank you for this! ✨",
      "Building the future, one commit at a time! 🌟",
      "Code, coffee, repeat! ☕",
      "Making the impossible possible! 🎯"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const tabs = [
    { id: 'logs', label: 'Task Logs', icon: <Calendar size={20} />, color: 'blue' },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} />, color: 'green' },
    { id: 'insights', label: 'Insights', icon: <Lightbulb size={20} />, color: 'purple' }
  ];

  const getTabColorClasses = (tabId, isActive) => {
    const colors = {
      blue: isActive ? 'bg-blue-100 text-blue-700 border-blue-300' : 'text-blue-600 hover:bg-blue-50',
      green: isActive ? 'bg-green-100 text-green-700 border-green-300' : 'text-green-600 hover:bg-green-50',
      purple: isActive ? 'bg-purple-100 text-purple-700 border-purple-300' : 'text-purple-600 hover:bg-purple-50'
    };
    return colors[tabs.find(tab => tab.id === tabId)?.color] || colors.blue;
  };

  const getNotificationStyles = (type) => {
    const styles = {
      success: 'bg-green-50 border-green-200 text-green-700',
      error: 'bg-red-50 border-red-200 text-red-700',
      info: 'bg-blue-50 border-blue-200 text-blue-700',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-700'
    };
    return styles[type] || styles.info;
  };

  const getNotificationIcon = (type) => {
    const icons = {
      success: <CheckCircle2 size={20} />,
      error: <AlertTriangle size={20} />,
      info: <Lightbulb size={20} />,
      warning: <AlertTriangle size={20} />
    };
    return icons[type] || icons.info;
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
              <Code2 size={32} className="text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              <Sparkles size={16} className="text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Loading DevDiary
          </h2>
          <p className="text-gray-600 mb-4">Preparing your development workspace...</p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Notification System */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className={`${getNotificationStyles(showNotification.type)} px-6 py-4 rounded-lg shadow-lg border backdrop-blur-sm flex items-center space-x-3 max-w-md`}>
            {getNotificationIcon(showNotification.type)}
            <span className="flex-1">{showNotification.message}</span>
            <button
              onClick={() => setShowNotification(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Code2 size={28} className="text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles size={12} className="text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            DevDiary
          </h1>
          
          <div className="space-y-2 mb-8">
            <p className={`text-xl font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {getGreeting()}
            </p>
            <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {getMotivationalMessage()}
            </p>
          </div>

          {/* Enhanced Stats Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-sm rounded-xl p-6 shadow-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} transform hover:scale-105 transition-all duration-300`}>
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Target className="text-blue-600" size={24} />
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-1">{logs.length}</div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Tasks</div>
            </div>

            <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-sm rounded-xl p-6 shadow-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} transform hover:scale-105 transition-all duration-300`}>
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="text-green-600" size={24} />
                </div>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-1">
                {logs.filter(log => log.completed).length}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Completed</div>
            </div>

            <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-sm rounded-xl p-6 shadow-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} transform hover:scale-105 transition-all duration-300`}>
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Zap className="text-purple-600" size={24} />
                </div>
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {logs.reduce((acc, log) => acc + (log.suggestions?.length || 0), 0)}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>AI Suggestions</div>
            </div>

            <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-sm rounded-xl p-6 shadow-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} transform hover:scale-105 transition-all duration-300`}>
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="text-yellow-600" size={24} />
                </div>
              </div>
              <div className="text-3xl font-bold text-yellow-600 mb-1">
                {logs.filter(log => !log.completed).length}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pending</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-sm rounded-2xl p-2 shadow-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? getTabColorClasses(tab.id, true) + ' shadow-md transform scale-105'
                      : getTabColorClasses(tab.id, false) + ' hover:scale-102'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Settings Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-3 rounded-xl ${isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-600'} shadow-lg hover:scale-105 transition-all duration-300`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button
              onClick={loadLogs}
              className={`flex items-center space-x-2 p-3 rounded-xl ${isDarkMode ? 'bg-gray-800 text-blue-400' : 'bg-white text-blue-600'} shadow-lg hover:scale-105 transition-all duration-300`}
            >
              <RefreshCw size={20} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportData}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${isDarkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-700'} hover:scale-105 transition-all duration-300`}
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
            </button>
            
            <label className={`flex items-center space-x-2 px-4 py-2 rounded-xl cursor-pointer ${isDarkMode ? 'bg-purple-800 text-purple-200' : 'bg-purple-100 text-purple-700'} hover:scale-105 transition-all duration-300`}>
              <Upload size={16} />
              <span className="hidden sm:inline">Import</span>
              <input
                type="file"
                accept=".json"
                onChange={(e) => e.target.files[0] && handleImportData(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {activeTab === 'logs' && (
            <>
              <div className="transform transition-all duration-500 hover:scale-[1.01]">
                <LogForm onSubmit={handleSubmitLog} isLoading={isLoading} isDarkMode={isDarkMode} />
              </div>

              {logs.length > 0 && (
                <div className="transform transition-all duration-500 hover:scale-[1.005]">
                  <Chart logs={logs} isDarkMode={isDarkMode} />
                </div>
              )}

              <div className="transform transition-all duration-500">
                <LogList
                  logs={logs}
                  onUpdateLog={handleUpdateLog}
                  onDeleteLog={handleDeleteLog}
                  isDarkMode={isDarkMode}
                />
              </div>
            </>
          )}

          {activeTab === 'analytics' && (
            <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-sm rounded-2xl p-8 shadow-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Analytics Dashboard
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {analytics ? (
                  <>
                    <div className="space-y-4">
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        Productivity Metrics
                      </h3>
                      <div className="space-y-2">
                        <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Average completion time: {analytics.avgCompletionTime || 'N/A'}
                        </div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Most productive day: {analytics.mostProductiveDay || 'N/A'}
                        </div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Completion rate: {analytics.completionRate || 'N/A'}%
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        Insights
                      </h3>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {analytics.insights || 'Keep logging tasks to unlock insights!'}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="col-span-2 text-center py-8">
                    <Activity className={`mx-auto mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} size={48} />
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Analytics will appear here as you log more tasks
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-sm rounded-2xl p-8 shadow-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                AI Insights & Recommendations
              </h2>
              <div className="grid gap-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      Productivity Patterns
                    </h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Based on your logging patterns, you're most productive in the {' '}
                      {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}.
                      Consider scheduling your most challenging tasks during these peak hours.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Target className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      Goal Setting
                    </h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Try breaking down larger tasks into smaller, manageable chunks. 
                      This can improve your completion rate and provide more frequent wins.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      Motivation Boost
                    </h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Celebrate your wins! You've completed {logs.filter(log => log.completed).length} tasks so far. 
                      Each completed task is a step towards your goals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
