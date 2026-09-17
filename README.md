# Shopora — Multi-Role E-Commerce Platform

Shopora is a full-stack multi-role e-commerce platform built with React, TypeScript, Node.js, Express, and MongoDB. It supports **Users, Sellers, and Admins** with role-based authentication and separate workflows for shopping, selling, and administration.

---

## 🔗 Live Demo

- **Frontend:** [https://shopora-frontend-wxiy.onrender.com/](https://shopora-frontend-wxiy.onrender.com/)
- **Backend API:** [https://shopora-backend-y33g.onrender.com](https://shopora-backend-y33g.onrender.com)

> Note: Backend is hosted on Render's free tier — the first request after inactivity may take 30–50 seconds to respond while the server wakes up.

## 🌐 Related Repositories

- **Frontend:** [shopora-frontend](https://github.com/sailotech-engineering-pocs/Shopora-ui)
- **Backend:** [shopora-backend](https://github.com/sailotech-engineering-pocs/Shopora-service)

---
## Testing Credentials (Admin Access)

For testing/review purposes, use the following admin credentials:

- **URL:** https://shopora-frontend-wxiy.onrender.com/admin-login
- **Email:** ayodhyarode168@gmail.com
- **Password:** SuperAdmin@123



## 🚀 Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hook Form
- React Hot Toast
- Recharts
- React Icons

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Multer
- ImageKit
- Razorpay
- Nodemailer
- Groq SDK
- Fuse.js
- dotenv
- CORS
- Cookie Parser

---

## 📁 Project Structure

```
Shopora/
│
├── backend/
│ ├── src/
│ │ ├── controllers/
│ │ │ ├── address.controller.js
│ │ │ ├── admin.controller.js
│ │ │ ├── cart.controller.js
│ │ │ ├── category.controller.js
│ │ │ ├── chatbot.controller.js
│ │ │ ├── contact.controller.js
│ │ │ ├── newsletter.controller.js
│ │ │ ├── order.controller.js
│ │ │ ├── product.controller.js
│ │ │ ├── review.controller.js
│ │ │ ├── seller.controller.js
│ │ │ ├── user.controller.js
│ │ │ └── wishlist.controller.js
│ │ │
│ │ ├── middleware/
│ │ │ ├── authMiddleware.js
│ │ │ └── uploadImageMiddleware.js
│ │ │
│ │ ├── models/
│ │ │ ├── Address.model.js
│ │ │ ├── Admin.model.js
│ │ │ ├── Cart.model.js
│ │ │ ├── Category.model.js
│ │ │ ├── Order.model.js
│ │ │ ├── Product.model.js
│ │ │ ├── Review.model.js
│ │ │ ├── Seller.model.js
│ │ │ └── User.model.js
│ │ │
│ │ ├── routes/
│ │ │ ├── address.routes.js
│ │ │ ├── admin.routes.js
│ │ │ ├── carts.routes.js
│ │ │ ├── category.routes.js
│ │ │ ├── chatbot.routes.js
│ │ │ ├── contact.routes.js
│ │ │ ├── newsletter.routes.js
│ │ │ ├── order.routes.js
│ │ │ ├── product.routes.js
│ │ │ ├── review.routes.js
│ │ │ ├── seller.routes.js
│ │ │ ├── user.routes.js
│ │ │ └── wishlist.routes.js
│ │ │
│ │ └── utils/
│ │ ├── generateToken.js
│ │ ├── mailer.js
│ │ ├── razorpay.js
│ │ └── validators.js
│ │
│ └── server.js
│
└── frontend/
├── src/
│ ├── api/
│ ├── assets/
│ ├── components/
│ │ ├── admin/
│ │ ├── landing/
│ │ ├── product/
│ │ └── seller/
│ │
│ ├── context/
│ ├── pages/
│ │ ├── admin/
│ │ ├── seller/
│ │ └── user/
│ │
│ ├── routes/
│ ├── types/
│ ├── utils/
│ ├── App.tsx
│ └── main.tsx
│
└── public/
```
### Frontend Structure Notes

- `api/` — Axios API services
- `assets/` — Application assets
- `components/` — Reusable UI components (admin, landing, product, seller)
- `context/` — Global state and authentication
- `pages/` — Route-level pages (admin, seller, user)
- `routes/` — Protected route wrappers
- `types/` — TypeScript types
- `utils/` — Utility functions

### 🧩 Frontend Contexts

Shopora uses React Context for application-wide state:

- `AuthContext` — User authentication
- `SellerAuthContext` — Seller authentication
- `AdminAuthContext` — Admin authentication
- `CartContext` — Cart state
- `WishlistContext` — Wishlist state
- `ThemeContext` / `ThemeProvider` — Theme management

### 🔌 API Modules

Frontend API services are organized by feature:

```
api/
├── addressApi.ts
├── admin.api.ts
├── axiosInstance.ts
├── cartApi.ts
├── categoryApi.ts
├── chatbotApi.ts
├── contactApi.ts
├── orderApi.ts
├── productApi.ts
├── reviewApi.ts
├── seller.api.ts
├── tokenStore.ts
├── user.api.ts
└── wishlistApi.ts
```

---

# ✨ Features

## 👤 User Features

### Authentication & Account

- User registration
- User login
- JWT-based authentication
- Access token and refresh token flow
- Secure logout
- User profile
- Update profile details
- Protected user routes

### 🛍️ Shopping

- Browse all active products
- Browse products by category
- Product details page
- Product search
- Recommended products
- Product filtering
- Product sorting
- Product pricing with discount price
- Product sizes
- Product colors
- Stock availability
- Responsive product cards

### ❤️ Wishlist

- Add products to wishlist
- Remove products from wishlist
- View wishlist
- Wishlist state management

### 🛒 Cart

- Add products to cart
- View cart
- Update item quantity
- Remove cart items
- Clear cart
- Automatic price calculation
- Discount price support
- Stock-aware cart operations

### 📍 Address Book

- Add multiple addresses
- View saved addresses
- Edit address
- Delete address
- Set a default address
- Use the selected/default address during checkout

### 💳 Checkout & Payments

- Checkout page
- Order summary
- Address selection
- Razorpay payment integration
- Create Razorpay payment order
- Place order after payment
- Order success page

### 📦 Orders

- View order history
- View individual order details
- Track order status
- Cancel orders where applicable
- View recent orders through the AI chatbot

### ⭐ Product Reviews

- Add product reviews
- View product reviews
- Update own review
- Delete own review
- Product rating recalculation

---

# 🏪 Seller Features

## Seller Authentication

- Seller registration
- Seller login
- JWT authentication
- Refresh token flow
- Seller logout
- Protected seller routes

## Seller Profile

- View seller profile
- Update seller profile
- Shop information
- Business address
- GST information
- Shop logo support
- Seller approval status
- Seller active/inactive status

## 📦 Product Management

- Add products
- Upload product images
- Edit products
- Delete products
- View seller's products
- Manage product price
- Manage discount price
- Manage stock
- Manage sizes
- Manage colors
- Manage brand
- Assign products to categories
- Activate/deactivate products

## 🧾 Order Management

- View seller orders
- View order details
- Update order status
- Manage order progress through seller dashboard

## 📊 Sales Analytics

- Seller sales dashboard
- Total sales
- Total orders
- Products sold
- Sales analytics data
- Sales/revenue visualization using Recharts

---

# 🛡️ Admin Features

## Admin Authentication

- Admin registration
- Admin login
- JWT authentication
- Refresh token flow
- Admin logout
- Protected admin routes

## 👥 Seller Management

- View all sellers
- Block seller
- Unblock seller
- Manage seller access
- Monitor seller approval/active status

## 🗂️ Category Management

- Create category
- View categories
- Update category
- Delete category
- Manage product categories

## 📊 Admin Dashboard

- Admin dashboard
- Seller management
- Category management
- Role-protected administration

---

# 🤖 AI Shopping Assistant

Shopora includes an AI chatbot powered by **Groq**.

### Chatbot capabilities

- Natural-language product search
- Product type search
- Brand search
- Color-based search
- Price-range search
- Stock/availability questions
- Product size queries
- Order lookup for logged-in users
- Helpful general store-related responses
- Product results displayed with product information

### Smart Search

- Fuzzy product matching using Fuse.js
- Handles common spelling mistakes
- Color synonym matching
- Supports terms such as red, maroon, crimson and similar color variations
- Separates product keywords, colors, and price filters before database search

### Example queries

```text
Show me a maroon lehenga under 1500
```

---


## 🔄 Application Flow

```
                    SHOPORA
                       │
        ┌──────────────┼──────────────┐
        │              │              │
       USER          SELLER          ADMIN
        │              │              │
   Browse Products   Manage Shop   Manage Sellers
        │              │              │
   Wishlist/Cart   Manage Products  Manage Categories
        │              │              │
     Checkout       Manage Orders      │
        │              │              │
     Razorpay       Sales Analytics    │
        │              │              │
      Orders ──────── Tracking ────────┘
        │
   Reviews / Address
        │
   AI Shopping Assistant
```
```
SHOPORA
                   │
    ┌──────────────┼──────────────┐
    │              │              │
   USER          SELLER          ADMIN
    │              │              │

Browse Products Manage Shop Manage Sellers
│ │ │
Wishlist/Cart Manage Products Manage Categories
│ │ │
Checkout Manage Orders │
│ │ │
Razorpay Sales Analytics │
│ │ │
Orde
```
---
## 📌 Main Pages

**User**
- Landing Page
- Shop
- Product Details
- Wishlist
- Cart
- Checkout
- Order Success
- My Orders
- Address Book
- User Profile
- Contact Us
- FAQ
- Returns
- Login / Register

**Seller**
- Seller Login / Register
- Seller Dashboard
- Seller Profile
- Seller Orders
- Add Product
- Edit Product

**Admin**
- Admin Login / Register
- Admin Dashboard
- Seller Management
- Category Management

---

## 🛠️ Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/sailotech-engineering-pocs/Shopora-ui.git
git clone https://github.com/sailotech-engineering-pocs/Shopora-service.git
```

### 2. Backend Setup

```bash
cd Shopora-service
npm install
```

Create a `.env` file:

```env
PORT=8080
MONGO_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

EMAIL_USER=your_email
EMAIL_PASS=your_gmail_app_password
CONTACT_RECEIVER_EMAIL=your_receiver_email

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

GROQ_API_KEY=your_groq_api_key

CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd Shopora-ui
npm install
```

Create a `.env` file:

```env
VITE_API_BASE_URL=https://shopora-backend-y33g.onrender.com
```

Start the frontend:

```bash
npm run dev
```

---

## 🏭 Production Build

Build the frontend:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Backend production start:

```bash
npm start
```

---

## 🌐 Deployment

| Layer | Platform |
|---|---|
| Frontend | Render (Static Site) |
| Backend | Render (Web Service) |
| Database | MongoDB Atlas |

---

## 📌 Known Limitations

- Admin panel currently limited to seller and category management (no product moderation or platform-wide analytics yet)
- No automated email notifications for order status updates
- Contact Us form is UI-only (no backend workflow yet)
- Returns page shows policy info only — no return-request workflow yet

---

## 📄 License

This project is developed for educational and portfolio purposes.

---

## 👩‍💻 Author

**Shopora — Multi-Role E-Commerce Platform**
Built using the MERN stack with payment integration, AI-powered product search, email functionality, role-based authentication, seller analytics, and admin management.

Built by Ayodhya Rode