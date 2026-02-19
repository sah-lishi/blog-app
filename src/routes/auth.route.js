import express from "express"
import {forgotPassword, getCurrentUser, login, logout, refreshAccessToken, resetPassword, updatePassword, userRegistration} from '../controllers/auth.controller.js'
import { jwtVerify } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.route("/register").post(userRegistration)
router.route("/login").post(login)
router.route("/logout").post(jwtVerify, logout)
router.route("/refresh-accesstoken").post(jwtVerify, refreshAccessToken)
router.route("/update-password").patch(jwtVerify, updatePassword)
router.route("/get-current-user").get(jwtVerify, getCurrentUser)
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password/:resetToken").patch(resetPassword)

export default router