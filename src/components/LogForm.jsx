import React, { useState, useRef } from 'react';
import { Plus, Clock, Tag, Zap } from 'lucide-react';

const LogForm = ({ onSubmit, isLoading }) => {
  const [task, setTask] = useState('');
  const [category, setCategory] = useState('development');
  const [priority, setPriority] = useState('medium');
  const [timeSpent, setTimeSpent] = useState('');
  const [tags, setTags] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.trim()) {
      const tagArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      onSubmit({
        task: task.trim(),
        category,
        priority,
        timeSpent: timeSpent ? parseInt(timeSpent) : null,
        tags: tagArray
      });
      
      // Reset form
      setTask('');
      setTimeSpent('');
      setTags('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const quickFillExamples = [
    { text: "Fixed authentication bug in login component", category: "debugging", priority: "high" },
    { text: "Implemented user dashboard with charts and analytics", category: "development", priority: "medium" },
    { text: "Wrote unit tests for API endpoints", category: "testing", priority: "medium" },
    { text: "Refactored database queries for better performance", category: "development", priority: "high" },
  ];

  const handleQuickFill = (example) => {
    setTask(example.text);
    setCategory(example.category);
    setPriority(example.priority);
    textareaRef.current?.focus();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Plus className="text-blue-600 mr-2" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">Log Your Task</h2>
        </div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          <Zap size={16} className="mr-1" />
          {showAdvanced ? 'Simple' : 'Advanced'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Task Description
            <span className="text-xs text-gray-500 ml-2">(Ctrl/Cmd + Enter to submit)</span>
          </label>
          <textarea
            ref={textareaRef}
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you worked on today... Be specific for better AI suggestions!"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
            rows="3"
            required
          />
          
          {/* Character count */}
          <div className="text-right text-xs text-gray-500 mt-1">
            {task.length}/500 characters
          </div>
        </div>

        {/* Quick fill examples */}
        {!task && (
          <div className="border-t border-gray-100 pt-3">
            <p className="text-xs text-gray-600 mb-2">Quick examples:</p>
            <div className="flex flex-wrap gap-2">
              {quickFillExamples.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleQuickFill(example)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors duration-200"
                >
                  {example.text.slice(0, 30)}...
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="development">🚀 Development</option>
              <option value="debugging">🐛 Debugging</option>
              <option value="testing">✅ Testing</option>
              <option value="planning">📋 Planning</option>
              <option value="learning">📚 Learning</option>
              <option value="meeting">👥 Meeting</option>
              <option value="research">🔍 Research</option>
              <option value="documentation">📝 Documentation</option>
              <option value="deployment">🚢 Deployment</option>
              <option value="refactoring">🔧 Refactoring</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="low">🟢 Low Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="high">🔴 High Priority</option>
            </select>
          </div>
        </div>

        {/* Advanced options */}
        {showAdvanced && (
          <div className="border-t border-gray-100 pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock size={16} className="inline mr-1" />
                  Time Spent (minutes)
                </label>
                <input
                  type="number"
                  value={timeSpent}
                  onChange={(e) => setTimeSpent(e.target.value)}
                  placeholder="e.g., 45"
                  min="1"
                  max="480"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag size={16} className="inline mr-1" />
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g., react, performance, bug-fix"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !task.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating AI Suggestions...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Plus size={18} className="mr-2" />
              Log Task & Get AI Suggestions
            </div>
          )}
        </button>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-sm text-blue-800">
            <strong>💡 Pro tip:</strong> Be specific in your description to get better AI suggestions. 
            Mention technologies, challenges faced, or outcomes achieved.
          </p>
        </div>
      </form>
    </div>
  );
};

export default LogForm;
