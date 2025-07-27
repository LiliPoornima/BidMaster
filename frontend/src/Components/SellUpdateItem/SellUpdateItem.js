import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function SellUpdateItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    startingPrice: "",
    biddingEndTime: "",
    condition: "Excellent",
    provenance: "",
    dimensions: "",
    weight: "",
    material: "",
    maker: "",
    year: "",
    image: null,
    additionalImages: [],
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  const [additionalPreviews, setAdditionalPreviews] = useState([]);
  const [currentAdditionalImages, setCurrentAdditionalImages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popup, setPopup] = useState({ message: "", type: "", visible: false });
  const [isApproved, setIsApproved] = useState(false);

  const showPopup = (message, type) => {
    setPopup({ message, type, visible: true });
    setTimeout(() => {
      setPopup({ message: "", type: "", visible: false });
    }, 2500);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/items/${id}`)
      .then((res) => {
        const item = res.data;
        setFormData({
          name: item.name || "",
          description: item.description || "",
          price: item.price || "",
          startingPrice: item.startingPrice || item.price || "",
          biddingEndTime: item.biddingEndTime
            ? new Date(item.biddingEndTime).toISOString().substr(0, 16)
            : "",
          condition: item.condition || "Excellent",
          provenance: item.provenance || "",
          dimensions: item.dimensions || "",
          weight: item.weight || "",
          material: item.material || "",
          maker: item.maker || "",
          year: item.year || "",
          image: null,
          additionalImages: [],
        });

        // Set current images URLs (assume backend sends relative URLs starting with /uploads)
        if (item.image) {
          setCurrentImage(
            item.image.startsWith("/uploads")
              ? `http://localhost:5000${item.image}`
              : item.image
          );
        } else {
          setCurrentImage(null);
        }

        if (item.additionalImages && item.additionalImages.length > 0) {
          const additionalUrls = item.additionalImages.map((img) =>
            img.startsWith("/uploads")
              ? `http://localhost:5000${img}`
              : img
          );
          setCurrentAdditionalImages(additionalUrls);
        } else {
          setCurrentAdditionalImages([]);
        }

        setIsApproved(item.inspectionStatus === "Approved");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching item:", err);
        setError(
          err.response?.status === 404
            ? "Item not found."
            : "Failed to load item. Please try again."
        );
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else if (name === "additionalImages" && files && files.length > 0) {
      if (files.length > 4) {
        alert("You can only upload up to 4 additional images");
        return;
      }

      const fileArray = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        additionalImages: fileArray,
      }));

      // Read files for preview
      Promise.all(
        fileArray.map(
          (file) =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            })
        )
      )
        .then((results) => setAdditionalPreviews(results))
        .catch((err) => console.error("Error reading files", err));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.description.trim()) {
      showPopup("Name and Description cannot be empty.", "error");
      return;
    }
    if (isNaN(formData.startingPrice) || Number(formData.startingPrice) < 0) {
      showPopup("Starting price must be a positive number.", "error");
      return;
    }

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("description", formData.description);
    submitData.append("price", Number(formData.price));
    submitData.append(
      "startingPrice",
      formData.startingPrice ? Number(formData.startingPrice) : Number(formData.price)
    );
    submitData.append(
      "biddingEndTime",
      formData.biddingEndTime ? new Date(formData.biddingEndTime).toISOString() : ""
    );
    submitData.append("condition", formData.condition);
    submitData.append("provenance", formData.provenance);
    submitData.append("dimensions", formData.dimensions);
    submitData.append("weight", formData.weight);
    submitData.append("material", formData.material);
    submitData.append("maker", formData.maker);
    submitData.append("year", formData.year);

    if (formData.image) {
      submitData.append("image", formData.image);
    }
    if (formData.additionalImages.length > 0) {
      formData.additionalImages.forEach((file) => {
        submitData.append("additionalImages", file);
      });
    }

    axios
      .put(`http://localhost:5000/items/${id}`, submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        showPopup("Item updated successfully!", "success");
        setTimeout(() => navigate("/seller-dashboard"), 2000);
      })
      .catch((err) => {
        if (err.response?.status === 403) {
          showPopup("This item has been approved and cannot be edited.", "error");
          setIsApproved(true);
        } else {
          showPopup("Failed to update item. Please try again.", "error");
        }
      });
  };

  if (loading) {
    return (
      <div className="item-container">
        <div className="loading">Loading item data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="item-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="item-container">
      <div className="item-content">
        <div className="illustration-container">
          <div className="illustration-bg">
            <div className="desk-illustration"></div>
          </div>
        </div>

        <div className="item-wrapper">
          <h1 className="item-title">Update Item</h1>
          <form onSubmit={handleSubmit}>
            {/* Basic Info */}
            <h2 className="section-header">Basic Item Information</h2>
            <div className="item-group">
              <label>Item Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isApproved}
              />
            </div>
            <div className="item-group">
              <label>Item Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                disabled={isApproved}
              />
            </div>
            <div className="item-group">
              <label>Item Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                disabled={isApproved}
              />
            </div>
            <div className="item-group">
              <label>Starting Bid Price ($)</label>
              <input
                type="number"
                name="startingPrice"
                value={formData.startingPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Defaults to Item Price"
                disabled={isApproved}
              />
            </div>
            <div className="item-group">
              <label>Bidding End Time</label>
              <input
                type="datetime-local"
                name="biddingEndTime"
                value={formData.biddingEndTime}
                onChange={handleChange}
                disabled={isApproved}
              />
            </div>

            {/* Item Details */}
            <h2 className="section-header">Item Details</h2>
            <div className="detail-row">
              <div className="item-group">
                <label>Condition</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  disabled={isApproved}
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
              <div className="item-group">
                <label>Provenance</label>
                <input
                  type="text"
                  name="provenance"
                  value={formData.provenance}
                  onChange={handleChange}
                  disabled={isApproved}
                />
              </div>
            </div>

            <div className="detail-row">
              <div className="item-group">
                <label>Dimensions</label>
                <input
                  type="text"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleChange}
                  disabled={isApproved}
                />
              </div>
              <div className="item-group">
                <label>Weight</label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  disabled={isApproved}
                />
              </div>
            </div>

            <div className="detail-row">
              <div className="item-group">
                <label>Material</label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  disabled={isApproved}
                />
              </div>
              <div className="item-group">
                <label>Maker</label>
                <input
                  type="text"
                  name="maker"
                  value={formData.maker}
                  onChange={handleChange}
                  disabled={isApproved}
                />
              </div>
            </div>

            <div className="detail-row">
              <div className="item-group">
                <label>Year</label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  disabled={isApproved}
                />
              </div>
            </div>

            {/* Images */}
            <h2 className="section-header">Item Images</h2>
            <div className="item-group">
              <label>Main Item Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                disabled={isApproved}
              />
              {previewUrl ? (
                <div className="image-preview">
                  <p>New image preview:</p>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{ maxWidth: "100%", maxHeight: "200px", marginTop: "10px" }}
                  />
                </div>
              ) : currentImage ? (
                <div className="image-preview">
                  <p>Current image:</p>
                  <img
                    src={currentImage}
                    alt="Current"
                    style={{ maxWidth: "100%", maxHeight: "200px", marginTop: "10px" }}
                  />
                </div>
              ) : null}
            </div>
            <div className="item-group">
              <label>Additional Images (Max 4)</label>
              <input
                type="file"
                name="additionalImages"
                accept="image/*"
                multiple
                onChange={handleChange}
                disabled={isApproved}
              />
              {additionalPreviews.length > 0 ? (
                <div className="additional-previews">
                  <p>New additional images:</p>
                  {additionalPreviews.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      style={{ maxWidth: "22%", maxHeight: "100px", marginTop: "10px", marginRight: "3%" }}
                    />
                  ))}
                </div>
              ) : currentAdditionalImages.length > 0 ? (
                <div className="additional-previews">
                  <p>Current additional images:</p>
                  {currentAdditionalImages.map((imgUrl, index) => (
                    <img
                      key={index}
                      src={imgUrl}
                      alt={`Additional ${index + 1}`}
                      style={{ maxWidth: "22%", maxHeight: "100px", marginTop: "10px", marginRight: "3%" }}
                    />
                  ))}
                </div>
              ) : null}
            </div>

            <div className="item-buttons">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/seller-dashboard")}
              >
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={isApproved}>
                Update Item
              </button>
            </div>

            {isApproved && (
              <p style={{ color: "red", marginTop: "10px" }}>
                This item has been approved and cannot be edited.
              </p>
            )}
          </form>
        </div>
      </div>

      {popup.visible && (
        <div className={`popup-message ${popup.type}`}>
          <span>{popup.message}</span>
        </div>
      )}
    </div>
  );
}

export default SellUpdateItem;
