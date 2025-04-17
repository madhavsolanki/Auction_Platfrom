import {v2 as cloudinary} from "cloudinary";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.middleware.js";
import User from "../models/user.model.js";
import Auction from "../models/auction.model.js";
import Bid from "../models/bid.model.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import mongoose from "mongoose";

export const addNewAuctionItem = catchAsyncErrors(async (req, res, next) => {
  if(!req.files || Object.keys(req.files).length === 0){
    return next(new ErrorHandler("No files were uploaded.", 400));
  }

  const { image } = req.files;

  const allowedFormats = ["image/jpg", "image/jpeg", "image/png"];
  if(!allowedFormats.includes(image.mimetype)){
    return next(new ErrorHandler("Invalid file format. Only JPG, JPEG, and PNG are allowed.", 400));
  }

  const {title, description, category, condition, startingBid, startTime, endTime} = req.body;

  if(!title || !description || !category || !condition || !startingBid || !startTime || !endTime){
    return next(new ErrorHandler("Please provide all details.", 400));
  }

  if(new Date(startTime) < Date.now()){
    return next(new ErrorHandler("Auction starting time must be greater than present time", 400));
  }
  if(new Date(startTime) >= new Date(endTime)){
    return next(new ErrorHandler("Auction ending time must be greater than starting time", 400));
  }

  const alreadyOneAuctionActive = await Auction.find({
    createdBy: req.user._id,
    endTime: {$gt: Date.now()},
  });

  if (alreadyOneAuctionActive.length >   0) {
    return next(new ErrorHandler("You already have an active auction.", 400));
  }

  // 3 : 12 : 34
  try {
    const cloudinaryResponse = await cloudinary.uploader.upload(image.tempFilePath, 
      {
        folder: "AUCTION_PLATFORM_AUCTIONS"
      }
    );

    if(!cloudinaryResponse || cloudinaryResponse.error){
      console.error("Cloudinary upload error:", cloudinaryResponse.error);
      return next(new ErrorHandler("Failed to upload auction image to Cloudinary.", 500));
    }

    const auctionItem = await Auction.create({
      title,
      description,
      category,
      condition,
      startingBid,
      startTime,
      endTime,
      image: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: `Auction item created and will be listed on auction page at ${startTime}`,
      auctionItem
    });

  } catch (error) {
    return next(new ErrorHandler(error.message || "failed to create auction", 500));
  }

});


export const getAllItems = catchAsyncErrors(async (req, res, next) => {

  let items = await Auction.find();

  if(items.length === 0){
    return next(new ErrorHandler("No auction items found", 404)); 
  }

  return res.status(200).json({
    success: true,
    items 
  })

});

export const getMyAuctionItems = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;

  const items = await Auction.find({createdBy: userId});

  return res.status(200).json({
    success: true,
    items
  });

});

export const getAuctionDetails = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  if(!mongoose.Types.ObjectId.isValid(id)){
    return next(new ErrorHandler("Invalid auction item id", 400));
  }

  const auctionItem = await Auction.findById(id);

  if(!auctionItem){
    return next(new ErrorHandler("Auction Not Found", 404));
  }

  const biddrers = auctionItem.bids.sort((a, b) => b.bid - a.bid);  

  return res.status(200).json({
    success: true,
    auctionItem,
    biddrers,
  });

});

export const removeFromAuction = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  if(!mongoose.Types.ObjectId.isValid(id)){
    return next(new ErrorHandler("Invalid auction item id", 400));
  }

  const auctionItem = await Auction.findById(id);

  if(!auctionItem){
    return next(new ErrorHandler("Auction Not Found", 404));
  }

  if(auctionItem.createdBy.toString() !== req.user._id.toString()){
    return next(new ErrorHandler("You are not authorized to delete this auction item", 403));
  }

  await auctionItem.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Auction item deleted successfully",
  });

});

export const republishItem = catchAsyncErrors(async (req, res, next) => {
  const {id} = req.params;

  if(!mongoose.Types.ObjectId.isValid(id)){
    return next(new ErrorHandler("Invalid auction item id", 400));
  }

  let auctionItem = await Auction.findById(id);

  if(!auctionItem){
    return next(new ErrorHandler("Auction Not Found", 404));
  }

  if(!req.body.startTime || !req.body.endTime){
    return next(new ErrorHandler("Starttime and End time is manadatory for repubish the item", 400));
  }

  if(auctionItem.createdBy.toString()!== req.user._id.toString()){
    return next(new ErrorHandler("You are not authorized to republish this auction item", 403));
  }


  if(new Date(auctionItem.endTime) > Date.now()){
    return next(new ErrorHandler("Auction has already active, cannot republish", 400));
  }

  const data = {
    startTime : new Date(req.body.startTime),
    endTime : new Date(req.body.endTime),
  };

  if(data.startTime < Date.now()){
    return next(new ErrorHandler("Auction starting time must be greater than present time", 400));
  }

  if(data.startTime >= data.endTime){
    return next(new ErrorHandler("Auction starting time must be less than ending time", 400));
  }

  if(auctionItem.highestBidder){
    const highestBidder = await User.findById(auctionItem.highestBidder);

    highestBidder.moneySpent -= auctionItem.currentBid;
    highestBidder.auctionsWon -= 1;

    highestBidder.save();
  }

  data.bids = []; 
  data.commisionCalculated = false; 
  data.currentBid  = 0;
  data.highestBidder = null;
  auctionItem = await Auction.findByIdAndUpdate(id, data, {new: true, runValidators:true, useFindAndModify: false});

  await Bid.deleteMany({auctionItem : auctionItem._id});

  const createdBy = await User.findByIdAndUpdate(req.user._id, {unpaidCommission: 0}, { new: true, runValidators: false, useFindAndModify: false});

  return res.status(200).json({
    success: true,
    auctionItem,
    message: `Auction republished and will be active on ${req.body.startTime}`,
    createdBy,
  });

});