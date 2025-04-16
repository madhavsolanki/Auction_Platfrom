import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.middleware.js";
import {
  deleteAuctionItem,
  deletePaymentProof,
  fetchAllUsers,
  getAllPaymentsProofs,
  getPaymentProofDetail,
  monthlyRevenue,
  updateProofStatus
} from "../controllers/superAdmin.controller.js";

const router = express.Router();

router.delete("/auctionitem/delete/:id", isAuthenticated, isAuthorized("Super Admin"), deleteAuctionItem);

router.get("/paymentproofs/getall", isAuthenticated, isAuthorized("Super Admin"), getAllPaymentsProofs);

router.get("/paymentproof/:id", isAuthenticated, isAuthorized("Super Admin"), getPaymentProofDetail);

router.put("/paymentproof/status/update/:id", isAuthenticated, isAuthorized("Super Admin"), updateProofStatus);

router.delete("/paymentproof/delete/:id", isAuthenticated, isAuthorized("Super Admin"), deletePaymentProof);

router.get("/users/getall",isAuthenticated, isAuthorized("Super Admin"), fetchAllUsers);

router.get("/montlyincome",isAuthenticated, isAuthorized("Super Admin"), monthlyRevenue);

export default router;