import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Nav from '../Nav/Nav';
import './UpdateReport.css';

function UpdateReport() {
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
  const { _id } = useParams();

  useEffect(() => {
    const fetchHandler = async () => {
      await axios
        .get(`http://localhost:5000/reports/${_id}`)
        .then((res) => res.data)
        .then((data) => setInputs(data.report));
    };
    fetchHandler();
  }, [_id]);

  const sendRequest = async () => {
    await axios.put(`http://localhost:5000/reports/${_id}`, {
      ReportName: String(inputs.ReportName),
      ReportReason: String(inputs.ReportReason),
      Date: inputs.Date,
    }).then((res) => res.data);
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);
    try {
      await sendRequest();
      navigate('/flagged-items');
    } catch (error) {
      alert('Failed to update report. Check console for details.');
      console.error(error);
    }
  };

  return (
    <div className="UR-update-report-page">
      <header className="UR-header-banner">
        <br/><br/><br/>
        <Nav />
        <div className="UR-header-overlay">
          
        </div>
      </header>
      <main className="AR-content-container">
        <div className="AR-image-container">
          <img
            src="https://images.unsplash.com/photo-1527219525722-f9767a7f2884?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE4fHx8ZW58MHx8fHx8"
            alt="Update report illustration"
            className="AR-side-image"
          />
        </div>
        <br/><br/>
        <div className="AR-form-container">
          {/* Added form title */}
          <h1 className="UR-form-title">Update Report</h1>
          <form onSubmit={handleSubmit} className="AR-report-form">
            <div className="AR-form-group">
              <label htmlFor="ReportName">Report Name</label>
              <input
                type="text"
                id="ReportName"
                name="ReportName"
                onChange={handleChange}
                value={inputs.ReportName || ''}
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
                value={inputs.ReportReason || ''}
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
                value={inputs.Date || ''}
                required
              />
            </div>
            <button type="submit" className="AR-submit-btn">Update Report</button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default UpdateReport;