import _config from "./config/index.js"

const DATABASE_NAME = "blog_db"
const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: _config.env === "production" ? "none" : "lax"
    }
    
export  {
    DATABASE_NAME,
    options
}