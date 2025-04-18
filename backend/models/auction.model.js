import mongoose from "mongoose";

const auntionSchema = new mongoose.Schema({
  title: String,
  description: String,
  startingBid: Number,
  category: String,
  condition:{
    type: String,
    enum: ["New", "Used"],
  },
  currentBid:{type: Number, default : 0},
  startTime:  String,
  endTime: String,
  image:{
    public_id: {type: String, required: true},
    url: {type: String, required: true},
  } ,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  bids:[
    {
      userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bid",
      },
      userName:String,
      profileImage: String,
      amount: Number,
    }
  ],

  highestBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  commisionCalculated:{
    type: Boolean,
    default: false,
  },

  createdAt:{
    type: Date,
    default: Date.now,
  },

});


const Auction = mongoose.model("Auction", auntionSchema);

export default Auction;