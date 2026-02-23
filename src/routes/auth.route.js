import express from "express"
import {forgotPassword, getCurrentUser, login, logout, refreshAccessToken, resetPassword, updatePassword, userRegistration} from '../controllers/auth.controller.js'
import { jwtVerify } from "../middlewares/auth.middleware.js"
import rateLimit from "express-rate-limit"

const router = express.Router()
const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many requests, try again after 15 minutes"
})
router.route("/register").post(authRateLimit, userRegistration)
router.route("/login").post(login)
router.route("/logout").post(jwtVerify, logout)
router.route("/refresh-accesstoken").post(refreshAccessToken)
router.route("/update-password").patch(jwtVerify, updatePassword)
router.route("/get-current-user").get(jwtVerify, getCurrentUser)
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password/:resetToken").patch(resetPassword)

export default router