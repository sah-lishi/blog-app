import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import _config from "../config/index.js";
import User from "../models/user.model.js";

const optionalAuth = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken
        if(!token)
            return next()

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

export default optionalAuth