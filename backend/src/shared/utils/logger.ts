import { createLogger, format, transports } from 'winston';

const logLevel = process.env.LOG_LEVEL || 'info';

/**
 * Logger instance sử dụng Winston
 * Log format: timestamp - level - message - metadata
 */
const logger = createLogger({
  level: logLevel,
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  defaultMeta: { service: 'coursera-api' },
  transports: [
    // Log tất cả lỗi vào file errors.log
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Log mọi thứ vào file combined.log
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Nếu không phải production, cũng log ra console
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        }),
      ),
    }),
  );
}

export default logger;
