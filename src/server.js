import app from "./app.js";
import connectToDB from "./db/db_connect.js";
import dotenv from "dotenv"

dotenv.config()

connectToDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => console.log(`Server is running on port ${process.env.PORT}`))
    })
    .catch((err)=> console.log("Database connection failed: ", err))