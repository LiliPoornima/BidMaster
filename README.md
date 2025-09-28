# Bid Master - Online Auction Platform

Full-stack auction system with real-time bidding, secure payments, and auction management.

## 🛠️ Tech Stack
React.js • Node.js • MongoDB • Stripe • JWT

## ✨ Features

**🎯 Auction System**
- Live bidding with real-time updates
- Countdown timers for active auctions
- Comprehensive bid history tracking
- Item categorization and search

**💳 Payment & Security**
- Stripe payment processing
- JWT authentication & authorization
- Password encryption (bcrypt)
- Secure API endpoints

**📊 Management Dashboard**
- Seller inventory management
- Admin approval system
- Sales analytics & reporting
- User role management

**📧 Communication**
- Email notifications (bids, wins, payments)
- Real-time status updates
- Shipment tracking
- Support chat system

## 📁 Project Structure

```
BidMaster/
├── Backend/
│   ├── Controllers/          # API route handlers
│   ├── Model/               # Database models
│   ├── Route/               # API routes
│   ├── utils/               # Email & notification utilities
│   └── app.js               # Main server entry
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   ├── pages/           # Page components
    │   └── utils/           # Frontend utilities
    └── public/              # Static assets
```

![Dashboard](https://github.com/user-attachments/assets/fd19aeac-f872-4437-97c7-d0c6bf79b75b)
![Bidding](https://github.com/user-attachments/assets/32eb0460-465d-4859-ba5f-d6bd93ce172b)
![Management](https://github.com/user-attachments/assets/24f1261e-b568-4bbb-83fc-225ab28daffb)
![Payment](https://github.com/user-attachments/assets/fb16ecbe-fdc3-48ab-a1c0-eb8e0b936376)
![Profile](https://github.com/user-attachments/assets/a5569dd6-138b-4f8a-85b3-73e08acbb1f2)
![Analytics](https://github.com/user-attachments/assets/408c2e9b-b965-4ee5-bcfe-45a22fc926c8)
![Items](https://github.com/user-attachments/assets/aedcbe01-3a56-43d7-b00a-a4d33941f620)
![Shipping](https://github.com/user-attachments/assets/41cb6abe-b820-4bc3-9591-954c31c6396f)
![Admin](https://github.com/user-attachments/assets/d9e2eee7-8ebc-44c3-863b-fe520118048a)
![Reports](https://github.com/user-attachments/assets/7c934ce0-ff12-4451-b90b-f15fe0182acd)
![Settings](https://github.com/user-attachments/assets/036c74ed-72d3-4fd2-9adf-9fff6664cff8)
![Orders](https://github.com/user-attachments/assets/a553f7b1-dc08-464f-a7f3-1f3b4bd9d7bb)
![Notifications](https://github.com/user-attachments/assets/7fda67d6-cdd3-4021-b53e-5f2dae382d1b)
![Mobile](https://github.com/user-attachments/assets/9aa89ca3-0d5f-4be5-b2be-00a9acc154a2)
![Search](https://github.com/user-attachments/assets/2de9a7cb-06bd-433d-b9f6-dd31ccb8a7e1)
![Chat](https://github.com/user-attachments/assets/fbf851c5-40bd-4a6b-aa3f-1d4b59ac4e0e)

## 🚀 Quick Setup

```bash
# Backend
cd BidMaster/Backend
npm install
npm start

# Frontend  
cd ../frontend
npm install
npm start
```

**Environment:** Create `.env` with MongoDB URI, JWT secret, Stripe keys, and email config.

## 🎯 User Roles
**Buyers:** Browse, bid, pay, track orders  
**Sellers:** List items, monitor bids, manage inventory  
**Admins:** User management, approvals, reports

---
**Built with ❤️ for seamless auctions**
