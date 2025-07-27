const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./Route/UserRoute");
const loginRoutes = require("./Route/LoginRoute"); // Import login route
const empRoutes = require("./Route/EmpRoute");
const payrollRoutes = require("./Route/PayrollRoute");
const bidUserRoutes = require("./Route/BidUserRoutes");
const bidShipRoutes = require("./Route/BidShipRoutes");
const bidFeedbackUserRoutes = require("./Route/BidFeedbackUserRoutes");
const shipmentRouter = require("./Route/ShipmentRouter.js");
const shipperRouter = require("./Route/ShipperRouter.js");
const taskRoutes = require('./Route/TaskRoute');
const notificationRoutes = require('./Route/TaskNotificationRoute');
const bidNowRoutes = require("./Route/BidNowRoutes");





const Stripe = require('stripe');
require('dotenv').config();
require('./utils/TaskReminder');
require('./utils/auctionWinnerNotifier');




const path = require('path');
//const SellerRoute = require("./Route/SellerRoute");
const sellerProfileRoutes = require("./Route/SellerProfileRoute");

const multer = require("multer");
const fs = require("fs"); // Add fs for file deletion


// Initialize Stripe with your secret key from .env
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

//im

const itemRouter = require("./Route/ItemRoutes")
const reportRouter = require("./Route/ReportRoutes");

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


//app.use("/item", SellerRoute);
app.use('/seller', sellerProfileRoutes);

app.use("/files", express.static(path.join(__dirname, "../frontend/src/Components/ImgUploader/files")));


app.use('/api/shipment', shipmentRouter);
app.use("/api/courier", shipperRouter);


// Define routes
app.use("/users", userRoutes); // User registration routes
app.use("/auth", loginRoutes); // Login route
app.use("/api/employees", empRoutes);
app.use("/api/payroll", payrollRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);


// Mount API routes
app.use("/bid-users", bidUserRoutes);
app.use("/bid-ship-users", bidShipRoutes);
app.use("/bid-feedback-users", bidFeedbackUserRoutes);
app.use("/api/bid-now", bidNowRoutes);

app.use('/api/users', require('./Route/UserRoute'));
app.use('/api/bid-users', require('./Route/BidUserRoutes'));
// Add the Stripe webhook route - must be before express.json() middleware
app.use('/api/stripe', require('./Route/stripeWebhook'));




//im
app.use("/reports", reportRouter);
app.use("/items", itemRouter);

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://admin_2001:Z6sSWhMJtKgRal0o@cluster0.ceiyn.mongodb.net/")
  .then(() => console.log("Connected to MongoDB"))
  .then(() => {
   app.listen(5000);
  })
  .catch((err) => console.log(err));



  // Image Handling
const ImgSchema = require("./Model/ImgModel");

const storageimg = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../frontend/src/Components/ImgUploader/files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const uploadimg = multer({ storage: storageimg });

app.post("/upload-img", uploadimg.single("image"), async (req, res) => {
  const imageName = req.file.filename;
  try {
    await ImgSchema.create({ image: imageName });
    res.json({ status: "ok" });
  } catch (error) {
    res.json({ status: "error", error: error.message });
  }
});

app.get("/getImage", async (req, res) => {
  try {
    const data = await ImgSchema.find({});
    res.json({ status: "ok", data: data });
  } catch (error) {
    res.json({ status: "error", error: error.message });
  }
});

// New Delete Endpoint
app.delete("/delete-image/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the image document
    const imageDoc = await ImgSchema.findById(id);
    if (!imageDoc) {
      return res.status(404).json({ status: "error", message: "Image not found" });
    }

    // Delete the file from the filesystem
    const filePath = path.join(__dirname, "../frontend/src/Components/ImgUploader/files", imageDoc.image);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Remove the file
    }

    // Delete the document from MongoDB
    await ImgSchema.findByIdAndDelete(id);

    res.json({ status: "ok", message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

app.post('/create-checkout-session', async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const frontendPort = req.body.frontendPort || 3000;
    console.log('Using frontendPort:', frontendPort); // Debug log
    const items = req.body.items || [{ name: 'Auction Item', price: 1000, quantity: 1 }];

    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `http://localhost:${frontendPort}/success`,
      cancel_url: `http://localhost:${frontendPort}/cancel`,
    });
    res.json({ id: session.id });
  } catch (error) {
    console.error('FULL Checkout session error:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message,
      stack: error.stack 
    });
  }
});

app.post('/create-checkout-session', async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const frontendPort = req.body.frontendPort || 3000;
    console.log('Using frontendPort:', frontendPort); // Debug log
    const items = req.body.items || [{ name: 'Auction Item', price: 1000, quantity: 1 }];

    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `http://localhost:${frontendPort}/success`,
      cancel_url: `http://localhost:${frontendPort}/cancel`,
    });
    res.json({ id: session.id });
  } catch (error) {
    console.error('FULL Checkout session error:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message,
      stack: error.stack 
    });
  }
});


