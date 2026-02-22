import express from "express"
import { jwtVerify } from "../middlewares/auth.middleware.js"
import upload from "../middlewares/multer.middleware.js"
import { createBlog, deleteBlog, getAllBlogs, getBlogById, updateBlog } from "../controllers/blog.controller.js"

const router = express.Router()
router.use(jwtVerify)
router.route("/")
    .get(getAllBlogs)
    .post(upload.single("blogCoverImage"), createBlog)

router.route("/:blog_id")
    .delete(deleteBlog)
    .get(getBlogById)    
    .patch(upload.single("blogCoverImage"), updateBlog)

export default router