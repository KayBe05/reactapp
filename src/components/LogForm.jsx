import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, Clock, Tag, Zap, Sparkles, Code2, AlertCircle, 
  CheckCircle2, Target, BookOpen, Users, Search, FileText, 
  Ship, Wrench, Lightbulb, ArrowRight, Magic, X, 
  Timer, Hash, ChevronDown, ChevronUp, Wand2
} from 'lucide-react';

const LogForm = ({ onSubmit, isLoading }) => {
  const [task, setTask] = useState('');
  const [category, setCategory] = useState('development');
  const [priority, setPriority] = useState('medium');
  const [timeSpent, setTimeSpent] = useState('');
  const [tags, setTags] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isFormFocused, setIsFormFocused] = useState(false);
  const [showQuickFill, setShowQuickFill] = useState(false);
  const [taskLength, setTaskLength] = useState(0);
  const textareaRef = useRef(null);

  // Auto-focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

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
      
      // Reset form with animation
      setTask('');
      setTimeSpent('');
      setTags('');
      setTaskLength(0);
      setShowQuickFill(false);
      setShowAdvanced(false);
      
      // Focus back to textarea
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  };

  const handleTaskChange = (e) => {
    const value = e.target.value;
    setTask(value);
    setTaskLength(value.length);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
    // Show quick fill on empty task
    if (e.key === '/' && task === '') {
      e.preventDefault();
      setShowQuickFill(true);
    }
    // Hide quick fill on escape
    if (e.key === 'Escape') {
      setShowQuickFill(false);
    }
  };

  const quickFillExamples = [
    { 
      text: "Fixed critical authentication bug in login component", 
      category: "debugging", 
      priority: "high",
      icon: <AlertCircle size={16} className="text-red-500" />,
      tags: ["auth", "security", "hotfix"],
      time: "120"
    },
    { 
      text: "Implemented responsive user dashboard with analytics charts", 
      category: "development", 
      priority: "medium",
      icon: <Code2 size={16} className="text-blue-500" />,
      tags: ["react", "ui", "charts"],
      time: "180"
    },
    { 
      text: "Wrote comprehensive unit tests for API endpoints", 
      category: "testing", 
      priority: "medium",
      icon: <CheckCircle2 size={16} className="text-green-500" />,
      tags: ["testing", "api", "coverage"],
      time: "90"
    },
    { 
      text: "Optimized database queries for 50% performance improvement", 
      category: "development", 
      priority: "high",
      icon: <Target size={16} className="text-purple-500" />,
      tags: ["performance", "database", "optimization"],
      time: "240"
    },
    { 
      text: "Researched and documented new React 18 features", 
      category: "learning", 
      priority: "low",
      icon: <BookOpen size={16} className="text-yellow-500" />,
      tags: ["react", "research", "documentation"],
      time: "60"
    },
    { 
      text: "Led team standup and sprint planning session", 
      category: "meeting", 
      priority: "medium",
      icon: <Users size={16} className="text-indigo-500" />,
      tags: ["agile", "planning", "teamwork"],
      time: "45"
    }
  ];

  const handleQuickFill = (example) => {
    setTask(example.text);
    setTaskLength(example.text.length);
    setCategory(example.category);
    setPriority(example.priority);
    if (example.tags) {
      setTags(example.tags.join(', '));
    }
    if (example.time) {
      setTimeSpent(example.time);
    }
    setShowQuickFill(false);
    setShowAdvanced(true);
    textareaRef.current?.focus();
  };

  const categoryOptions = [
    { value: 'development', label: '🚀 Development', icon: <Code2 size={16} />, color: 'from-blue-400 to-blue-600' },
    { value: 'debugging', label: '🐛 Debugging', icon: <AlertCircle size={16} />, color: 'from-red-400 to-red-600' },
    { value: 'testing', label: '✅ Testing', icon: <CheckCircle2 size={16} />, color: 'from-green-400 to-green-600' },
    { value: 'planning', label: '📋 Planning', icon: <Target size={16} />, color: 'from-purple-400 to-purple-600' },
    { value: 'learning', label: '📚 Learning', icon: <BookOpen size={16} />, color: 'from-yellow-400 to-yellow-600' },
    { value: 'meeting', label: '👥 Meeting', icon: <Users size={16} />, color: 'from-indigo-400 to-indigo-600' },
    { value: 'research', label: '🔍 Research', icon: <Search size={16} />, color: 'from-cyan-400 to-cyan-600' },
    { value: 'documentation', label: '📝 Documentation', icon: <FileText size={16} />, color: 'from-orange-400 to-orange-600' },
    { value: 'deployment', label: '🚢 Deployment', icon: <Ship size={16} />, color: 'from-teal-400 to-teal-600' },
    { value: 'refactoring', label: '🔧 Refactoring', icon: <Wrench size={16} />, color: 'from-pink-400 to-pink-600' },
  ];

  const priorityOptions = [
    { value: 'low', label: '🟢 Low Priority', color: 'from-green-400 to-green-600', bg: 'bg-green-50 border-green-200' },
    { value: 'medium', label: '🟡 Medium Priority', color: 'from-yellow-400 to-yellow-600', bg: 'bg-yellow-50 border-yellow-200' },
    { value: 'high', label: '🔴 High Priority', color: 'from-red-400 to-red-600', bg: 'bg-red-50 border-red-200' }
  ];

  const selectedCategory = categoryOptions.find(cat => cat.value === category);
  const selectedPriority = priorityOptions.find(pri => pri.value === priority);

  return (
    <div className={`card-glass p-8 mb-8 border-2 transition-all duration-500 ${
      isFormFocused ? 'border-blue-300 shadow-2xl scale-[1.02] animate-glow' : 'border-white/50'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="relative">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-float">
              <Plus className="text-white" size={24} />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-bold gradient-text">Log Your Task</h2>
            <p className="text-gray-600 text-sm">Describe what you accomplished today</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {taskLength > 0 && (
            <div className={`text-xs px-2 py-1 rounded-full transition-colors ${
              taskLength > 200 ? 'bg-red-100 text-red-700' : 
              taskLength > 100 ? 'bg-yellow-100 text-yellow-700' : 
              'bg-green-100 text-green-700'
            }`}>
              {taskLength} chars
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowQuickFill(!showQuickFill)}
            className="flex items-center px-3 py-2 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
            title="Quick fill examples"
          >
            <Wand2 size={16} className="mr-1" />
            Quick Fill
          </button>
        </div>
      </div>

      {/* Quick Fill Examples */}
      {showQuickFill && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 animate-slideInDown">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-800 flex items-center">
              <Magic size={16} className="mr-2 text-purple-600" />
              Quick Fill Examples
            </h3>
            <button
              onClick={() => setShowQuickFill(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {quickFillExamples.map((example, index) => (
              <button
                key={index}
                onClick={() => handleQuickFill(example)}
                className="text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {example.icon}
                    <span className="text-xs font-medium text-gray-600 capitalize">
                      {example.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      example.priority === 'high' ? 'bg-red-100 text-red-700' :
                      example.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {example.priority}
                    </span>
                  </div>
                  <ArrowRight size={14} className="text-gray-400 group-hover:text-purple-600 transition-colors" />
                </div>
                <p className="text-sm text-gray-700 leading-snug">
                  {example.text}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex flex-wrap gap-1">
                    {example.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span key={tagIndex} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                    {example.tags.length > 2 && (
                      <span className="text-xs text-gray-500">+{example.tags.length - 2}</span>
                    )}
                  </div>
                  {example.time && (
                    <span className="text-xs text-gray-500 flex items-center">
                      <Timer size={10} className="mr-1" />
                      {example.time}min
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
          <div className="mt-3 text-xs text-gray-500 text-center">
            Press <kbd className="px-2 py-1 bg-white rounded border">/</kbd> in the task field for quick access
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Task Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <FileText size={16} className="mr-2" />
            What did you work on? *
          </label>
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={task}
              onChange={handleTaskChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFormFocused(true)}
              onBlur={() => setIsFormFocused(false)}
              placeholder="Describe your accomplishment in detail... (Press Ctrl/Cmd + Enter to submit, / for quick fill)"
              className="form-input w-full min-h-[120px] resize-none pr-16 text-gray-800 placeholder-gray-400 transition-all duration-300 focus:shadow-lg"
              required
            />
            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              <span className={`text-xs transition-colors ${
                taskLength > 200 ? 'text-red-500' : 
                taskLength > 100 ? 'text-yellow-500' : 
                'text-gray-400'
              }`}>
                {taskLength}
              </span>
              {task && (
                <button
                  type="button"
                  onClick={() => {
                    setTask('');
                    setTaskLength(0);
                    textareaRef.current?.focus();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category and Priority Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Target size={16} className="mr-2" />
              Category
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select w-full appearance-none"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>
            {selectedCategory && (
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${selectedCategory.color} mr-2`}></div>
                Currently: {selectedCategory.label}
              </div>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Zap size={16} className="mr-2" />
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPriority(option.value)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                    priority === option.value
                      ? `${option.bg} border-current transform scale-105 shadow-md`
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${option.color} mx-auto mb-1`}></div>
                  {option.value.charAt(0).toUpperCase() + option.value.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Options Toggle */}
        <div className="border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="flex items-center text-sm font-medium text-gray-700">
              <Sparkles size={16} className="mr-2" />
              Advanced Options
            </span>
            {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showAdvanced && (
            <div className="mt-4 space-y-4 animate-slideInDown">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Time Spent */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Clock size={16} className="mr-2" />
                    Time Spent (minutes)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={timeSpent}
                      onChange={(e) => setTimeSpent(e.target.value)}
                      placeholder="e.g., 120"
                      min="1"
                      max="999"
                      className="form-input w-full pr-12"
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <span className="text-sm text-gray-400">min</span>
                    </div>
                  </div>
                  {timeSpent && (
                    <div className="mt-1 text-xs text-gray-500">
                      ≈ {Math.round(timeSpent / 60 * 10) / 10} hours
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Hash size={16} className="mr-2" />
                    Tags
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="react, ui, performance"
                    className="form-input w-full"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    Separate tags with commas
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-gray-500">
            Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl/Cmd + Enter</kbd> to submit quickly
          </div>
          
          <button
            type="submit"
            disabled={!task.trim() || isLoading}
            className={`btn-primary flex items-center px-8 py-3 text-base font-semibold rounded-lg transition-all duration-300 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover-lift hover:shadow-xl'
            }`}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Plus size={20} className="mr-2" />
                Log Task
                <ArrowRight size={16} className="ml-2" />
              </>
            )}
          </button>
        </div>

        {/* Form Helper */}
        {task.trim() && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-fadeIn">
            <div className="flex items-start">
              <Lightbulb size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Ready to submit!</p>
                <p>Your task will be analyzed by AI to provide personalized suggestions and insights.</p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default LogForm;
