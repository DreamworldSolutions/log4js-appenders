/**
 * It appends context details into log events and pass to the other given appenders.
 * @param {Array} appenders
 * @returns 
 */
function contextAppender(appenders) {
  return (logEvent) => {
    let { data } = logEvent;

    if (
      typeof data[data.length - 1] === "object" &&
      !Array.isArray(data[data.length - 1]) &&
      data[data.length - 1].type === "context"
    ) {
      let context = data[data.length - 1];

      //Remove type field from context data
      delete context["type"];

      //Remove context from data
      logEvent["data"] = data.slice(0, data.length - 1);

      //Add context data in context field
      logEvent["context"] = { ...logEvent.context, ...context };
    }

    appenders.forEach((appender) => {
      appender(logEvent);
    });
  };
}

function configure(config, layouts, findAppender) {
  let appenders = (config['appenders'] || []).map((appender) => {
    return findAppender(appender);
  });

  return contextAppender(appenders);
}

module.exports.configure = configure;