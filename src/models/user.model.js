import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import validator from 'validator'
import crypto from "crypto"
import _config from "../config/index.js";

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, "Firstname is required"],
        trim: true
    },
    lastname: {
        type: String,
        trim: true
    },
    username: {
        type: String,
        required: [true, "username is required for login"],
        trim: true,
        minlength: 3,
        maxlength: 18,
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        required: [true, "email is required for login"],
        trim: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Provide a valid email"]
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    refreshToken: {
        type: String,
        select: false
    },
    resetPasswordToken: {
        type: String,
        select: false
    },
    resetPasswordExpiry: {
        type: Date,
        select: false
    }
}, 
{
    timestamps: true, 
    toJSON: {virtuals: true}
})

userSchema.pre("save", async function() {
    if(!this.isModified("password"))
        return 
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.checkPassword = async function(inputPassword) {
    return await bcrypt.compare(inputPassword, this.password)
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            role: this.role
        },
        _config.access_token,
        {
            expiresIn: _config.access_token_expiry
        }
    )
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id
        },
        _config.refresh_token,
        {
            expiresIn: _config.refresh_token_expiry
        }
    )
}

userSchema.methods.generatePasswordResetToken = function() {
    const randomString = crypto.randomBytes(16).toString("hex")
    const hashedString = crypto.createHash("sha256").update(randomString).digest("hex")
    // console.log(hashedString);

    this.resetPasswordToken = hashedString
    this.resetPasswordExpiry = Date.now() + 5 * 60 * 1000
    
    return randomString
}

userSchema.virtual("fullname").get(function() {
    return `${this.firstname} ${this.lastname || ""}`
})

const User = mongoose.model("User", userSchema)

export default User