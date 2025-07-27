import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function FlaggedItems(props) {
  const { _id, ReportName, ReportReason, Date } = props.report;
  const navigate = useNavigate();

  const deleteHandler = async () => {
    if (window.confirm('Are you sure you want to delete this report?')) { // Add confirmation
      try {
        console.log('Deleting report with ID:', _id); // Debug ID
        const response = await axios.delete(`http://localhost:5000/reports/${_id}`);
        console.log('Delete response:', response.data); // Debug response
        alert('Report deleted successfully!');
        navigate('/flagged-items'); // Redirect after success
      } catch (error) {
        console.error('Error deleting report:', error.response ? error.response.data : error.message);
        alert(`Failed to delete report: ${error.response?.data?.message || 'Unknown error'}`);
      }
    }
  };

  return (
    <tr>
      <td>{_id}</td>
      <td>{ReportName}</td>
      <td>{ReportReason}</td>
      <td>{Date}</td>
      <td>
        <Link to={`/flagged-items/${_id}`} className="action-btn RI-update-btn">
          Update
        </Link>
        <button onClick={deleteHandler} className="action-btn RI-delete-btn">
          Delete
        </button>
      </td>
    </tr>
  );
}

export default FlaggedItems;