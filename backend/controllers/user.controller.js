import User from "../models/user.model.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import {v2 as cloudinary} from "cloudinary";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.middleware.js";
import { generateToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return next(new ErrorHandler("Profile Image Required", 400));
    }

    const { profileImage } = req.files;

    const allowedFormats = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];
    if (!allowedFormats.includes(profileImage.mimetype)) {
      return next(new ErrorHandler("Invalid Image Format", 400));
    }

    const {
      userName,
      email,
      password,
      phone,
      address,
      role,
      bankAccountNumber,
      bankAccountName,
      bankName,
      easypaisaAccountNumber,
      paypalEmail,
    } = req.body;


    // Valiadte the data
    if (!userName || !email || !password || !phone || !address || !role) {
      return next(new ErrorHandler("Please fill full Form", 400));
    }

    if(role === "Auctioneer"){
      if(!bankAccountNumber || !bankAccountName || !bankName){
        return next(new ErrorHandler("Please provide your full bank details.", 400));
      }
    }

    if(!easypaisaAccountNumber){
      return next(new ErrorHandler("Please provide your Easypaisa account number.", 400));
    }

    if(!paypalEmail){
      return next(new ErrorHandler("Please provide your Paypal email.", 400));
    }

    // Check if the user already exists
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
      return next(new ErrorHandler("User already exists", 400));
    }

    // Upload the profile image to Cloudinar
    const cloudinaryResponse = await cloudinary.uploader.upload(profileImage.tempFilePath, {
      folder: "AUCTION_PLATFORM_USERS",
    });
    

    if(!cloudinaryResponse || cloudinaryResponse.error){
      console.error("Cloudinary Error: ", cloudinaryResponse.error || "Unknown cloudinary error.");
      return next(new ErrorHandler("Failed to upload profile image to Cloudinary", 500));
    }
    // Create a new user
    const user = new User({
      userName,
      email,
      password,
      phone,
      address,
      role,
      profileImage: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url, 
      },
      paymentMethods: {
        bankTransfer: {
          bankAccountNumber,
          bankAccountName,
          bankName,
        },
        easypaisa: {
          easypaisaAccountNumber,
        },
        paypal: {
          paypalEmail,
        },
      },  
    });
    // Save the user to the database
    await user.save();

    generateToken(user, "user registerd successfully", 201, res);

  } catch (error) {
    next(new ErrorHandler(error.message, 500));

  }
});


export const login = catchAsyncErrors(async (req, res, next)=> {
  try {
    
    const {email, password} = req.body;

    if(!email || !password){
      return next(new ErrorHandler("Please provide your email and password.", 400));
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
      return next(new ErrorHandler("Invalid credentials.", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
      return next(new ErrorHandler("Invalid credentials.", 401));
    }

    generateToken(user, "login successfully", 200, res);

  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
}) ;



export const getProfile = catchAsyncErrors(async (req, res, next)=> {
  try {
    const user = req.user;
    return res.status(200).json({
      success: true, 
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    
    
  }
});

export const logout = catchAsyncErrors(async (req, res, next)=> {
  return res.status(200).cookie("token", "", {
    expires: new Date(Date.now()),
    httpOnly: true,
  }).json({
    success: true,
    message: "Logged out successfully",
  });
}) ;


export const fetchLeaderboard = catchAsyncErrors(async (req, res, next)=> {
  const users = await User.find({moneySpent: { $gt : 0}});
  const leaderBoard = users.sort((a, b) => b.moneySpent - a.moneySpent);

  return res.status(200).json({
    success: true,
    message: "Leaderboard fetched successfully",
    leaderBoard,
  });
}) ;