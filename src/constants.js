const DATABASE_NAME = "blog_db"
const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none"
    }
    
export  {
    DATABASE_NAME,
    options
}