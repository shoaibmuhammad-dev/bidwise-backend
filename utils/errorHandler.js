class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.status = statusCode || 500;
  }
}

module.exports = ErrorHandler;
