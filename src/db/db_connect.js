import mongoose from "mongoose"
import {DATABASE_NAME} from "../constants.js"

const connectToDB = async function () {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DATABASE_NAME}`)
        console.log("Connected to MONGODB Atlas");
    } catch (error) {
        console.log("MongoDB connection error");
        process.exit(1)
    }
}

export default connectToDB