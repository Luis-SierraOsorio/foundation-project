const { createLogger, format, transports } = require('winston');

const customFormat = format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message, stack }) => {
        return stack ? `${timestamp} [${level.toUpperCase()}] ${message}\n${stack}` :
            `${timestamp} [${level.toUpperCase()}] ${message}`;
    })
);

const logger = createLogger({
    level: 'info',
    format: customFormat,
    transports: [
        new (transports.Console)(),
        new (transports.File)({ filename: 'app.log' })
    ]
});


module.exports = { logger };