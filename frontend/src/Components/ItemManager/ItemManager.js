import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../Nav/Nav';
import './ItemManager.css';

function ItemManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    setLoading(true);
    fetch('http://localhost:5000/items')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch items');
        }
        return res.json();
      })
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching items:', err);
        setError(err.message);
        setLoading(false);
      });
  };

  const handleEdit = (item) => {
    navigate(`/edit-item/${item._id}`, { state: { item } });
  };

  

  

  const handleUpdateStatus = (id, newStatus) => {
    fetch(`http://localhost:5000/items/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inspectionStatus: newStatus }),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to update item status');
        }
        return res.json();
      })
      .then(() => {
        fetchItems();
        alert(`Item ${newStatus.toLowerCase()} successfully`);
      })
      .catch(err => {
        console.error('Error updating item status:', err);
        alert('Failed to update item status');
      });
  };

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.inspectionStatus === filter);

  if (loading) return <div className="item-manager-container"><Nav /><div className="loading">Loading items...</div></div>;
  if (error) return <div className="item-manager-container"><Nav /><div className="error">Error: {error}</div></div>;

  return (
    <div className="item-manager-container">
      <Nav />
      <div className="item-manager-content">
        <h1>Item Management</h1>
        
        <div className="filter-controls">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`} 
            onClick={() => setFilter('all')}
          >
            All Items
          </button>
          <button 
            className={`filter-btn ${filter === 'Pending' ? 'active' : ''}`} 
            onClick={() => setFilter('Pending')}
          >
            Pending Inspection
          </button>
          <button 
            className={`filter-btn ${filter === 'Approved' ? 'active' : ''}`} 
            onClick={() => setFilter('Approved')}
          >
            Approved
          </button>
          <button 
            className={`filter-btn ${filter === 'Rejected' ? 'active' : ''}`} 
            onClick={() => setFilter('Rejected')}
          >
            Rejected
          </button>
        </div>

        <div className="items-table-container">
          <table className="items-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Item Name</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-items">No items found</td>
                </tr>
              ) : (
                filteredItems.map(item => (
                  <tr key={item._id}>
                    <td className="item-image-cell">
                      <img 
                        src={item.image && item.image.startsWith('/uploads')
                          ? `http://localhost:5000${item.image}`
                          : `https://via.placeholder.com/50x50?text=${encodeURIComponent(item.name.charAt(0))}`} 
                        alt={item.name}
                        className="item-thumbnail"
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>${parseFloat(item.price).toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${item.inspectionStatus ? item.inspectionStatus.toLowerCase() : 'unknown'}`}>
                        {item.inspectionStatus}
                      </span>
                    </td>
                    <td className="actions-cell">
                      {/* Hide Edit button if Approved */}
                      {item.inspectionStatus !== 'Approved' && (
                        <button 
                          onClick={() => handleEdit(item)} 
                          className="action-btn edit-btn" 
                          title="Edit Item"
                        >
                          Edit
                        </button>
                      )}

                      
                     
                      {/* Show Approve/Reject buttons only if Pending */}
                      {item.inspectionStatus === 'Pending' && (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(item._id, 'Approved')} 
                            className="action-btn approve-btn" 
                            title="Approve Item"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(item._id, 'Rejected')} 
                            className="action-btn reject-btn" 
                            title="Reject Item"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ItemManager;
