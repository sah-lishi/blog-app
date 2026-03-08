import jwt from "jsonwebtoken"
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import User from "../models/user.model.js"
import _config from "../config/index.js"
// protected route
const jwtVerify = asyncHandler(async (req, res, next) => {
    try {
        if(!req.cookies || !req.cookies.accessToken)
            throw new ApiError(400, "User not logged in")
        const token = req.cookies?.accessToken 
        if(!token)
            throw new ApiError(401, "Unauthorized request")
    
        const decodedToken = jwt.verify(token, _config.access_token)
    
        const user = await User.findById(decodedToken._id).select("-password -refreshToken")
        if(!user)
            throw new ApiError(401, "User not found")
    
        req.user = user
        next()
    } catch (error) {
        if(error.name === "TokenExpiredError")
            throw new ApiError(401, "Token expired")
        if(error.name === "JsonWebTokenError")
            throw new ApiError(401, "Invalid token")
    }
})

export {
    jwtVerify
}