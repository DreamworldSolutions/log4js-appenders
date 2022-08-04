/**
 * It filter's log events on runtime
 * It filter's log events with default level, categoryFilterFn and contextFilterFn and pass to other appenders if any of
 *  that returns true.
 * @param {Object} config
 * @param {Function} categoryFilterFn
 * @param {Function} contextFilterFn
 * @param {Array} appenders
 * @returns
 */
 function runtimeFilter(defaultLevel, categoryFilterFn, contextFilterFn, appenders) {
  return (logEvent) => {
    let { categoryName, level, context } = logEvent;

    if (level.isGreaterThanOrEqualTo(defaultLevel) || 
    categoryFilterFn(categoryName, level["levelStr"]) || 
    contextFilterFn(context, level["levelStr"])) {
      appenders.forEach((appender) => {
        appender(logEvent);
      });
    }
  };
}

function configure(config, layouts, findAppender) {
  let defaultLevel = config["default"] || "INFO";
  let categoryFilterFn = config["category"] || function() { return false; };
  let contextFilterFn = config["context"] || function() { return false; };
  let appenders = (config["appenders"] || []).map((appender) => {
    return findAppender(appender);
  });

  return runtimeFilter(defaultLevel, categoryFilterFn, contextFilterFn, appenders);
}

module.exports.configure = configure;