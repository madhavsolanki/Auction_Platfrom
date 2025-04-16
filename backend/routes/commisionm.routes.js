import express from "express";
import { proofOfCommision } from "../controllers/commision.controller.js";
import {isAuthenticated, isAuthorized} from "../middlewares/auth.middleware.js";


const router = express.Router();

router.post("/proof", isAuthenticated, isAuthorized("Auctioneer"), proofOfCommision);

export default router;