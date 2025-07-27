import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdateShipmentStatus.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UpdateShipmentStatus() {
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/shipment/all');
      setShipments(res.data);
    } catch (err) {
      toast.error("Failed to fetch shipments");
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/shipment/status/${id}`, {
        status: newStatus
      });
      toast.success(`Shipment marked as ${newStatus}`);
      fetchShipments();
    } catch (err) {
      console.error("Status update failed:", err.response?.data || err.message);
      toast.error("Failed to update shipment status");
    }
  };

  return (
    <div className="updateShipment-container">
      <h2 className="updateShipment-title">Update Shipment Status</h2>
      <ul className="updateShipment-list">
        {shipments.map((s) => (
          <li className="updateShipment-item" key={s._id}>
            <div className="updateShipment-info">
              <strong>{s.itemname}</strong> - Status:{" "}
              <span className="updateShipment-status">{s.status}</span>
            </div>

            {/* ✅ Only show buttons if not Delivered */}
            {s.status !== "Delivered" && (
              <div className="updateShipment-buttons">
                
                <button
                  className="updateShipment-btn updateShipment-intransit-btn"
                  onClick={() => updateStatus(s._id, 'In Transit')}
                >
                  In Transit
                </button>
                <button
                  className="updateShipment-btn updateShipment-out-btn"
                  onClick={() => updateStatus(s._id, 'Out for Delivery')}
                >
                  Out for Delivery
                </button>
                <button
                  className="updateShipment-btn updateShipment-delivered-btn"
                  onClick={() => updateStatus(s._id, 'Delivered')}
                >
                  Delivered
                </button>
                <button
                  className="updateShipment-btn updateShipment-delayed-btn"
                  onClick={() => updateStatus(s._id, 'Delayed')}
                >
                  Delayed
                </button>
                <button
                  className="updateShipment-btn updateShipment-returned-btn"
                  onClick={() => updateStatus(s._id, 'Returned to Sender')}
                >
                  Returned
                </button>
                <button
                  className="updateShipment-btn updateShipment-cancelled-btn"
                  onClick={() => updateStatus(s._id, 'Cancelled')}
                >
                  Cancelled
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UpdateShipmentStatus;
