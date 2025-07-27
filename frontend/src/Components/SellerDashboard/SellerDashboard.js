import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Item from "../Item/Item";
import axios from "axios";
import "./SellerDashboard.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const ITEMS_URL = `${API_BASE_URL}/items/seller/${localStorage.getItem("username")}`;

function SellerDashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [popup, setPopup] = useState({ message: "", type: "", visible: false });

  const showPopup = (message, type) => {
    setPopup({ message, type, visible: true });
    setTimeout(() => {
      setPopup({ message: "", type: "", visible: false });
    }, 3000);
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(ITEMS_URL);
      const fetchedItems = Array.isArray(response.data)
        ? response.data
        : response.data.item; // Match with your backend response
      setItems(fetchedItems);
      setLoading(false);

      if (fetchedItems.length > 0) {
        showPopup("Items loaded successfully!", "success");
      } else {
        showPopup("No items available.", "info");
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      showPopup("Failed to load items. Please try again.", "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = () => {
    if (filter === "all") return items;
    return items.filter(
      (item) => item.inspectionStatus?.toLowerCase() === filter
    );
  };

  return (
    <div className="SellerDashboard-page">
      <br />
      <br />
      <br />
      <br />
      <div className="SellerDashboard-container">
        <header className="SellerDashboard-header">
          <h2>Seller Dashboard</h2>
          <Link
            to="/add-item"
            className="SellerDashboard-add-item-btn"
            aria-label="Add new item"
          >
            + Add New Item
          </Link>
        </header>

        <div
          className="SellerDashboard-filter-controls"
          role="group"
          aria-label="Item status filters"
        >
          {["all", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              className={`SellerDashboard-filter-btn ${
                filter === status ? "active" : ""
              }`}
              onClick={() => setFilter(status)}
              aria-pressed={filter === status}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} Items
            </button>
          ))}
        </div>

        {loading ? (
          <div className="SellerDashboard-loading-spinner" aria-live="polite">
            Loading items...
          </div>
        ) : (
          <div className="SellerDashboard-items-grid">
            {filteredItems().length > 0 ? (
              filteredItems().map((item) => (
                <div
                  key={item._id}
                  className="SellerDashboard-item-grid-cell"
                >
                  <Item item={item} onRefresh={fetchItems} />
                </div>
              ))
            ) : (
              <div
                className="SellerDashboard-no-items-message"
                aria-live="polite"
              >
                <p>No {filter !== "all" ? filter : ""} items found.</p>
              </div>
            )}
          </div>
        )}

        {popup.visible && (
          <div
            className={`SellerDashboard-popup-message ${popup.type}`}
            role="alert"
            aria-live="assertive"
          >
            <span>{popup.message}</span>
          </div>
        )}
      </div>
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

export default SellerDashboard;
