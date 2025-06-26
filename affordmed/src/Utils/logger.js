export function logMiddleware(action, data) {
  if (!window.__LOGGING_SERVICE__) {
    window.__LOGGING_SERVICE__ = [];
  }

  const logEntry = {
    timestamp: new Date().toISOString(),
    action,
    data
  };

  window.__LOGGING_SERVICE__.push(logEntry);
}