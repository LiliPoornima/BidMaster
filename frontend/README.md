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
   ```bash
   git clone <repository-url>
   cd BidMaster/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 📁 Project Structure

```
frontend/
├── public/                 # Static files
│   ├── index.html
│   ├── BidImages/         # Auction item images
│   └── images/           # UI images and icons
├── src/
│   ├── Components/        # React components
│   │   ├── AboutUs/      # About page component
│   │   ├── AddItem/      # Item creation form
│   │   ├── BidDashboard/ # Bidding interface
│   │   ├── Home/         # Landing page
│   │   ├── Login/        # Authentication
│   │   ├── Nav/          # Navigation
│   │   ├── Payment/      # Payment processing
│   │   ├── Profile/      # User profile
│   │   ├── Register/     # User registration
│   │   ├── SellerDashboard/ # Seller management
│   │   ├── ShipmentDashboard/ # Shipping management
│   │   └── ...           # Other components
│   ├── assets/           # Static assets
│   ├── styles/           # Global styles
│   ├── App.js            # Main app component
│   └── index.js          # Entry point
└── package.json
```

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

## 🔧 Available Scripts

### Development
```bash
npm start          # Start development server
npm test           # Run tests
npm run build      # Build for production
npm run eject      # Eject from Create React App
```

### Production
```bash
npm run build      # Create optimized build
npm run serve      # Serve production build locally
```

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

## 📦 Dependencies

### Core Dependencies
- `react` - UI library
- `react-dom` - DOM rendering
- `react-router-dom` - Client-side routing
- `axios` - HTTP client
- `stripe-js` - Payment processing

### UI Dependencies
- `@stripe/stripe-js` - Stripe integration
- `react-icons` - Icon library
- `react-toastify` - Notifications

### Development Dependencies
- `@testing-library/react` - Testing utilities
- `@testing-library/jest-dom` - DOM testing
- `web-vitals` - Performance monitoring

## 🔧 Configuration

### Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_API_URL` | Backend API URL | Yes |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | Stripe public key | Yes |

### API Configuration
- Base URL configuration
- Request/response interceptors
- Error handling
- Loading states

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Various Platforms
- **Netlify** - Static site hosting
- **Vercel** - React deployment
- **AWS S3** - Static website hosting
- **Heroku** - Full-stack deployment

## 🧪 Testing

### Running Tests
```bash
npm test           # Run all tests
npm test -- --watch  # Watch mode
npm test -- --coverage  # Coverage report
```

### Test Structure
- **Unit Tests** - Component testing
- **Integration Tests** - API integration
- **E2E Tests** - User workflow testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please contact the development team or create an issue in the repository.

## 🔗 Related Links

- [Backend API Documentation](../Backend/README.md)
- [Project Overview](../README.md)
- [API Documentation](../Backend/README.md#api-endpoints)
