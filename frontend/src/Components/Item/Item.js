import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Item.css";

function Item({ item, onRefresh }) {
  const navigate = useNavigate();

  const getDateFromId = (id) => {
    if (id && id.length >= 24) {
      const timestamp = parseInt(id.substring(0, 8), 16);
      return new Date(timestamp * 1000).toLocaleDateString();
    }
    return "Unknown date";
  };

  const handleDelete = async (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (window.confirm("Are you sure you want to delete this item?")) {
    try {
      await axios.patch(`http://localhost:5000/items/seller-delete/${item._id}`);
      if (typeof onRefresh === "function") {
        onRefresh();
      }
      alert("Item deleted from seller dashboard only!");
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item. Please try again.");
    }
  }
};


  const handleClick = () => {
    navigate(`/seller-dashboard/${item._id}`);
  };

  return (
    <div
      className="seller-item-card"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      {item.status && (
        <div className={`status-indicator status-${item.status}`}>
          {item.status}
        </div>
      )}
     <div className="seller-item-image">
  {item.image ? (
    <img
      src={
        item.image.startsWith('/uploads')
          ? `http://localhost:5000${item.image}`
          : 'https://via.placeholder.com/150?text=No+Image'
      }
      alt={item.name}
      onError={(e) => {
        e.target.src = "https://via.placeholder.com/150?text=No+Image";
      }}
    />
  ) : (
    <div className="no-image">No Image</div>
  )}
</div>

      <div className="seller-item-content">
        <h3>{item.name}</h3>
        <p className="seller-item-description-short">
          {item.description?.length > 80
            ? `${item.description.substring(0, 80)}...`
            : item.description}
        </p>
        <div className="seller-item-meta">
          <p className="seller-item-price">
            Starting Bid: ${item.startingPrice?.toFixed(2)}
          </p>
          <p className="seller-item-date">
            {item.createdAt
              ? `Listed: ${new Date(item.createdAt).toLocaleDateString()}`
              : `ID Date: ${getDateFromId(item._id)}`}
          </p>
        </div>
        <div className="seller-item-buttons">
          <Link to={`/seller-dashboard/${item._id}`} className="edit-btn">
            Update
          </Link>
          <button onClick={handleDelete} className="delete-btn">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default Item;
