import mongoose from "mongoose";
import Auction from "../models/auction.model.js";
import { catchAsyncErrors } from "./catchAsyncError.middleware.js";
import ErrorHandler from "./error.middleware.js";

export const checkAuctionEndTime = catchAsyncErrors(async (req, res, next) => {
  const {id} = req.params;

  if(!mongoose.Types.ObjectId.isValid(id)){
    return next(new ErrorHandler("Invalid Auction Id Format", 400));
  }

  const auction = await Auction.findById(id);

  if(!auction){
    return next(new ErrorHandler("Auction not found", 404));
  }

  const now = new Date();

  if(new Date(auction.startTime) > now){
    return next(new ErrorHandler("Auction has not started yet.", 400));
  }

  if(new Date(auction.endTime) < now){
    return next(new ErrorHandler("Auction has ended.", 400));
  }

  next();

});