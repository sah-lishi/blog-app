import winston from "winston";
import _config from "../config/index.js";

const { combine, timestamp, json, colorize, simple } = winston.format;
const isProd = _config.env === "production";

const transports = [
    new winston.transports.Console({
        format: isProd ? combine(timestamp(), json()) : combine(colorize(), simple())
    })
];

if (!isProd) {
    transports.push(new winston.transports.File({ filename: "logs/error.log", level: "error" }));
    transports.push(new winston.transports.File({ filename: "logs/access.log" }));
}

const logger = winston.createLogger({
    level: "info",
    format: combine(timestamp(), json()),
    transports,
    exceptionHandlers: [new winston.transports.Console()],
    rejectionHandlers: [new winston.transports.Console()]
});

export default logger;