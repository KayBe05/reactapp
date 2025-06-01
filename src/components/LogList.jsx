import React, { useState } from 'react';
import { 
  Calendar, Clock, Lightbulb, CheckCircle2, AlertCircle, Code2, 
  FileText, Users, BookOpen, Search, Target, Wrench, Ship, 
  Check, X, Edit2, Trash2, Timer, Tag, Filter
} from 'lucide-react';

const LogList = ({ logs, onUpdateLog, onDeleteLog }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [editingId, setEditingId] = useState(null);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category) => {
    const iconProps = { size: 16, className: "text-gray-600" };
    switch (category) {
      case 'development': return <Code2 {...iconProps} />;
      case 'debugging': return <AlertCircle {...iconProps} />;
      case 'testing': return <CheckCircle2 {...iconProps} />;
      case 'planning': return <Target {...iconProps} />;
      case 'learning': return <BookOpen {...iconProps} />;
      case 'meeting': return <Users {...iconProps} />;
      case 'research': return <Search {...iconProps} />;
      case 'documentation': return <FileText {...iconProps} />;
      case 'deployment': return <Ship {...iconProps} />;
      case 'refactoring': return <Wrench {...iconProps} />;
      default: return <Clock {...iconProps} />;
    }
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'tool': return '🛠️';
      case 'tip': return '💡';
      case 'insight': return '🧠';
      default: return '💡';
    }
  };

  const getSuggestionBg = (type, priority) => {
    const base = type === 'tool' ? 'bg-blue-50 border-l-4 border-blue-400' :
                 type === 'insight' ? 'bg-purple-50 border-l-4 border-purple-400' :
                 'bg-green-50 border-l-4 border-green-400';
    
    if (priority === 'high') {
      return `${base} ring-2 ring-orange-200`;
    }
    return base;
  };

  const handleToggleComplete = async (log) => {
    if (onUpdateLog) {
      await onUpdateLog(log.id, { completed: !log.completed });
    }
  };

  const handleDelete = async (logId) => {
    if (window.confirm('Are you sure you want to delete this log?')) {
      if (onDeleteLog) {
        await onDeleteLog(logId);
      }
    }
  };

  // Filter and search logic
  const filteredLogs = logs
    .filter(log => {
      if (filter === 'completed') return log.completed;
      if (filter === 'pending') return !log.completed;
      if (filter !== 'all') return log.category === filter;
      return true;
    })
    .filter(log => 
      log.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.tags && log.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.timestamp) - new Date(b.timestamp);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'category':
          return a.category.localeCompare(b.category);
        default: // newest
          return new Date(b.timestamp) - new Date(a.timestamp);
      }
    });

  const categories = [...new Set(logs.map(log => log.category))];

  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
        <h3 className="text-lg font-medium text-gray-600 mb-2">No logs yet</h3>
        <p className="text-gray-500">Start logging your development tasks to get AI-powered suggestions!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FileText className="mr-2 text-blue-600" size={24} />
            Your Development Log ({filteredLogs.length})
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search tasks, categories, tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
            </div>
            
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">By Priority</option>
              <option value="category">By Category</option>
            </select>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filter === 'all' 
                ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({logs.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filter === 'pending' 
                ? 'bg-orange-100 text-orange-800 border border-orange-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending ({logs.filter(log => !log.completed).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filter === 'completed' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Completed ({logs.filter(log => log.completed).length})
          </button>
          
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-3 py-1 rounded-full text-sm transition-colors capitalize flex items-center gap-1 ${
                filter === category 
                  ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getCategoryIcon(category)}
              {category} ({logs.filter(log => log.category === category).length})
            </button>
          ))}
        </div>
      </div>

      {/* Log entries */}
      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className={`bg-white rounded-lg shadow-md border transition-all duration-200 hover:shadow-lg ${
              log.completed ? 'opacity-75' : ''
            }`}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3 flex-1">
                  <button
                    onClick={() => handleToggleComplete(log)}
                    className={`mt-1 rounded-full p-1 transition-colors ${
                      log.completed
                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    <Check size={16} />
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryIcon(log.category)}
                      <span className="text-sm text-gray-600 capitalize font-medium">
                        {log.category}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(log.priority)}`}>
                        {log.priority.toUpperCase()}
                      </span>
                      {log.timeSpent && (
                        <span className="flex items-center text-xs text-gray-500">
                          <Timer size={12} className="mr-1" />
                          {log.timeSpent}min
                        </span>
                      )}
                    </div>
                    
                    <p className={`text-gray-800 leading-relaxed ${log.completed ? 'line-through' : ''}`}>
                      {log.task}
                    </p>
                    
                    {/* Tags */}
                    {log.tags && log.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {log.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                          >
                            <Tag size={10} className="mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      <Calendar size={12} className="mr-1" />
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleDelete(log.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete log"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* AI Suggestions */}
              {log.suggestions && log.suggestions.length > 0 && (
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center mb-3">
                    <Lightbulb className="text-yellow-500 mr-2" size={18} />
                    <h4 className="font-medium text-gray-800">AI Suggestions</h4>
                  </div>
                  
                  <div className="space-y-2">
                    {log.suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-md ${getSuggestionBg(suggestion.type, suggestion.priority)}`}
                      >
                        <div className="flex items-start">
                          <span className="text-lg mr-2 flex-shrink-0">
                            {getSuggestionIcon(suggestion.type)}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-medium text-sm text-gray-800">
                                {suggestion.title}
                              </h5>
                              {suggestion.priority === 'high' && (
                                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                                  High Priority
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {suggestion.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredLogs.length === 0 && logs.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Search className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No logs match your filters</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          <button
            onClick={() => {
              setFilter('all');
              setSearchTerm('');
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default LogList;
