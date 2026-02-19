import express from "express"
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser"

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use("/api/users", authRouter)

// global error middleware
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message
    })
})

export default app