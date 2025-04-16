import mongoose from "mongoose";

const commsionSchema = new mongoose.Schema({
  amount: Number,
  user: mongoose.Schema.Types.ObjectId,
  createdAt:{
    type: Date,
    default: Date.now(),
  },
});

const Commision = mongoose.model("Commision", commsionSchema);

export default Commision;