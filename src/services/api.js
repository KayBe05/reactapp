// Enhanced API service with local storage and advanced AI suggestions
// Replace this with actual API calls using axios when you have a backend

const STORAGE_KEY = 'devdiary_logs';

// Enhanced AI suggestion generator with more sophisticated analysis
const generateAISuggestions = (task, category, priority, previousLogs = []) => {
  const taskLower = task.toLowerCase();
  const suggestions = [];
  
  // Context-aware suggestions based on previous logs
  const recentTasks = previousLogs.slice(0, 5).map(log => log.task.toLowerCase());
  const frequentCategories = previousLogs.reduce((acc, log) => {
    acc[log.category] = (acc[log.category] || 0) + 1;
    return acc;
  }, {});
  
  // Pattern recognition for recurring issues
  const hasRecentSimilarTask = recentTasks.some(t => 
    t.includes(taskLower.slice(0, 10)) || taskLower.includes(t.slice(0, 10))
  );
  
  if (hasRecentSimilarTask) {
    suggestions.push({
      type: 'insight',
      title: 'Pattern Detected',
      content: 'You\'ve worked on similar tasks recently. Consider creating a checklist or template to streamline this work.',
      priority: 'high'
    });
  }
  
  // Category-specific suggestions
  if (taskLower.includes('debug') || taskLower.includes('bug') || taskLower.includes('error') || category === 'debugging') {
    suggestions.push({
      type: 'tool',
      title: 'Advanced Debugging',
      content: 'Use browser DevTools Sources tab for breakpoints, or try VS Code\'s integrated debugger for better inspection.',
      priority: 'medium'
    });
    suggestions.push({
      type: 'tip',
      title: 'Debugging Methodology',
      content: 'Follow the scientific method: hypothesize, test, observe, repeat. Document your findings.',
      priority: 'high'
    });
    
    if (taskLower.includes('frontend') || taskLower.includes('ui')) {
      suggestions.push({
        type: 'tool',
        title: 'Frontend Debugging',
        content: 'Try React Developer Tools profiler or Vue.js devtools for component-specific issues.',
        priority: 'medium'
      });
    }
  }
  
  if (taskLower.includes('test') || taskLower.includes('testing') || category === 'testing') {
    suggestions.push({
      type: 'tool',
      title: 'Testing Strategy',
      content: 'Consider the testing pyramid: more unit tests, fewer integration tests, minimal e2e tests.',
      priority: 'high'
    });
    suggestions.push({
      type: 'tip',
      title: 'Test-Driven Development',
      content: 'Write failing tests first, then implement code to make them pass for better design.',
      priority: 'medium'
    });
    
    if (taskLower.includes('api') || taskLower.includes('backend')) {
      suggestions.push({
        type: 'tool',
        title: 'API Testing',
        content: 'Use Postman collections or Newman for automated API testing in CI/CD pipelines.',
        priority: 'medium'
      });
    }
  }
  
  if (taskLower.includes('performance') || taskLower.includes('optimize') || taskLower.includes('slow')) {
    suggestions.push({
      type: 'tool',
      title: 'Performance Analysis',
      content: 'Use Chrome DevTools Performance tab and Lighthouse CI for comprehensive performance auditing.',
      priority: 'high'
    });
    suggestions.push({
      type: 'tip',
      title: 'Performance Budget',
      content: 'Set performance budgets: <3s load time, <100ms response time, <50KB critical resources.',
      priority: 'high'
    });
    suggestions.push({
      type: 'insight',
      title: 'Optimization Priority',
      content: 'Focus on Core Web Vitals: LCP, FID, and CLS for user experience improvements.',
      priority: 'medium'
    });
  }
  
  if (taskLower.includes('api') || taskLower.includes('backend') || taskLower.includes('server')) {
    suggestions.push({
      type: 'tool',
      title: 'API Development',
      content: 'Implement OpenAPI/Swagger for documentation and use tools like Insomnia or Thunder Client.',
      priority: 'medium'
    });
    suggestions.push({
      type: 'tip',
      title: 'API Security',
      content: 'Implement rate limiting, input validation, authentication, and CORS properly.',
      priority: 'high'
    });
  }
  
  if (taskLower.includes('react') || taskLower.includes('component') || taskLower.includes('jsx')) {
    suggestions.push({
      type: 'tool',
      title: 'React Development',
      content: 'Use React DevTools Profiler and consider React.memo, useMemo, and useCallback for optimization.',
      priority: 'medium'
    });
    suggestions.push({
      type: 'tip',
      title: 'React Best Practices',
      content: 'Follow the single responsibility principle and keep components under 200 lines.',
      priority: 'medium'
    });
  }
  
  if (taskLower.includes('css') || taskLower.includes('style') || taskLower.includes('design')) {
    suggestions.push({
      type: 'tool',
      title: 'CSS Development',
      content: 'Use CSS custom properties for themes and consider CSS Grid with Flexbox for robust layouts.',
      priority: 'medium'
    });
    suggestions.push({
      type: 'tip',
      title: 'Design System',
      content: 'Create a consistent spacing scale (4px base) and color palette for better design consistency.',
      priority: 'medium'
    });
  }
  
  if (taskLower.includes('database') || taskLower.includes('sql') || taskLower.includes('query')) {
    suggestions.push({
      type: 'tool',
      title: 'Database Optimization',
      content: 'Use EXPLAIN ANALYZE for query optimization and consider indexing frequently queried columns.',
      priority: 'high'
    });
    suggestions.push({
      type: 'tip',
      title: 'Database Design',
      content: 'Normalize to 3NF for consistency, denormalize carefully for performance where needed.',
      priority: 'medium'
    });
  }
  
  // Priority-based suggestions
  if (priority === 'high') {
    suggestions.push({
      type: 'insight',
      title: 'High Priority Task',
      content: 'Break this into smaller subtasks and tackle the riskiest parts first. Consider pair programming.',
      priority: 'high'
    });
  }
  
  // Time-based suggestions
  const currentHour = new Date().getHours();
  if (currentHour >= 18 || currentHour <= 6) {
    suggestions.push({
      type: 'tip',
      title: 'Late Work Session',
      content: 'Take regular breaks and ensure good lighting. Consider tackling easier tasks when tired.',
      priority: 'medium'
    });
  }
  
  // Frequency-based suggestions
  const mostFrequentCategory = Object.keys(frequentCategories).reduce((a, b) => 
    frequentCategories[a] > frequentCategories[b] ? a : b, 'development'
  );
  
  if (category !== mostFrequentCategory && frequentCategories[mostFrequentCategory] > 3) {
    suggestions.push({
      type: 'insight',
      title: 'Category Shift',
      content: `You usually work on ${mostFrequentCategory}. This change in focus might benefit from extra planning.`,
      priority: 'low'
    });
  }
  
  // Default suggestions if no specific keywords found
  if (suggestions.length === 0) {
    suggestions.push({
      type: 'tip',
      title: 'General Productivity',
      content: 'Use the Pomodoro Technique: 25 minutes focused work, 5 minute break for sustained productivity.',
      priority: 'medium'
    });
    suggestions.push({
      type: 'tool',
      title: 'Code Quality',
      content: 'Set up ESLint, Prettier, and Husky pre-commit hooks for consistent code quality.',
      priority: 'medium'
    });
    suggestions.push({
      type: 'insight',
      title: 'Documentation',
      content: 'Document your decisions and code. Your future self will thank you.',
      priority: 'low'
    });
  }
  
  // Limit suggestions to avoid overwhelming
  return suggestions.slice(0, 4);
};

