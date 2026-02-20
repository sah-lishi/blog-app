import dotenv from "dotenv"

dotenv.config()

const _config = {
    port: process.env.PORT || 8000,
    mongoDBUrl: process.env.MONGODB_URL,
    env: process.env.NODE_ENV || "development",
    baseUrl: process.env.BASE_URL,
    refresh_token: process.env.REFRESH_TOKEN_SECRET,
    access_token: process.env.ACCESS_TOKEN_SECRET,
    refresh_token_expiry: process.env.REFRESH_TOKEN_EXPIRY,
    access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY,
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    }
}

export default _config