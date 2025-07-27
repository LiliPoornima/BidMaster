
import { Routes, Route } from "react-router-dom";
import React from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import "./App.css";
import Sidebar from "./Components/Sidebar/Sidebar.js";
import Nav from "./Components/Nav/Nav";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";


//hr
import AddEmployee from "./Components/AsignRoles/AddEmployee";
import EmployeeDashboard from "./Components/AsignRoles/EmployeeDashboard";
import AboutUs from "./Components/AboutUs/AboutUs";
import Footer from "./Components/Footer/Footer";
import ContactUs from "./Components/ContactUs/ContactUs";
import UpdateEmployee from "./Components/AsignRoles/UpdateEmployee";
import Terms from "./Components/Terms/Terms";
import EmployeeDetails from "./Components/EmployeeDetails/EmployeeDetails";
import Payroll from "./Components/Payroll/Payroll";
import Profile from "./Components/Profile/Profile";
import TaskDashboard from './Components/TaskDashboard/TaskDashboard';
import HRDashboard from "./Components/HRDashboard/HRDashboard.js";

//im

import AddReport from "./Components/AddReport/AddReport";
import UpdateReport from "./Components/UpdateReport/UpdateReport";
import InspectionDashboard from "./Components/InspectionDashboard/InspectionDashboard";
import ReportedItems from "./Components/ReportedItems/ReportedItems";
import ItemForm from "./Components/ItemForm/ItemForm";
import ItemsGallery from "./Components/ItemsGallery/ItemsGallery";
import ItemManager from "./Components/ItemManager/ItemManager";
import EditItem from "./Components/ItemForm/EditItem";
import ItemView from "./Components/ItemView/ItemView"; 

//sl
import SellerDashboard from './Components/SellerDashboard/SellerDashboard';
import SellerListings from './Components/SellerListings/SellerListings';
import AddItem from './Components/AddItem/AddItem';
import SellUpdateItem from './Components/SellUpdateItem/SellUpdateItem';
import ImgUploader from './Components/ImgUploader/ImgUploader';
import SellerProfile from './Components/SellerProfile/SellerProfile';





// Bidder profile
import BidderProfile from './Components/BidderProfile/BidderProfile';
import EditBidderProfile from './Components/BidderProfile/EditBidderProfile';
// Bidder ship
import BidShipProfile from './Components/BidShipUsers/BidShipProfile';
import BidShipUsersDetails from './Components/BidShipUsers/BidShipUsersDetails';
import BidShipSuccess from "./Components/BidShipUsers/BidShipSuccess";
// Bidder feedback
import BidFeedbackPage from './Components/BidFeedbackUsers/BidFeedbackPage';
// Bidder pay
import Checkout from './Components/Payment/Checkout.js';
import Success from './Components/Payment/Success.js';
import Cancel from './Components/Payment/Cancel.js';
// Bidder dashboard
import BidDashboard from './Components/BidDashboard/BidDashboard';
// BidNowBidder component
import BidNowBidder from './Components/BidNowBidder/BidNowBidder';


//shipping
import ShipManageDash from './Components/ShipManageDash/ShipManageDash';
import CourierDashboard from './Components/CourierDashboard/CourierDashboard';
import ShipmentDashboard from './Components/ShipmentDashboard/ShipmentDashboard';
import UserShipmentTracker from './Components/UserShipmentTracker/UserShipmentTracker';
import UpdateShipmentStatus from './Components/UpdateShipmentStatus/UpdateShipmentStatus';
import AllShipmentCards from './Components/AllShipmentCards/AllShipmentCards';




//const Placeholder = ({ pageName }) => <h2>{pageName} Page (Under Construction)</h2>;

function App() {

  const loggedInUserEmail = localStorage.getItem("loggedInUserEmail");
  return (
    <div >
   
   <Nav></Nav>
   <Sidebar></Sidebar>

   <ToastContainer />

    <React.Fragment>
      <Routes>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/addEmployee" element={<AddEmployee/>}/>
        <Route path="/employeeDashboard" element={<EmployeeDashboard/>}/>
        <Route path="/aboutUs" element={<AboutUs/>}/>
        <Route path="/contactUs" element={<ContactUs/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/terms" element={<Terms/>}/>
        <Route path="/payroll" element={<Payroll/>}/>
        <Route path="/employeeDashboard/:id" element={<UpdateEmployee/>}/>
        <Route path="/employeeDetails/:id" element={<EmployeeDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tasks" element={<TaskDashboard />} />
        <Route path="/hrDashboard" element={<HRDashboard />} />




        {/* Inspection route */}
          <Route path="/inspectionDashboard" element={<InspectionDashboard/>}/>
          <Route path="/item-manager" element={<ItemManager/>} />
          <Route path="/item/:id" element={<ItemView />} />
          <Route path="/edit-item/:id" element={<EditItem />} />
          <Route path="/items-gallery" element={<ItemsGallery />} />
          <Route path="/flagged-items" element={<ReportedItems/>}/>
          <Route path="/flagged-items/:_id" element={<UpdateReport/>}/>
          <Route path="/add-report" element={<AddReport/>}/>
          <Route path="/item-form" element={<ItemForm />} />
       
         
          

         {/* Seller route */}
         <Route path="/seller-listing" element={<SellerListings/>}/>
         <Route path="/upload-img" element={<ImgUploader/>}/>
         <Route path="/seller-dashboard" element={<SellerDashboard />} />
         <Route path="/seller-dashboard/:id" element={<SellUpdateItem />} />
         <Route path="/seller-profile" element={<SellerProfile />} />
         <Route path="/add-item" element={<AddItem />} />


 
      

          {/* Bidder profile */}
          <Route path="/bidder-profile" element={<BidderProfile />} />
          <Route path="/edit-bidder-profile" element={<EditBidderProfile />} />
          <Route path="/BidderProfile" element={<BidderProfile />} />

          {/* Bidder ship details */}
          <Route path="/BidShipProfile" element={<BidShipProfile />} />
          <Route path="/bid-ship-users-details" element={<BidShipUsersDetails />} />
          <Route path="/bid-ship-success" element={<BidShipSuccess />} />
          <Route path="/shipping" element={<BidShipProfile />} />

          {/* Bid feedback details */}
          <Route path="/BidFeedbackPage" element={<BidFeedbackPage />} />

          {/* Payment */}
           <Route path="/payment/:id" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />

          {/* Bidder dashboard */}
          <Route path="/BidDashboard" element={<BidDashboard />} />

          {/* BidNowBidder route */}
          <Route path="/bid-now/:itemId?" element={<BidNowBidder />} />
         

          {/* shipping route */}
          <Route path="/shipmanagedash" element={<ShipManageDash />} />
          <Route path="/couriers" element={<CourierDashboard />} />
          <Route path="/shipments" element={<ShipmentDashboard />} />
          <Route path="/status" element={<UpdateShipmentStatus />} />
          <Route path="/all-shipments-card" element={<AllShipmentCards />} />
          <Route path="/track" element={<UserShipmentTracker userEmail={loggedInUserEmail} />} />

      </Routes>
    </React.Fragment>


   <Footer></Footer>
    </div>
  );
}

export default App;
