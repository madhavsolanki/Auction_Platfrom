import { config } from 'dotenv';
import express from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { errorMiddleware } from './middlewares/error.middleware.js';
import connection from './database/connection.js';
import userRouter from './routes/user.routes.js';
import auctionItemRouter from './routes/auction_item.routes.js';
import bidRouter from "./routes/bid.routes.js";
import commisionRoutes from "./routes/commisionm.routes.js";
import superAdminRouter from "./routes/superAdmin.routes.js";
import { endedAuctionCron } from "./automation/endedAuctionCron.js"

const app = express();

config({
  path:"./config/config.env",
});



app.use(cors({
  origin: [process.env.FRONTEND_URL],
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir:"/tmp/",
  })
);


app.use("/api/v1/user", userRouter);
app.use("/api/v1/auctionitem", auctionItemRouter);
app.use("/api/v1/bid", bidRouter);
app.use("/api/v1/commision", commisionRoutes);
app.use("/api/v1/superadmin", superAdminRouter);


// endedAuctionCron();

// DB connection
connection();

app.use(errorMiddleware);

export default app;