import Blog from "../models/blog.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const createBlog = asyncHandler(async (req, res) => {
    const {title, content} = req.body
    if([title, content].some(val => !val || val.trim() === ""))
        throw new ApiError(400, "Title and content are required")
    if(!req.file)
        throw new ApiError(400, "Blog cover image is required")

    const blogCoverImageLocalpath = req.file.path
    
    const image = await uploadOnCloudinary(blogCoverImageLocalpath)
    if(!image) 
        throw new ApiError(500, "File not uploaded on cloudinary")

    const blog = await Blog.create({
        title: title,
        content: content,
        blogCoverImage: {
            secure_url: image.secureUrl,
            public_id: image.public_id
        },
        owner: req.user._id
    })
    
    return res.status(201).json(new ApiResponse({blog}, "Blog created successfully"))
})
const deleteBlog = asyncHandler(async (req, res) => {
    const {blog_id} = req.params
    const blog = await Blog.findByIdAndDelete(blog_id)
    if(!blog)
        throw new ApiError(400, "No blog found")

    return res.status(200).json(new ApiResponse({}, "Blog deleted successfully"))
})
const getAllBlogs = asyncHandler(async (req, res) => {
    const blogs = {}
    //  find return an array of doc
    if(req.query.mine === "true"){
        blogs.ownerBlog = await Blog.find({owner: req.user._id})
        if(!blogs.ownerBlog.length<=0)
             return res.status(200).json(new ApiResponse({blogs}, "No blogs created")) 
    } else {
        blogs.allBlogs = await Blog.find()
    }
    return res.status(200).json(new ApiResponse({blogs}, "Blogs fetched successfully"))    
})
const getBlogById = asyncHandler(async (req, res) => {
    const {blog_id} = req.params
    const blog = await Blog.findById(blog_id)
    if(!blog)
        throw new ApiError(400, "No blog found")
    return res.status(200).json(new ApiResponse(blog, "Blog fetched successfully"))
})
const updateBlog = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse())
})

const updateBlogCoverimage = asyncHandler(async (req, res) => {
    return res.status().json(new ApiResponse())
})

export {
    createBlog,
    deleteBlog,
    getAllBlogs, 
    getBlogById,
    updateBlog
}