class ApiResponse{
    constructor(data, message="success") {
        this.data = data
        this.message = message
        this.success = true
    }
}

export default ApiResponse