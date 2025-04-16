import { catchAsyncErrors } from "../middlewares/catchAsyncError.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import PaymentProof from "../models/commisionProof.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

export const proofOfCommision = catchAsyncErrors(async (req, res, next) => {

  try {

    if(!req.files || Object.keys(req.files).length === 0){
      return next(new ErrorHandler("Payment proof screenshot required", 400));
  }

  const { proof } = req.files;
 
  const { amount, comment } = req.body;

  const user = await User.findById(req.user._id);

  if(!amount || !comment){
    return next(new ErrorHandler("Amount and comment are required", 400));
  }

  if(user.unpaidCommission === 0){
    return res.status(200).json({
      success:true,
      message:"You don't have any unpaid commisions."
    })
  }

  if(user.unpaidCommission < amount){
    return next(new ErrorHandler(`The amount exceeds your unpaid commision balance. Please enter an amount upto ${user.unpaidCommission}`, 400));
  }

  const allowedFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if(!allowedFormats.includes(proof.mimetype)){
    return next(new ErrorHandler("Screenshot format not supported", 400));
  }

  // Upload the payment proof image to Cloudinary
  const cloudinaryResponse = await cloudinary.uploader.upload(proof.tempFilePath, {
    folder: "AUCTION_PLATFORM_PAYMENT_PROOFS",
  });
  

  if(!cloudinaryResponse || cloudinaryResponse.error){
    console.error("Cloudinary Error: ", cloudinaryResponse.error || "Unknown cloudinary error.");
    return next(new ErrorHandler("Failed to upload paymemnt proof", 500));
  }


  const commisionProof = await PaymentProof.create({
    userId: user._id,
    proof: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
    amount,
    comment,
  });

  res.status(200).json({
    success:true,
    message:"Payment proof submitted successfully. We will review it and respond in 24Hrs ",
    commisionProof
  });

  } catch (error) {
    console.log(error);
    
    return next(new ErrorHandler(error.message, 500));
  }

  


});