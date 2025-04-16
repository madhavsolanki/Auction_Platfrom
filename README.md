# 🏷️ MERN Stack Auction Platform (Backend)

Welcome to the backend of the **Auction Platform** – a modern, scalable, and feature-rich application built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js).

This backend powers functionalities such as:
- 👤 User authentication & leaderboard
- 🔨 Auction item management
- 💰 Bidding system
- 💼 Commission tracking
- 🛡️ Super Admin controls

---

## 📁 Folder Structure

bbackend/
├── config/                      # 🌐 Environment variables and config
│   └── config.env
├── controllers/                # 🧠 Route logic controllers
│   ├── auction_item.controller.js
│   ├── bid.controller.js
│   ├── commision.controller.js
│   ├── superAdmin.controller.js
│   └── user.controller.js
├── database/                   # 🍃 MongoDB connection setup
│   └── connection.js
├── middlewares/                # 🛡️ Custom middlewares
│   ├── auth.middleware.js
│   ├── catchAsyncErrors.middleware.js
│   ├── checkAuctionEndTime.middleware.js
│   ├── error.middleware.js
│   └── trackCommisionStatus.middleware.js
├── routes/                     # 🚏 API route declarations
│   ├── auction_item.routes.js
│   ├── bid.routes.js
│   ├── commisionm.routes.js
│   ├── superAdmin.routes.js
│   └── user.routes.js
├── utils/                      # 🧰 Utility functions (token, mail, etc.)
├── app.js                      # 🚀 Express app setup
├── server.js                   # 🔑 App entry point
└── package.json                # 📦 NPM configuration




Main app setup
---

## 🛠️ Tech Stack

- **Backend Framework**: Node.js + Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT + Cookies
- **File Uploads**: express-fileupload + Cloudinary
- **Mailing**: Nodemailer
- **Environment Management**: dotenv
- **Cron Jobs**: node-cron

---

## 🔐 Environment Variables (`.env`)

You must create a `.env` file in `/config` with the following variables:

```env
PORT=

# 🌩️ Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# 🍃 MongoDB
MONGO_URI=

# 🔐 JWT
JWT_SECRET=
JWT_EXPIRE=
COOKIE_EXPIRE=

# 📬 Nodemailer
SMTP_HOST=
SMTP_SERVICE=
SMTP_PORT=
SENDER_EMAIL=
SMTP_PASSWORD=

NODE_ENV=
FRONTEND_URL=

📦 Package.json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "Complete Backend Application for Auction Platfrom ",
  "license": "ISC",
  "author": "Madhav Solanki",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "bcrypt": "^5.1.1",
    "cloudinary": "^2.6.0",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^16.5.0",
    "express": "^5.1.0",
    "express-fileupload": "^1.5.1",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.13.2",
    "node-cron": "^3.0.3",
    "nodemailer": "^6.10.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }
}

🧪 API Endpoints Overview
👤 User Routes (/api/v1/user)

Method | Endpoint | Description
POST | /register | Register a new user
POST | /login | Login user
GET | /me | Get user profile
GET | /logout | Logout user
GET | /leaderboard | Fetch leaderboard

🔨 Auction Routes (/api/v1/auctionitem)

Method | Endpoint | Description
POST | /create | Add a new auction item (Auctioneer)
GET | /allitems | Fetch all auction items
GET | /auction/:id | Get auction item details
GET | /myitems | Get my auction items (Auctioneer)
DELETE | /delete/:id | Remove item from auction
PUT | /item/republish/:id | Republish auction item

💰 Bid Routes (/api/v1/bid)

Method | Endpoint | Description
POST | /place/:id | Place a bid on auction (Bidder)

📄 Commission Routes (/api/v1/commision)

Method | Endpoint | Description
POST | /proof | Upload payment proof (Auctioneer)

🛡️ Super Admin Routes (/api/v1/superadmin)

Method | Endpoint | Description
DELETE | /auctionitem/delete/:id | Delete any auction item
GET | /paymentproofs/getall | Fetch all payment proofs
GET | /paymentproof/:id | Get payment proof details
PUT | /paymentproof/status/update/:id | Update proof status
DELETE | /paymentproof/delete/:id | Delete payment proof
GET | /users/getall | Fetch all users
GET | /montlyincome | Monthly revenue report

🧩 Middlewares
🔐 isAuthenticated – Checks if the user is logged in

🔑 isAuthorized(role) – Role-based access control (Auctioneer, Bidder, Super Admin)

⚠️ catchAsyncErrors – Handles async errors automatically

⏱️ checkAuctionEndTime – Prevents bidding after auction ends

💼 trackCommisionStatus – Tracks commission generation on item creation

🚨 errorMiddleware – Global error handler

🚀 Getting Started

Clone the repository
git clone https://github.com/your-username/auction-backend.git
cd auction-backend

Install dependencies
npm install

Configure environment
cp ./config/config.env.example ./config/config.env
# Fill all the required env vars

Run in development
npm run dev

🧠 Author
🧑‍💻 Madhav Solanki
Final Year BTech CSE Student
GitHub • LinkedIn

⭐️ Features Coming Soon
🧾 Invoice generation

📦 Auction History

📊 Advanced Analytics for Admin

🛒 Live Auction Countdown UI

📝 License
This project is licensed under the ISC License.

🌟 Star this repository if you found it helpful! Contributions and suggestions are always welcome!

---

Let me know if you want me to generate a live demo GIF, badges, or want this deployed on Render/Vercel with MongoDB Atlas!

