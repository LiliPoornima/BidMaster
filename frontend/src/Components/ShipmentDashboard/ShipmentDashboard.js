import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ShipmentDashboard.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ShipmentDashboard() {
  const [bidderProfiles, setBidderProfiles] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [formInputs, setFormInputs] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchBidderProfiles();
    fetchShipments();
    fetchCouriers();
  }, []);

  const fetchBidderProfiles = async () => {
    try {
      const res = await axios.get('http://localhost:5000/bid-ship-users');
      if (Array.isArray(res.data.bidShipUsers)) {
        setBidderProfiles(res.data.bidShipUsers);
      } else {
        toast.error("Invalid response format");
      }
    } catch (err) {
      toast.error("Failed to fetch bidder profiles");
    }
  };

  const fetchShipments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/shipment/all');
      setShipments(res.data);
    } catch (err) {
      toast.error("Failed to fetch shipments");
    }
  };

  const fetchCouriers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/courier/all');
      setCouriers(res.data);
    } catch (err) {
      toast.error("Failed to fetch couriers");
    }
  };

  const handleInputChange = (id, field, value) => {
    setFormInputs(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      }
    }));
  };

  const handleCreateShipment = async (profileId) => {
    const profile = bidderProfiles.find(p => p._id === profileId);
    const input = formInputs[profileId];

    if (!input?.itemid || !input?.itemname || !input?.weight || !input?.courierCompany) {
      toast.error("All fields are required");
      return;
    }

    const shipmentData = {
      itemid: input.itemid,
      itemname: input.itemname,
      to: profile.shippingAddress,
      collectionCenter: "Main Collection Center",
      sellername: "Auto-filled",
      selleremail: "auto@example.com",
      sellerphone: "0000000000",
      buyername: profile.fullname,
      buyeremail: profile.email,
      buyerphone: profile.mobileNo,
      weight: input.weight,
      shipmenttype: input.courierCompany,
    };

    try {
      await axios.post('http://localhost:5000/api/shipment/create', shipmentData);
      toast.success("Shipment created");
      setFormInputs(prev => ({ ...prev, [profileId]: {} }));
      fetchShipments();
    } catch (err) {
      toast.error("Shipment creation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this shipment?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/shipment/delete/${id}`);
      toast.success("Shipment deleted");
      fetchShipments();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleEditClick = (shipment) => {
    setEditingId(shipment._id);
    setEditFormData({
      itemid: shipment.itemid,
      itemname: shipment.itemname,
      to: shipment.to,
      buyername: shipment.buyername,
      buyeremail: shipment.buyeremail,
      buyerphone: shipment.buyerphone,
      weight: shipment.weight,
      shipmenttype: shipment.shipmenttype,
      status: shipment.status,
    });
  };

  const handleEditChange = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveClick = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/shipment/update/${id}`, editFormData);
      toast.success("Shipment updated");
      setEditingId(null);
      fetchShipments();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditFormData({});
  };

  return (
    <div className="shipment-dashboard">
      <ToastContainer position="top-center" />
      <h2>Shipment Management </h2>

      <div className="shipment-input-section">
        {bidderProfiles.map((profile) => {
          const input = formInputs[profile._id] || {};
          return (
            <div key={profile._id} className="shipment-bidder-card">
              <strong>{profile.fullname}</strong> - {profile.email}<br />
              Address: {profile.shippingAddress}, {profile.postalCode}, {profile.country}<br />
              Phone: {profile.mobileNo}
              <div className="shipment-input-row">
                <input type="text" placeholder="Item ID"
                  value={input.itemid || ''} onChange={(e) => handleInputChange(profile._id, 'itemid', e.target.value)} />
                <input type="text" placeholder="Item Name"
                  value={input.itemname || ''} onChange={(e) => handleInputChange(profile._id, 'itemname', e.target.value)} />
                <input type="number" placeholder="Weight (kg)"
                  value={input.weight || ''} onChange={(e) => handleInputChange(profile._id, 'weight', e.target.value)} />
                <select
                  value={input.courierCompany || ''}
                  onChange={(e) => handleInputChange(profile._id, 'courierCompany', e.target.value)}
                >
                  <option value="">Select Courier</option>
                  {couriers.map((c) => (
                    <option key={c._id} value={c.companyname}>{c.companyname}</option>
                  ))}
                </select>
                <button onClick={() => handleCreateShipment(profile._id)}>Create Shipment</button>
              </div>
            </div>
          );
        })}
      </div>

      <h3 className="shipment-subtitle">All Shipments</h3>
      <table className="shipment-table">
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Item Name</th>
            <th>To (Address)</th>
            <th>Buyer Name</th>
            <th>Buyer Email</th>
            <th>Buyer Phone</th>
            <th>Weight</th>
            <th>Courier</th>
            <th>Shipping Cost ($)</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((s) => {
            const courier = couriers.find(c => c.companyname === s.shipmenttype);
            const rate = courier ? courier.rateperkg : 0;
            const cost = s.weight * rate;

            return (
              <tr key={s._id}>
                <td>{editingId === s._id
                  ? <input value={editFormData.itemid} onChange={(e) => handleEditChange('itemid', e.target.value)} />
                  : s.itemid}</td>
                <td>{editingId === s._id
                  ? <input value={editFormData.itemname} onChange={(e) => handleEditChange('itemname', e.target.value)} />
                  : s.itemname}</td>
                <td>{editingId === s._id
                  ? <input value={editFormData.to} onChange={(e) => handleEditChange('to', e.target.value)} />
                  : s.to}</td>
                <td>{editingId === s._id
                  ? <input value={editFormData.buyername} onChange={(e) => handleEditChange('buyername', e.target.value)} />
                  : s.buyername}</td>
                <td>{editingId === s._id
                  ? <input value={editFormData.buyeremail} onChange={(e) => handleEditChange('buyeremail', e.target.value)} />
                  : s.buyeremail}</td>
                <td>{editingId === s._id
                  ? <input value={editFormData.buyerphone} onChange={(e) => handleEditChange('buyerphone', e.target.value)} />
                  : s.buyerphone}</td>
                <td>{editingId === s._id
                  ? <input type="number" value={editFormData.weight} onChange={(e) => handleEditChange('weight', e.target.value)} />
                  : s.weight}</td>
                <td>{editingId === s._id
                  ? (
                    <select value={editFormData.shipmenttype} onChange={(e) => handleEditChange('shipmenttype', e.target.value)}>
                      <option value="">Select Courier</option>
                      {couriers.map((c) => (
                        <option key={c._id} value={c.companyname}>{c.companyname}</option>
                      ))}
                    </select>
                  ) : s.shipmenttype}</td>
                <td>{rate && s.weight ? `$ ${cost.toFixed(2)}` : 'N/A'}</td>
                <td>{editingId === s._id
                  ? <input value={editFormData.status} onChange={(e) => handleEditChange('status', e.target.value)} />
                  : s.status}</td>
                <td>
                  {editingId === s._id ? (
                    <>
                      <button className="shipment-btn save-btn" onClick={() => handleSaveClick(s._id)}>Save</button>
                      <button className="shipment-btn cancel-btn" onClick={handleCancelClick}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="shipment-btn edit-btn" onClick={() => handleEditClick(s)}>Edit</button>
                      <button className="shipment-btn shipment-delete-btn" onClick={() => handleDelete(s._id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ShipmentDashboard;
