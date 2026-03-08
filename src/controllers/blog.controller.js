import mongoose from "mongoose"
import Blog from "../models/blog.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"

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
    const blog = await Blog.findById(blog_id)
    if(!blog)
        throw new ApiError(404, "No blog found")

    if(blog.owner.toString() !== req.user._id.toString())
        throw new ApiError(403, "Not allowed to delete this blog")

    if(blog.blogCoverImage.public_id)
        await deleteFromCloudinary(blog.blogCoverImage.public_id, "image")
    await blog.deleteOne()
    return res.status(200).json(new ApiResponse({}, "Blog deleted successfully"))
})
const getAllBlogs = asyncHandler(async (req, res) => {
    let {page=1, limit=10, search, sort} = req.query
    
    page = parseInt(page)
    page = page > 1 ? page : 1
    limit = parseInt(limit)
    limit = (limit > 0 && limit < 15) ? limit : 15
    let skip = (page - 1) * limit
    
    // match stages
    let matchStage = {}
    if(search){
        matchStage.$or = [
            {title: {$regex: search, $options: "i"}},
            {content: {$regex: search, $options: "i"}}
        ]
    }
    // search stages
    let sortStage = {createdAt: -1}
    if(sort) {
        const allowedField = ["createdAt", "title", "content"]
        const field = sort.startsWith("-") ? sort.slice(1) : sort
        if(allowedField.includes(field)) {
            const order = sort.startsWith("-") ? -1 : 1
            sortStage = {[field]: order}
        }
    }
    //  find return an array of doc

    if(req.query.mine === "true"){
        if(!req.user?._id)
            throw new ApiError(401, "You are not logged in")
        matchStage.owner = new mongoose.Types.ObjectId(req.user._id)
    }
    const blogs = await Blog.aggregate([
                    {
                        $match: matchStage
                    },
                    {
                        $facet: {
                            data: [
                                {
                                    $sort: sortStage
                                },
                                {
                                    $skip: skip
                                },
                                {
                                    $limit: limit
                                }
                            ],
                            totalBlog: [
                                {$count: "count"}
                            ]
                        }
                        
                    }
                ])
    
    let totalBlogCount = blogs[0].totalBlog[0]?.count || 0

    return res.status(200).json(new ApiResponse({
        totalBlogCount, 
        totalPages: Math.ceil(totalBlogCount/limit), 
        currentPage: page, 
        limit, 
        blogs: blogs[0].data }, "Blogs fetched successfully"))    
})
const getBlogById = asyncHandler(async (req, res) => {
    const {blog_id} = req.params
    const blog = await Blog.findById(blog_id)
    if(!blog)
        throw new ApiError(404, "No blog found")
    return res.status(200).json(new ApiResponse(blog, "Blog fetched successfully"))
})
const updateBlog = asyncHandler(async (req, res) => {
    const data = {}
    const {blog_id} = req.params
    if(!blog_id)
        throw new ApiError(400, "Blog id not provided")

    const blog = await Blog.findById(blog_id)
    if(!blog)
        throw new ApiError(404, "No blog found")

    if(blog.owner.toString() !== req.user._id.toString())
        throw new ApiError(403, "Not allowed to update this blog")
    
    const {title, content} = req.body
    if((!title || title.trim() === "") && (!content || content.trim() === "") && !req.file)
        throw new ApiError(400, "No field provided")
    if(title && title.trim() !== "")
        data.title = title
    if(content && content.trim() !== "")
        data.content = content

    if(req.file) {
        await deleteFromCloudinary(blog.blogCoverImage.public_id, "image")
        const image = await uploadOnCloudinary(req.file.path)
        data.blogCoverImage = {
            secure_url: image.secureUrl,
            public_id: image.public_id
        }
    }
    const updatedBlog = await Blog.findByIdAndUpdate(
        blog_id, 
        data,
        {returnDocument: "after", runValidators: true}
    )

    return res.status(200).json(new ApiResponse(updatedBlog, "Blog updated successfully"))
})

export {
    createBlog,
    deleteBlog,
    getAllBlogs, 
    getBlogById,
    updateBlog
}
