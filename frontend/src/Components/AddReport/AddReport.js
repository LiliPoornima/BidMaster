import React, { useState } from 'react';
import Nav from '../Nav/Nav';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddReport.css';

function AddReport() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    ReportName: '',
    ReportReason: '',
    Date: '',
  });

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const sendRequest = async () => {
    try {
      const response = await axios.post('http://localhost:5000/reports', {
        ReportName: String(inputs.ReportName),
        ReportReason: String(inputs.ReportReason),
        Date: inputs.Date,
      });
      return response.data;
    } catch (error) {
      console.error('Error posting report:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);
    try {
      await sendRequest();
      navigate('/flagged-items');
    } catch (error) {
      alert('Failed to add report. Check console for details.');
    }
  };

  return (
    <div className="AR-add-report-page">
      <header className="AR-header-banner">
      <br/><br/><br/>
        <Nav />
        
        <div className="AR-header-overlay">
          
        </div>
      </header>
      <main className="AR-content-container">
        <div className="AR-image-container">
          <img
            src="https://images.unsplash.com/photo-1707157281599-d155d1da5b4c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHJlcG9ydHxlbnwwfHwwfHx8MA%3D%3D"
            alt="Cityscape with communication network"
            className="AR-side-image"
          />
        </div>
        <br/><br/>
        <div className="AR-form-container">
          {/* Added title for the form */}
          <h1 className="AR-form-title">Add Report Form</h1>
          <form onSubmit={handleSubmit} className="AR-report-form">
            <div className="AR-form-group">
              <label htmlFor="ReportName">Report Name</label>
              <input
                type="text"
                id="ReportName"
                name="ReportName"
                onChange={handleChange}
                value={inputs.ReportName}
                required
                placeholder="Enter report name"
              />
            </div>
            <div className="AR-form-group">
              <label htmlFor="ReportReason">Report Reason</label>
              <input
                type="text"
                id="ReportReason"
                name="ReportReason"
                onChange={handleChange}
                value={inputs.ReportReason}
                required
                placeholder="Enter reason for report"
              />
            </div>
            <div className="AR-form-group">
              <label htmlFor="Date">Date</label>
              <input
                type="date"
                id="Date"
                name="Date"
                onChange={handleChange}
                value={inputs.Date}
                required
              />
            </div>
            <button type="submit" className="AR-submit-btn">Submit Report</button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AddReport;