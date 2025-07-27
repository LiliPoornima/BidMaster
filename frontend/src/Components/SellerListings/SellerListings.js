import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SellerListings.css";
import axios from "axios";
import { jsPDF } from "jspdf";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function SellerListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const username = localStorage.getItem("username");

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/items/seller/${username}`
      );
      setListings(response.data.item || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    navigate("/add-item");
  };

  const handleDownload = async (listing) => {
    const doc = new jsPDF();
    let yOffset = 20;

    doc.setFontSize(18);
    doc.text("Item Details", 20, yOffset);
    yOffset += 10;

    doc.setFontSize(12);
    doc.text(`Name: ${listing.name || "Untitled"}`, 20, yOffset);
    yOffset += 10;
    doc.text(
      `Description: ${listing.description || "No description"}`,
      20,
      yOffset,
      { maxWidth: 170 }
    );
    yOffset +=
      Math.ceil((listing.description || "").length / 85) * 10 + 10;
    doc.text(
      `Price: $${parseFloat(listing.price).toFixed(2)}`,
      20,
      yOffset
    );
    yOffset += 10;
    doc.text(
      `Starting Price: $${parseFloat(listing.startingPrice).toFixed(2)}`,
      20,
      yOffset
    );
    yOffset += 10;
    doc.text(
      `Status: ${
        listing.inspectionStatus
          ? listing.inspectionStatus.charAt(0).toUpperCase() + listing.inspectionStatus.slice(1)
          : "Pending"
      }`,
      20,
      yOffset
    );
    yOffset += 10;

    if (listing.image) {
      try {
        const imgUrl = `${API_BASE_URL}/${listing.image}`;
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imgUrl;

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => reject(new Error("Failed to load image"));
        });

        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const imgData = canvas.toDataURL("image/jpeg");

        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth() - 40;
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(imgData, "JPEG", 20, yOffset, pdfWidth, imgHeight);
      } catch (err) {
        console.error("Error embedding image:", err);
        doc.text("Image: Not available", 20, yOffset);
      }
    } else {
      doc.text("Image: Not available", 20, yOffset);
    }

    doc.save(`${listing.name || "item"}-details.pdf`);
  };

  if (loading) {
    return (
      <div className="SellerListing-page">
        <div className="SellerListing-loading">Loading listings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="SellerListing-page">
        <div className="SellerListing-error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="SellerListing-page">
      <br />
      <br />
      <br />
      <br />
      <div className="SellerListing-header">
        <h1>My Listings</h1>
        <button
          className="SellerListing-add-listing-btn"
          onClick={handleAddNew}
        >
          Add New Listing
        </button>
      </div>

      <div className="SellerListing-table-container">
        <table className="SellerListing-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Item Name</th>
              <th>Description</th>
              <th>Price ($)</th>
              <th>Starting Price ($)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.length === 0 ? (
              <tr>
                <td colSpan="7" className="SellerListing-no-listings">
                  No listings available.
                </td>
              </tr>
            ) : (
              listings.map((listing) => (
                <tr key={listing._id}>
                 <td>
  <img
    src={
      listing.image
        ? `${API_BASE_URL}${listing.image}`
        : "https://via.placeholder.com/50?text=No+Image"
    }
    alt={listing.name}
    className="SellerListing-listing-thumbnail"
    onError={(e) => {
      e.target.src = "https://via.placeholder.com/50?text=No+Image";
    }}
  />
</td>

                  <td>{listing.name}</td>
                  <td className="SellerListing-description-cell">
                    {listing.description?.length > 50
                      ? `${listing.description.substring(0, 50)}...`
                      : listing.description || "No description"}
                  </td>
                  <td>${parseFloat(listing.price).toFixed(2)}</td>
                  <td>${parseFloat(listing.startingPrice).toFixed(2)}</td>
                  <td>
                    {listing.inspectionStatus
                      ? listing.inspectionStatus.charAt(0).toUpperCase() +
                        listing.inspectionStatus.slice(1)
                      : "Pending"}
                  </td>
                  <td>
                    <button
                      className="SellerListing-download-btn"
                      onClick={() => handleDownload(listing)}
                    >
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

export default SellerListings;
