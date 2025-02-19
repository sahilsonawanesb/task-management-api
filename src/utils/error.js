// implementing the error function to used across the app as follows

const errorHandler = (statusCode, message) => {
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message;
    return error;
}

export default errorHandler;