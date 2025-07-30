# Bid Master - Backend API

## Overview
This is the backend API for Bid Master, an online auction management system built with Node.js, Express.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ``bash
   git clone <repository-url>
   cd BidMaster/Backend
   ```

2. **Install dependencies**
   ``bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the Backend directory:
   `env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bidmaster
   JWT_SECRET=your_jwt_secret_here
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```

4. **Start the server**
   ``bash
   npm start
   # or for development
   npm run dev
   ```

## 📁 Project Structure

`
Backend/
├── app.js                 # Main application entry point
├── config/               # Database and other configurations
├── Controllers/          # Route controllers
│   ├── BidUserControllers.js
│   ├── ItemControllers.js
│   ├── LoginControl.js
│   ├── PaymentController.js
│   ├── SellerController.js
│   ├── ShipmentController.js
│   └── UserControl.js
├── Model/               # Database models
│   ├── AuctionModel.js
│   ├── BidUserModel.js
│   ├── ItemModel.js
│   ├── SellerModel.js
│   ├── ShipmentModel.js
│   └── UserModel.js
├── Route/               # API routes
│   ├── BidUserRoutes.js
│   ├── ItemRoutes.js
│   ├── LoginRoute.js
│   ├── PaymentRoutes.js
│   ├── SellerRoute.js
│   ├── ShipmentRouter.js
│   └── UserRoute.js
├── utils/               # Utility functions
│   ├── auctionWinnerNotifier.js
│   ├── bidSendEmail.js
│   └── emailNotifications.js
└── uploads/            # File uploads directory
``

## 🔧 API Endpoints

### Authentication
POST /api/auth/login` - User login
- POST /api/auth/register` - User registration
- POST /api/auth/logout` - User logout

### Items & Auctions
- GET /api/items` - Get all items
- POST /api/items` - Create new item
- GET /api/items/:id` - Get item by ID
- PUT /api/items/:id` - Update item
- DELETE /api/items/:id` - Delete item

### Bidding
- POST /api/bids` - Place a bid
- GET /api/bids/:itemId` - Get bids for an item
- GET /api/bids/user/:userId` - Get user's bids

### Payments
- POST /api/payment/create-payment-intent` - Create Stripe payment intent
- POST /api/payment/webhook` - Stripe webhook handler

### Shipments
- POST /api/shipments` - Create shipment
- GET /api/shipments` - Get all shipments
- PUT /api/shipments/:id` - Update shipment status

### Sellers
- GET /api/sellers` - Get all sellers
- POST /api/sellers` - Create seller profile
- PUT /api/sellers/:id` - Update seller profile

## 🔐 Security Features

- **JWT Authentication** - Secure user sessions
- **Password Hashing** - bcrypt for password security
- **Input Validation** - Request data validation
- **CORS Configuration** - Cross-origin resource sharing
- **Rate Limiting** - API request throttling

  ## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop** - Full feature set
- **Tablet** - Optimized layout
- **Mobile** - Touch-friendly interface

## 🔐 Security Features

- **JWT Token Management** - Secure authentication
- **Protected Routes** - Role-based access control
- **Input Validation** - Form validation and sanitization
- **HTTPS Support** - Secure communication

## 📧 Real-time Features

- **Live Bidding** - Real-time bid updates
- **Email Notifications** - Automated email alerts
- **Status Updates** - Real-time status changes
- **Chat Support** - User communication

## 🎨 Styling

### CSS Architecture
- **Component-based CSS** - Each component has its own styles
- **Responsive Design** - Mobile-first approach
- **Modern UI** - Clean and intuitive interface
- **Accessibility** - WCAG compliant design

### Color Scheme
- **Primary** - Professional blue theme
- **Secondary** - Accent colors for highlights
- **Success/Error** - Clear status indicators


## 📧 Email Notifications

The system sends automated emails for:
- Bid confirmations
- Outbid notifications
- Auction winner notifications
- Payment confirmations
- Shipment updates

## 🛠️ Development

### Running in Development Mode
bash
npm start


### Running Tests
bash
npm test


### Database Migrations
bash
# Ensure MongoDB is running
mongod


## 📦 Dependencies

### Core Dependencies
 express` - Web framework
- mongoose` - MongoDB ODM
- bcryptjs` - Password hashing
- jsonwebtoken` - JWT authentication
- stripe` - Payment processing
- nodemailer` - Email sending
- multer` - File uploads
- cors` - Cross-origin requests

### Development Dependencies
- nodemon` - Auto-restart on file changes
- dotenv` - Environment variables

## 🔧 Configuration

### Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| PORT` | Server port | Yes |
| MONGODB_URI` | MongoDB connection string | Yes |
| JWT_SECRET` | JWT signing secret | Yes |
| STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| EMAIL_USER` | Email username | Yes |
| EMAIL_PASS` | Email password | Yes |

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Setup for Production
1. Set all required environment variables
2. Ensure MongoDB is accessible
3. Configure CORS for your domain
4. Set up SSL certificates
5. Configure reverse proxy (nginx/apache)


## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please contact the development team or create an issue in the repository.

# Bid Master - Frontend

## Overview
This is the frontend application for Bid Master, built with React.js. It provides a modern, responsive user interface for the online auction management system.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend API running (see Backend README)

### Installation

1. **Clone the repository**
   ``bash
   git clone <repository-url>
   cd BidMaster/frontend
   ```

2. **Install dependencies**
   ``bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the frontend directory:
   ``env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Start the development server**
   ``bash
   npm start
   ``
   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.


## 🎯 Key Features

### User Authentication
- **Login/Register** - Secure user authentication
- **Profile Management** - Update user information
- **Role-based Access** - Different dashboards for different user types

### Auction Management
- **Item Listing** - Sellers can list items for auction
- **Bidding Interface** - Real-time bidding system
- **Auction Timer** - Countdown timers for active auctions
- **Bid History** - Track all bids on items

### Payment Processing
- **Stripe Integration** - Secure payment processing
- **Payment Confirmation** - Success/failure handling
- **Order Summary** - Detailed payment information

### Shipping Management
- **Shipment Tracking** - Real-time delivery updates
- **Courier Assignment** - Admin can assign couriers
- **Status Updates** - Shipping status notifications

### Admin Features
- **HR Management** - Employee and role management
- **Item Inspection** - Review and approve items
- **Report Generation** - Sales and activity reports
- **User Management** - Admin user controls

## 🎨 UI Components

### Core Components
- **Navigation** - Responsive navigation bar
- **Sidebar** - Collapsible sidebar menu
- **NotificationBell** - Real-time notifications
- **Modal** - Reusable modal dialogs

### Dashboard Components
- **SellerDashboard** - Seller management interface
- **BidDashboard** - Bidding interface
- **ShipmentDashboard** - Shipping management
- **HRDashboard** - HR management interface

### Form Components
- **AddItem** - Item creation form
- **Login/Register** - Authentication forms
- **Profile** - User profile management

