import { catchAsyncErrors } from "../middlewares/catchAsyncError.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import User from "../models/user.model.js";
import Commision from "../models/commision.model.js";
import mongoose from "mongoose";
import Auction from "../models/auction.model.js";
import PaymentProof from "../models/commisionProof.model.js";


export const deleteAuctionItem = catchAsyncErrors(async (req, res, next) => {
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

export const getAllPaymentsProofs = catchAsyncErrors(async (req, res, next) => {

  let paymentProofs = await PaymentProof.find();

  return res.status(200).json({
    success: true,
    paymentProofs,
  });

});

export const getPaymentProofDetail = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const paymentProofDetail = await PaymentProof.findById(id);

  if(!paymentProofDetail){
    return next(new ErrorHandler("Payment proof not found", 404));
  }

  return res.status(200).json({
    success: true,
    paymentProofDetail,
  });


});

export const updateProofStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const { status, amount } = req.body;

  if(!mongoose.Types.ObjectId.isValid(id)){
    return next(new ErrorHandler("Invalid Id Format", 400));
  }

  let proof = await PaymentProof.findById(id);
  if(!proof){
    return next(new ErrorHandler("Payment proof not found", 404));
  }

  proof = await PaymentProof.findByIdAndUpdate(id, {status, amount}, {new:true, runValidators:true, useFindAndModify:false });

  return res.status(200).json({
    success: true,
    message: "Payment proof updated successfully",
    proof,
  });

});

export const deletePaymentProof = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const proof = await PaymentProof.findById(id);

  if(!proof){
    return next(new ErrorHandler("Payment proof not found", 404));
  }

  await proof.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Payment proof deleted successfully",
  });

});


export const fetchAllUsers = catchAsyncErrors(async (req, res, next) =>{
  const user = await User.aggregate([
    {
      $group: {
        _id: {
          month: {$month: "$createdAt"},
          year: {$year: "$createdAt"},
          role: "$role"
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        month: "$_id.month",
        year: "$_id.year",
        role: "$_id.role",
        count: 1,
        _id:0,
      },
    },
    {
      $sort: {
        year: 1,
        month: 1,
      },
    },
  ]);


  const bidders = user.filter((user) => user.role === "Bidder");
  const auctioneers = user.filter((user) => user.role === "Auctioneer");

  const transformDataToMonthlyArray = (data, totalMonths = 12) => {
    const result = Array(totalMonths).fill(0);

    data.forEach(item => {
      result[item.month - 1] = item.count; 
    });

    return result;
  };


  const biddersArray = transformDataToMonthlyArray(bidders);
  const auctioneersArray = transformDataToMonthlyArray(auctioneers);

  return res.status(200).json({
    success:true,
    biddersArray,
    auctioneersArray
  });

});


export const monthlyRevenue = catchAsyncErrors(async (req, res, next) => {
  const payments = await Commision.aggregate([
    {
      $group:{
        _id: {
          month: {$month: "$createdAt"},
          year: {$year: "$createdAt"},
        },
        totalAmount:{ $sum: "$amount"},
      },
    },
    {
      $sort: {"_id.year": 1, "_id.month": 1}
    },
  ]);

  const transformDataToMonthlyArray = (payments, totalMonths = 12 ) => {
    const result = Array(totalMonths).fill(0);

    payments.forEach((payment) => {
      result[payment._id.month - 1] = payment.totalAmount;
    });

    return result;
  };

  const totalMonthlyRevenue = transformDataToMonthlyArray(payments);

  return res.status(200).json({
    success: true,
    totalMonthlyRevenue
  });

});