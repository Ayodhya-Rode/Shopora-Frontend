# Shopora — E-Commerce Platform (Frontend)

Shopora is a full-featured multi-role e-commerce platform built with React and TypeScript, supporting Users, Sellers, and Admins.

## 🚀 Tech Stack

- **React 18** + **TypeScript**
- **Vite** — build tool
- **Tailwind CSS** — styling
- **React Router** — routing
- **Axios** — API calls
- **React Hot Toast** — notifications

## ✨ Features

- User authentication (register, login, profile, address book)
- Product browsing, categories, search, wishlist
- Cart & checkout with Razorpay payment integration
- Order tracking & order history
- Product reviews
- Seller dashboard — add/edit products, manage orders, sales analytics
- Admin dashboard — manage sellers, categories
- Contact Us form & Newsletter subscription (email notifications via backend)
- AI Chatbot widget
- Light/Dark theme support

## 📁 Project Structure

\`\`\`
src/
├── api/            Axios API calls
├── components/     Reusable UI components (landing, product, seller, admin)
├── context/        React Context (Auth, Cart, Wishlist, Theme)
├── pages/          Route-level pages
├── routes/         Protected route wrappers
├── types/          TypeScript types
├── utils/          Helper functions
\`\`\`

## 🛠️ Setup & Installation

**1. Clone the repository**

\`\`\`bash
git clone https://github.com/<your-username>/shopora-frontend.git
cd shopora-frontend
\`\`\`

**2. Install dependencies**

\`\`\`bash
npm install
\`\`\`

**3. Create a `.env` file in the root and add**

\`\`\`env
VITE_API_BASE_URL=http://localhost:PORT/api
\`\`\`

**4. Run the development server**

\`\`\`bash
npm run dev
\`\`\`

**5. Build for production**

\`\`\`bash
npm run build
\`\`\`

## 🔗 Related Repositories

- Backend: [shopora-backend](https://github.com/<your-username>/shopora-backend)

## 📄 License

This project is for educational/portfolio purposes.