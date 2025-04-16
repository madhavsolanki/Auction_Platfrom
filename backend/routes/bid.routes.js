import express from "express";
import { placeBid } from "../controllers/bid.controller.js";
import {isAuthenticated, isAuthorized} from "../middlewares/auth.middleware.js";
import { checkAuctionEndTime } from "../middlewares/checkAuctionEndTime.middleware.js";


const router = express.Router();

router.post("/place/:id", isAuthenticated, isAuthorized("Bidder"), checkAuctionEndTime, placeBid);


export default router;