# Blog API - Backend REST Service
A production-ready REST API for a blog application built using Node.js and Express. 

The API supports user authentication, role-based authorization, blog CRUD operations, pagination, searching, sorting, image uploads, and rate limiting.

This project is deployed on Render and connected to MongoDB Atlas.

## Tech Stack
- Node.js
- Express.js
- MongoDB (Atlas) & Mongoose
- JWT Authentication
- Cloudinary (Image Storage)
- Multer (File Upload)
- Express Rate Limit
- CORS
- Cookie-based Authentication
- Render (Deployment)

## Authentication Features
-	User Registration
-	User Login
-	Logout
-	HTTP-only Access Token
-	Refresh Token stored in database
-	Token Rotation (Refresh Access Token)
-	Update Password
-	Forgot Password & Reset Password Flow
-	Protected Routes Middleware
-	Password hashing using bcrypt
-	Rate limiting on authentication routes

## Blog Core Features
-	Create Blog (with image upload)
-	Get All Blogs (paginated)
-	Get Single Blog
-	Update Blog
-	Delete Blog (owner-based authorization)

Blog cover images are uploaded to Cloudinary and properly cleaned on updates/deletions.

## Query Features
-	Pagination
-	Search by title or content
-	Sorting (by created date, title, content)
-	Owner-based filtering (?mine=true)
-	Aggregation pipeline with $facet for efficient count + data retrieval

## Security Enhancements
-	Global rate limiting
-	Stricter limits for user registration route
-	CORS configuration with credentials support
-	Secure cookie configuration
-	Proper error handling middleware
-	Environment-based configuration

## Live API 
Base_URL:
https://blog-app-71ay.onrender.com/api

Public Endpoint: 
GET /blogs

Example: 
https://blog-app-71ay.onrender.com/api/blogs

## Installation & Setup

1. Clone the repository

git clone https://github.com/your-username/your-repo-name.git

2. Install dependencies

npm install

3. Create a .env file in the root directory and add the following variables:

PORT=8000\
MONGODB_URL=your_mongodb_connection_string\
NODE_ENV=your_enviroment\
ACCESS_TOKEN_SECRET=your_secret\
ACCESS_TOKEN_EXPIRY=1h\
REFRESH_TOKEN_SECRET=your_secret\
REFRESH_TOKEN_EXPIRY=10d\
CLOUDINARY_NAME=your_cloudinary_name\
CLOUDINARY_API_KEY=your_cloudinary_api_key\
CLOUDINARY_API_SECRET=your_cloudinary_api_secret\
BASE_URL=your_base_url

4. Run the development server

npm run dev

## API Endpoints

### Auth
POST   /users/register  
POST   /users/login\
POST   /users/logout (Protected)
POST   /users/refresh-accesstoken\
PATCH  /users/update-password (Protected)\
GET    /users/get-current-user (Protected)\
POST   /users/forgot-password\
PATCH  /reset-password/:resetToken

### Blogs
GET    /blogs  
GET    /blogs/:blog_id (Protected)   
POST   /blogs (Protected)  
PATCH  /blogs/:blog_id (Protected)  
DELETE /blogs/:blog_id (Protected)

## API Testing

You can test all endpoints using the Postman collection:

[Download Postman Collection](.docs\Blog API.postman_collection.json)

## Author

Developed by Lishi Sah
