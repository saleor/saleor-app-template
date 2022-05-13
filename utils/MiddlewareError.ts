class MiddlewareError extends Error {
  // We may want to use different statusCodes for different errors
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, MiddlewareError.prototype);
  }
}

export default MiddlewareError;
