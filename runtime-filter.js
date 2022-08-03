/**
 * It filter's log events on runtime
 * @param {Object} config
 * @param {Array} appenders
 * @returns
 */
function runtimeFilter(defaultLevel, appenders) {
  return (logEvent) => {
    if (logEvent["level"].isGreaterThanOrEqualTo(defaultLevel)) {
      appenders.forEach((appender) => {
        appender(logEvent);
      });
      return;
    }
  };
}

function configure(config, layouts, findAppender) {
  let defaultLevel = config["default"] || "INFO";

  let appenders = (config["appenders"] || []).map((appender) => {
    return findAppender(appender);
  });

  return runtimeFilter(defaultLevel, appenders);
}

module.exports.configure = configure;