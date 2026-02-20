import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import _config from "../config/index.js"

cloudinary.config({
    cloud_name: _config.cloudinary.cloud_name,
    api_key: _config.cloudinary.api_key,
    api_secret: _config.cloudinary.api_secret
})

const uploadOnCloudinary = async (filepath) => {
    try {
        if(!filepath)
            return null
        
        const result = await cloudinary.uploader.upload(filepath, {folder: "test-folder"})
        fs.unlinkSync(filepath)
        return {
            secureUrl: result.secure_url,
            public_id: result.public_id
        }
    } catch (error) {
        if(filepath)
            fs.unlinkSync(filepath)
        console.log("Something went wrong while uploading on cloudinary");
    }
}

const deleteFromCloudinary = async (publicId, resourceType = "auto") => {
    try {
        const response = await cloudinary.uploader.destroy(publicId, {resource_type: resourceType})
        return response
    } catch (error) {
        console.error("Cloudinary delete error: ", error)
        return null
    }
}

export {
    uploadOnCloudinary,
    deleteFromCloudinary
}