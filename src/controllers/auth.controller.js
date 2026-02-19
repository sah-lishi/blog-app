import { options } from "../constants.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import crypto from "crypto"

const userRegistration = asyncHandler(async (req, res) => {
    const {firstname, lastname, username, email, password} = req.body
    if([firstname, username, email, password].some((val) => !val || val.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const userExist = await User.findOne({
        $or: [{email}, {username}]
    })

    if(userExist) {
        throw new ApiError(409, "User with this username or email already exists")
    }

    const newUser = await User.create({
        firstname,
        lastname: lastname || "",
        username,
        email,
        password, 
    })

    const accessToken = newUser.generateAccessToken()
    const refreshToken = newUser.generateRefreshToken()
    
    newUser.refreshToken  = refreshToken
    await newUser.save({validateBeforeSave: false})

    const user = await User.findById(newUser._id).select("-password -refreshToken")

    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(user, "User registered successfully"))
})

const login = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body

    if((!username || !username.trim()) && (!email || !email.trim()))
        throw new ApiError(400, "Email or username is required")
    if(!password || password.trim() === "")
        throw new ApiError(400, "Password is required")

    const existingUser = await User.findOne({
        $or: [{username}, {email}]
    }).select("+password")

    if(!existingUser)
        throw new ApiError(401, "Invalid credentials")

    const isPasswordValid = await existingUser.checkPassword(password)
    if(!isPasswordValid)
        throw new ApiError(400, "Password is incorrect")
    
    const accessToken = existingUser.generateAccessToken()
    const refreshToken = existingUser.generateRefreshToken()

    existingUser.refreshToken = refreshToken
    await existingUser.save({validateBeforeSave: false})

    const user = await User.findById(existingUser._id).select("-password -refreshToken")

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(user, "User logged in successfully"))
})

const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user?._id,
        { $unset: {refreshToken: 1}}
    )

    return res.clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new ApiResponse({}, "Logged out successfully"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const refershToken = req.cookies?.refreshToken
    const user = await User.findOne({refreshToken: refershToken})
    if(!user)
        throw new ApiError()
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse({}, "Tokens generated"))
})

const updatePassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword, confirmPassword} = req.body

    if([oldPassword, newPassword, confirmPassword].some(val => !val || val.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }
    if(newPassword !== confirmPassword)
        throw new ApiError(400, "Password incorrect")
// console.log("password fields validation done");

    const user = await User.findById(req.user?._id).select("+password")
    // console.log(user);
    
    const oldPassConfirm = await user.checkPassword(oldPassword)
    // console.log("Old pass is correct");
    if(!oldPassConfirm)
        return new ApiError(400, "Password is incorrect")
    
    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res.status(200).json(new ApiResponse({}, "Password updated successfully"))
})

// const updateCredentials

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(req.user, "Current user fetched"))
})

const forgotPassword = asyncHandler(async (req, res) => {
    const {email} = req.body
    if(!email)
        throw new ApiError(400, "Email is required")

    const user = await User.findOne({email})
    if(!user)
        throw new ApiError(400, "Invalid credential")

    const resetToken = user.generatePasswordResetToken()
    await user.save({validateBeforeSave: false})
    console.log((resetToken));
    
    const url = `${process.env.BASE_URL}/api/users/reset-password/${resetToken}`
    return res.status(200).json(new ApiResponse({url}, "Go to this url to reset password"))
})

const resetPassword = asyncHandler(async(req, res) => {
    const {resetToken} = req.params
    const {newPassword} = req.body

    if(!newPassword)
        throw new ApiError(400, "New password is required")

    const hashToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    console.log(hashToken);
    
    const user = await User.findOne({
        resetPasswordToken: hashToken,
        resetPasswordExpiry: {$gt: Date.now()}
    })
console.log(resetToken);

    if(!user)
        throw new ApiError(400, "Reset Password Token is invalid")
    user.password = newPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpiry = undefined
    await user.save({validateBeforeSave: false})

    return res.status(200).json(new ApiResponse({}, "Password reset successful"))
})

export {
    userRegistration,
    login,
    logout,
    refreshAccessToken,
    updatePassword,
    getCurrentUser,
    forgotPassword,
    resetPassword
}