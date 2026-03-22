import swaggerJSDoc from "swagger-jsdoc";

const options = { 
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Blog API Service",
            version: "1.0.0",
            description: "REST API for blog platform."
        },
        servers: [
            {
                url: "https://blog-app-71ay.onrender.com/api",
                description: "Production server"
            },
            {
                url: "http://localhost:8000/api",
                description: "Development server",
            }
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "accessToken"
                }
            }
        }
    },
    apis: ["./src/routes/*.js", "./src/docs/*.js"]
}

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec