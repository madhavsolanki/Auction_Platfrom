import {
  addNewAuctionItem, 
  getAllItems, 
  getAuctionDetails, 
  removeFromAuction, 
  republishItem, 
  getMyAuctionItems
} from "../controllers/auction_item.controller.js";
import express from "express";
import {isAuthenticated, isAuthorized} from "../middlewares/auth.middleware.js";
import { trackCommisionStatus } from "../middlewares/trackCommisionStatus.middleware.js";

const router = express.Router();

router.post("/create", isAuthenticated, isAuthorized("Auctioneer"), trackCommisionStatus, addNewAuctionItem);

router.get("/allitems", getAllItems);

router.get("/auction/:id", isAuthenticated, getAuctionDetails);

router.get("/myitems", isAuthenticated, isAuthorized("Auctioneer"), getMyAuctionItems);

router.delete("/delete/:id", isAuthenticated, isAuthorized("Auctioneer"), removeFromAuction);

router.put("/item/republish/:id", isAuthenticated, isAuthorized("Auctioneer"), republishItem);

export default router;
