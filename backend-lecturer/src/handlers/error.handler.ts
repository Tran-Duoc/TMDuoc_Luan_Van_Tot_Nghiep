class ApiError extends Error {
  statusCode: number

  constructor(statusCode: number, message?: string) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    // Ghi lại nguồn gốc của lỗi trong stack trace
    Error.captureStackTrace(this, this.constructor)
  }
}

export default ApiError
