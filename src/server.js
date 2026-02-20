import app from "./app.js";
import _config from "./config/index.js";
import connectToDB from "./db/db_connect.js";
import dotenv from "dotenv"

dotenv.config()

connectToDB()
    .then(() => {
        app.listen(_config.port, () => console.log(`Server is running on port ${_config.port}`))
    })
    .catch((err)=> console.log("Database connection failed: ", err))