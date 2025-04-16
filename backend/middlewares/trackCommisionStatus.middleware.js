import User from "../models/user.model.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.middleware.js";
import ErrorHandler from "./error.middleware.js";


export const trackCommisionStatus = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if(user.unpaidCommission > 0){
    return next(new ErrorHandler("You have unpaid commisions. Please pay them before posting a new auction.", 403));
  }
  next();
});