// Local storage utilities
const saveToStorage = (logs) => {
  try {
    const data = {
      logs,
      lastUpdated: new Date().toISOString(),
      version: '2.0'
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return parsed.logs || [];
    }
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
  }
  return [];
};

// Enhanced API functions
export const submitLog = async (logData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const existingLogs = loadFromStorage();
  
  // Generate enhanced AI suggestions
  const suggestions = generateAISuggestions(
    logData.task, 
    logData.category, 
    logData.priority, 
    existingLogs
  );
  
  const newLog = {
    id: Date.now(),
    ...logData,
    suggestions,
    timestamp: new Date().toISOString(),
    completed: false,
    timeSpent: logData.timeSpent || null,
    tags: logData.tags || []
  };
  
  const updatedLogs = [newLog, ...existingLogs];
  saveToStorage(updatedLogs);
  
  return newLog;
};

export const getLogs = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return loadFromStorage();
};

export const updateLog = async (logId, updates) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const logs = loadFromStorage();
  const updatedLogs = logs.map(log => 
    log.id === logId ? { ...log, ...updates } : log
  );
  
  saveToStorage(updatedLogs);
  return updatedLogs.find(log => log.id === logId);
};

export const deleteLog = async (logId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const logs = loadFromStorage();
  const filteredLogs = logs.filter(log => log.id !== logId);
  saveToStorage(filteredLogs);
  
  return filteredLogs;
};

export const getAnalytics = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const logs = loadFromStorage();
  
  if (logs.length === 0) {
    return {
      totalTasks: 0,
      completedTasks: 0,
      averageTasksPerDay: 0,
      productivityTrend: [],
      categoryDistribution: {},
      priorityDistribution: {},
      suggestions: []
    };
  }
  
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const recentLogs = logs.filter(log => new Date(log.timestamp) >= thirtyDaysAgo);
  
  const completedTasks = logs.filter(log => log.completed).length;
  const categoryDistribution = logs.reduce((acc, log) => {
    acc[log.category] = (acc[log.category] || 0) + 1;
    return acc;
  }, {});
  
  const priorityDistribution = logs.reduce((acc, log) => {
    acc[log.priority] = (acc[log.priority] || 0) + 1;
    return acc;
  }, {});
  
  // Generate productivity insights
  const insights = [];
  
  const highPriorityCompleted = logs.filter(log => log.priority === 'high' && log.completed).length;
  const highPriorityTotal = logs.filter(log => log.priority === 'high').length;
  
  if (highPriorityTotal > 0) {
    const completion = (highPriorityCompleted / highPriorityTotal) * 100;
    insights.push({
      type: completion > 70 ? 'success' : 'warning',
      title: 'High Priority Completion',
      content: `You've completed ${completion.toFixed(1)}% of high-priority tasks.`,
      priority: 'high'
    });
  }
  
  return {
    totalTasks: logs.length,
    completedTasks,
    averageTasksPerDay: recentLogs.length / 30,
    categoryDistribution,
    priorityDistribution,
    insights,
    recentActivity: recentLogs.length
  };
};

// Export/Import functionality
export const exportData = () => {
  const data = {
    logs: loadFromStorage(),
    exportDate: new Date().toISOString(),
    version: '2.0'
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `devdiary-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.logs && Array.isArray(data.logs)) {
          saveToStorage(data.logs);
          resolve(data.logs);
        } else {
          reject(new Error('Invalid file format'));
        }
      } catch (error) {
        reject(new Error('Failed to parse file'));
      }
    };
    reader.readAsText(file);
  });
};
