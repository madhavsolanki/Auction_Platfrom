import jwt from "jsonwebtoken";
import User from "../models/user.model.js"; 
import ErrorHandler from "./error.middleware.js";
import { catchAsyncErrors } from "./catchAsyncError.middleware.js";


export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return next(new ErrorHandler("Not authenticated", 401));
    }

    const decoded =  jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);
    next();

});


export const isAuthorized = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`${req.user.role} is not allowed to access this resource`, 403));
        }
        next();
    };
};