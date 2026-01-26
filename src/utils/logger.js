const format = (lvl, msg) => `[${new Date().toISOString()}] ${lvl}: ${msg}`;

export const logger = {
  info: (msg, ...args) => console.log(format("INFO", msg), ...args),
  error: (msg, ...args) => console.error(format("ERROR", msg), ...args),
  warn: (msg, ...args) => console.warn(format("WARN", msg), ...args),
  debug: (msg, ...args) => {
    if (process.env.NODE_ENV !== "production") {
      console.debug(format("DEBUG", msg), ...args);
    }
  },
};

export default logger;
