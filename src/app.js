import express from "express"
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
import blogRouter from "./routes/blog.route.js"
import rateLimit from "express-rate-limit"
import cors from "cors"
import _config from "./config/index.js"
import morgan from "morgan"
import requestLogger from "./middlewares/requestLogger.middleware.js"
import logger from "./utils/logger.js"

const app = express()
app.set("trust proxy", 1)
app.use(cors({
    origin: _config.client_url,
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"))
app.use(requestLogger)
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max:50
}))
app.use("/api/users", authRouter)
app.use("/api/blogs", blogRouter)

// global error middleware
app.use((err, req, res, next) => {
    logger.error({
        message: err.message,
        stack: err.stack
    })
    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal server error",
        stack: _config.env === "production" ? undefined : err.stack
    })
})

export default app