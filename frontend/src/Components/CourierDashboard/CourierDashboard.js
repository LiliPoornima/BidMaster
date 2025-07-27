import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CourierDashboard.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CourierDashboard() {
  const [couriers, setCouriers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    providerid: '',
    companyname: '',
    contactnumber: '',
    rateperkg: '',
    companytype: '',
  });

  useEffect(() => {
    fetchCouriers();
  }, []);

  const fetchCouriers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/courier/all');
      setCouriers(res.data);
    } catch (error) {
      toast.error("Failed to fetch couriers");
    }
  };

  const validateForm = () => {
    const { providerid, companyname, contactnumber, rateperkg, companytype } = formData;
    if (!providerid || !companyname || !contactnumber || !rateperkg || !companytype) {
      toast.warn("All fields are required");
      return false;
    }
    if (!/^\d{10}$/.test(contactnumber)) {
      toast.warn("Contact number must be 10 digits");
      return false;
    }
    if (Number(rateperkg) <= 0) {
      toast.warn("Rate per Kg must be greater than 0");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/courier/update/${editingId}`, formData);
        toast.success("Courier updated successfully");
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5000/api/courier/add', formData);
        toast.success("Courier added successfully");
      }

      setFormData({
        providerid: '',
        companyname: '',
        contactnumber: '',
        rateperkg: '',
        companytype: '',
      });

      fetchCouriers();
    } catch (error) {
      toast.error("Failed to submit form");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/courier/delete/${id}`);
      toast.success("Courier deleted successfully");
      fetchCouriers();
    } catch (error) {
      toast.error("Failed to delete courier");
    }
  };

  const handleEdit = (courier) => {
    setFormData({
      providerid: courier.providerid,
      companyname: courier.companyname,
      contactnumber: courier.contactnumber,
      rateperkg: courier.rateperkg,
      companytype: courier.companytype,
    });
    setEditingId(courier._id);
  };

  return (
    <div className="courier-dashboard">
      <ToastContainer position="top-center" />
      <div className="courier-header">
        <h2>Courier Management</h2>
      </div>

      <form className="courier-form" onSubmit={handleSubmit}>
        <input
          className="courier-input"
          placeholder="Provider ID"
          value={formData.providerid}
          onChange={(e) => setFormData({ ...formData, providerid: e.target.value })}
          required
        />
        <input
          className="courier-input"
          placeholder="Company Name"
          value={formData.companyname}
          onChange={(e) => setFormData({ ...formData, companyname: e.target.value })}
          required
        />
        <input
          className="courier-input"
          placeholder="Contact Number"
          value={formData.contactnumber}
          onChange={(e) => setFormData({ ...formData, contactnumber: e.target.value })}
          required
        />
        <input
          className="courier-input"
          placeholder="Rate per Kg"
          type="number"
          value={formData.rateperkg}
          onChange={(e) => setFormData({ ...formData, rateperkg: e.target.value })}
          required
        />
        <input
          className="courier-input"
          placeholder="Type (Air/Land/Sea)"
          value={formData.companytype}
          onChange={(e) => setFormData({ ...formData, companytype: e.target.value })}
          required
        />
        <button type="submit" className="courier-btn courier-add-btn">
          {editingId ? "Update Courier" : "Add Courier"}
        </button>
      </form>

      <h3 className="courier-subheading">Courier List</h3>
      <table className="courier-table">
        <thead>
          <tr>
            <th>Provider ID</th>
            <th>Company Name</th>
            <th>Contact Number</th>
            <th>Rate per Kg</th>
            <th>Company Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {couriers.map((courier) => (
            <tr key={courier._id}>
              <td>{courier.providerid}</td>
              <td>{courier.companyname}</td>
              <td>{courier.contactnumber}</td>
              <td>{courier.rateperkg}</td>
              <td>{courier.companytype}</td>
              <td>
                <button
                  className="courier-btn courier-edit-btn"
                  onClick={() => handleEdit(courier)}
                >
                  Edit
                </button>
                <button
                  className="courier-btn courier-delete-btn"
                  onClick={() => handleDelete(courier._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CourierDashboard;
