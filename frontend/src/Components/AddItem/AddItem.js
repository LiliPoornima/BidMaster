import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddItem.css';

function AddItem() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    startingPrice: '',
    biddingEndTime: '',
    condition: 'Excellent',
    provenance: '',
    dimensions: '',
    weight: '',
    material: '',
    maker: '',
    year: '',
    image: null,
    additionalImages: []
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [additionalPreviews, setAdditionalPreviews] = useState([]);

  const handleChange = (e) => {
  const { name, value, files } = e.target;

  if (name === 'image' && files && files[0]) {
    const file = files[0];
    setFormData(prev => ({
      ...prev,
      [name]: file
    }));

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  } else if (name === 'additionalImages' && files && files.length > 0) {
    if (files.length > 4) {
      alert('You can only upload up to 4 additional images');
      return;
    }

    const fileArray = Array.from(files);
    setFormData(prev => ({
      ...prev,
      additionalImages: fileArray
    }));

    // Read all files and generate previews
    Promise.all(
      fileArray.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject();
          reader.readAsDataURL(file);
        });
      })
    )
    .then(results => {
      setAdditionalPreviews(results);
    })
    .catch(err => {
      console.error("Error reading files", err);
    });
  } else {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }
};


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price) {
      alert('Please fill all required fields.');
      return;
    }

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('description', formData.description);
    submitData.append('price', formData.price);
    submitData.append('startingPrice', formData.startingPrice || formData.price);
    submitData.append('biddingEndTime', formData.biddingEndTime);

    // Item details
    submitData.append('condition', formData.condition);
    submitData.append('provenance', formData.provenance);
    submitData.append('dimensions', formData.dimensions);
    submitData.append('weight', formData.weight);
    submitData.append('material', formData.material);
    submitData.append('maker', formData.maker);
    submitData.append('year', formData.year);
    submitData.append('username', localStorage.getItem('username'));


    // Images
    if (formData.image) {
      submitData.append('image', formData.image);
    }
    if (formData.additionalImages.length > 0) {
      formData.additionalImages.forEach(file => {
        submitData.append('additionalImages', file);
      });
    }

    fetch('http://localhost:5000/items', {
      method: 'POST',
      body: submitData
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to submit');
        }
        return response.json();
      })
      .then(data => {
        alert('Item added successfully!');
        navigate('/seller-dashboard');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to submit item.');
      });
  };

  return (
    <div className="item-container">
      <div className="item-content">
        <div className="illustration-container">
  <div className="illustration-bg">
    <div className="desk-illustration"></div>
  </div>
</div>

        <div className="item-wrapper">
          <h1 className="item-title">Add Auction Item</h1>
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
              />
            </div>
            <div className="item-group">
              <label>Item Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="item-group">
              <label>Item Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="item-group">
              <label>Starting Bid Price ($)</label>
              <input
                type="number"
                name="startingPrice"
                value={formData.startingPrice}
                onChange={handleChange}
                placeholder="Defaults to Item Price"
              />
            </div>
            <div className="item-group">
              <label>Bidding End Time</label>
              <input
                type="datetime-local"
                name="biddingEndTime"
                value={formData.biddingEndTime}
                onChange={handleChange}
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
                />
              </div>
              <div className="item-group">
                <label>Weight</label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
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
                />
              </div>
              <div className="item-group">
                <label>Maker</label>
                <input
                  type="text"
                  name="maker"
                  value={formData.maker}
                  onChange={handleChange}
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
                required
              />
              {previewUrl && (
                <div className="item-preview">
                  <img src={previewUrl} alt="Preview" />
                </div>
              )}
            </div>
            <div className="item-group">
              <label>Additional Images (Max 4)</label>
              <input
                type="file"
                name="additionalImages"
                accept="image/*"
                multiple
                onChange={handleChange}
              />
              {additionalPreviews.length > 0 && (
                <div className="additional-previews">
                  {additionalPreviews.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="additional-img"
                    />
                  ))}
                </div>
              )}
            </div>

            <button 
  type="submit" 
  className="submit-btn">
  Submit Item
</button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AddItem;
