import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

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
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

userSchema.virtual("fullname").get(function() {
    return `${this.firstname} ${this.lastname || ""}`
})

const User = mongoose.model("User", userSchema)

export default User