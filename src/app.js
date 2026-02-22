import express from "express"
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
import blogRouter from "./routes/blog.route.js"

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use("/api/users", authRouter)
app.use("/api/blogs", blogRouter)

// global error middleware
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message
    })
})

export default app