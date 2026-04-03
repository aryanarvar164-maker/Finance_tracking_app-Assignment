// import { ApiError } from '../utils/apiError.js';

const errorhandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        message: err.message || "Something went wrong!!",
        errors: err.errors || [],
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
};

export { errorhandler };