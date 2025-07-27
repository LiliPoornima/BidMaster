import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaBox, FaMapMarkedAlt, FaUser, FaEnvelope, FaPhone,
  FaWeight, FaTruck, FaDollarSign, FaTrash
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UserShipmentTracker.css';

function UserShipmentTracker({ userEmail }) {
  const [shipments, setShipments] = useState([]);
  const [couriers, setCouriers] = useState([]);

  useEffect(() => {
    if (userEmail) {
      fetchUserShipments();
      fetchCouriers();
    }
  }, [userEmail]);

  // Fetch shipments filtered by user email directly from backend
  const fetchUserShipments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/shipment/user/${encodeURIComponent(userEmail)}`);
      setShipments(res.data);
    } catch (err) {
      toast.error('Failed to fetch shipments');
    }
  };

  const fetchCouriers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/courier/all');
      setCouriers(res.data);
    } catch (err) {
      toast.error('Failed to fetch couriers');
    }
  };

  const getCourierRate = (shipmenttype) => {
    const courier = couriers.find(c => c.companyname === shipmenttype);
    return courier ? courier.rateperkg : 0;
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this shipment?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/shipment/delete/${id}`);
      toast.success("Shipment deleted");
      fetchUserShipments();  // refresh after delete
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  if (!userEmail) return <p>Please provide a valid user email.</p>;

  return (
    <div className="all-shipment-card-wrapper">
      <ToastContainer position="top-center" />
      <div className="all-shipment-card-container">
        <h1 className="all-shipment-card-title">My Shipments</h1>

        {shipments.length === 0 ? (
          <p>No shipments found for {userEmail}</p>
        ) : (
          <div className="all-shipment-grid">
            {shipments.map((s) => {
              const rate = getCourierRate(s.shipmenttype);
              const cost = rate * s.weight;

              return (
                <div className="shipment-card" key={s._id}>
                  <div className="shipment-status">{s.status || "Pending"}</div>

                  <h3 className="shipment-card-title"><FaBox /> {s.itemname}</h3>
                  <div className="shipment-card-details">
                    <p><span><FaMapMarkedAlt /> To:</span> {s.to}</p>
                    <p><span><FaUser /> Buyer:</span> {s.buyername}</p>
                    <p><span><FaEnvelope /> Email:</span> {s.buyeremail}</p>
                    <p><span><FaPhone /> Phone:</span> {s.buyerphone}</p>
                    <p><span><FaWeight /> Weight:</span> {s.weight} kg</p>
                    <p><span><FaTruck /> Courier:</span> {s.shipmenttype || 'Not Assigned'}</p>
                    <p><span><FaDollarSign /> Cost:</span> <span className="shipment-card-cost">Rs. {cost.toFixed(2)}</span></p>
                  </div>

                  <div className="shipment-card-actions">
                    <button className="shipment-btn-delete" onClick={() => handleDelete(s._id)}>
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserShipmentTracker;
