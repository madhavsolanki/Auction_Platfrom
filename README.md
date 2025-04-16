```markdown
# 🧾 MERN Stack Auction Platform - Backend

Welcome to the backend of the **MERN Stack Auction Platform** 🎯 — a feature-rich backend for a modern online auction application built using **MongoDB**, **Express**, and **Node.js**.

This repository contains the complete backend logic to manage user authentication, auctions, bidding system, commissions, and administrative controls. 💻

---

## 🏗️ Tech Stack

- ⚙️ **Node.js**
- 🚀 **Express.js**
- 🗃️ **MongoDB with Mongoose**
- 🔐 **JWT Authentication**
- ☁️ **Cloudinary for image uploads**
- 📤 **Nodemailer for emails**
- 🧾 **Cron Jobs for background tasks**
- 🔁 **RESTful APIs**
- 🍪 **Cookie-based Auth with HTTPOnly cookies**

---

## 📁 Folder Structure

```
.
├── config/                   # Environment Configurations
│   └── config.env
├── controllers/             # Logic for handling routes
│   ├── auction_item.controller.js
│   ├── bid.controller.js
│   ├── commision.controller.js
│   ├── superAdmin.controller.js
│   └── user.controller.js
├── database/                # DB Connection setup
│   └── connection.js
├── middlewares/             # All custom middleware
│   ├── auth.middleware.js
│   ├── catchAsyncErrors.middleware.js
│   ├── checkAuctionEndTime.middleware.js
│   ├── error.middleware.js
│   └── trackCommisionStatus.middleware.js
├── routes/                  # API Routes
│   ├── auction_item.routes.js
│   ├── bid.routes.js
│   ├── commisionm.routes.js
│   ├── superAdmin.routes.js
│   └── user.routes.js
├── utils/                   # Utility functions (if any)
├── app.js                   # Express app setup
├── server.js                # Entry point
├── package.json
└── README.md                # Project Docs
```

---

## 🔐 Environment Variables

Setup a `.env` file in the `config/` folder with the following keys:

```env
PORT=

# MongoDB
MONGO_URI=

# JWT Config
JWT_SECRET=
JWT_EXPIRE=
COOKIE_EXPIRE=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Mailer
SMTP_HOST=
SMTP_SERVICE=
SMTP_PORT=
SENDER_EMAIL=
SMTP_PASSWORD=

# Others
NODE_ENV=
FRONTEND_URL=
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/auction-backend.git
cd auction-backend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup Environment

Create your `.env` file inside `config/` using the keys listed above.

### 4️⃣ Run the Server

#### 🔧 Development

```bash
npm run dev
```

#### 🚀 Production

```bash
npm start
```

---

## 👨‍💻 Features Implemented

### 🔐 User Management
- `POST /api/v1/user/register` – Register a user
- `POST /api/v1/user/login` – Login user
- `GET /api/v1/user/me` – Get logged in user profile
- `GET /api/v1/user/logout` – Logout user
- `GET /api/v1/user/leaderboard` – View top bidders

### 📦 Auction Management
- `POST /api/v1/auctionitem/create` – Create new auction (Only Auctioneer)
- `GET /api/v1/auctionitem/allitems` – Fetch all auctions
- `GET /api/v1/auctionitem/auction/:id` – Get auction details
- `GET /api/v1/auctionitem/myitems` – Get my auctions (Auctioneer only)
- `DELETE /api/v1/auctionitem/delete/:id` – Delete auction item
- `PUT /api/v1/auctionitem/item/republish/:id` – Republish removed item

### 💸 Bidding System
- `POST /api/v1/bid/place/:id` – Place a bid on auction (Only Bidder)

### 💰 Commission System
- `POST /api/v1/commision/proof` – Upload commission proof (Auctioneer)

### 🛡️ Admin (Super Admin Only)
- `GET /api/v1/superadmin/users/getall` – Fetch all users
- `GET /api/v1/superadmin/paymentproofs/getall` – Get all payment proofs
- `GET /api/v1/superadmin/paymentproof/:id` – Get payment proof details
- `PUT /api/v1/superadmin/paymentproof/status/update/:id` – Approve/Reject proof
- `DELETE /api/v1/superadmin/paymentproof/delete/:id` – Delete proof
- `DELETE /api/v1/superadmin/auctionitem/delete/:id` – Delete auction
- `GET /api/v1/superadmin/montlyincome` – View monthly revenue

---

## 🧠 Middlewares Used

| Middleware Name | Description |
|------------------|-------------|
| `isAuthenticated` | Verifies JWT Token and authenticates user |
| `isAuthorized(roles)` | Role-based access control |
| `catchAsyncErrors` | Wrapper for async route handlers to catch errors |
| `checkAuctionEndTime` | Prevents bidding after auction end time |
| `errorMiddleware` | Centralized error handling |
| `trackCommisionStatus` | Validates auctioneer's commission before allowing auction |

---

## 🧪 APIs in Action (Postman Coming Soon...) 🧪

We'll soon be adding a Postman collection to help you test all routes seamlessly! 💡

---

## 👨‍💻 Author

**Madhav Solanki**  
🔗 [GitHub](https://github.com/yourgithubusername)  
📫 madhav@example.com

---

## 📝 License

This project is licensed under the **ISC License**.

---

## 🌟 Future Features (Planned)

- ✅ Image preview in frontend
- ✅ Stripe / Razorpay Payment Integration
- ✅ Notification System 🔔
- ✅ Admin Dashboard UI
- ✅ Advanced Leaderboard Filtering

---

> Made with ❤️ using MERN stack. Happy Coding!

```

---

Let me know if you'd like:

- A version with shields/badges at the top (e.g., Node version, license)
- A frontend version when ready
- A `CONTRIBUTING.md` file
- A project banner/logo

Let's make your project pop! ✨
