import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

import './ItemForm.css';

function ItemForm() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const item = state?.item || {};

  const [formData, setFormData] = useState({
    id: id || '',
    name: item.name || '',
    description: item.description || '',
    price: item.price || '',
    startingPrice: item.startingPrice || '',
    biddingEndTime: item.biddingEndTime ? new Date(item.biddingEndTime).toISOString().substr(0, 16) : '',
    // Item detail fields - these will only be shown in the view page
    condition: item.condition || 'Excellent',
    provenance: item.provenance || '',
    dimensions: item.dimensions || '',
    weight: item.weight || '',
    material: item.material || '',
    maker: item.maker || '',
    year: item.year || '',
    // Inspection related fields
    authenticity: item.authenticity || 'Verified',
    inspectionNotes: item.inspectionNotes || '',
    inspectionStatus: item.inspectionStatus || 'Pending',
    image: null,
    additionalImages: []
  });
  
  // Add validation state
  const [descriptionError, setDescriptionError] = useState('');
  
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
      
      // Create a preview URL for the image
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
      
      setFormData(prev => ({
        ...prev,
        [name]: Array.from(files)
      }));
      
      // Create preview URLs for additional images
      const previews = [];
      for (let i = 0; i < files.length; i++) {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          previews.push(fileReader.result);
          if (previews.length === files.length) {
            setAdditionalPreviews([...previews]);
          }
        };
        fileReader.readAsDataURL(files[i]);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear description error when user types
      if (name === 'description') {
        if (value.length <= 10) {
          setDescriptionError('Description must be more than 10 characters');
        } else {
          setDescriptionError('');
        }
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate description length before submission
    if (formData.description.length <= 10) {
      setDescriptionError('Description must be more than 10 characters');
      return; // Prevent form submission
    }
    
    // Create FormData object to handle file upload
    const submitData = new FormData();
    submitData.append('id', formData.id);
    submitData.append('name', formData.name);
    submitData.append('description', formData.description);
    submitData.append('price', formData.price);
    submitData.append('startingPrice', formData.startingPrice || formData.price);
    submitData.append('status', formData.inspectionStatus === 'Approved' ? 'Approved' : 'Pending');
    
    // Append item details
    submitData.append('condition', formData.condition);
    submitData.append('provenance', formData.provenance);
    submitData.append('dimensions', formData.dimensions);
    submitData.append('weight', formData.weight);
    submitData.append('material', formData.material);
    submitData.append('maker', formData.maker);
    submitData.append('year', formData.year);
    
    // Append inspection fields
    submitData.append('authenticity', formData.authenticity);
    submitData.append('inspectionNotes', formData.inspectionNotes);
    submitData.append('inspectionStatus', formData.inspectionStatus);
    
    if (formData.biddingEndTime) {
      submitData.append('biddingEndTime', new Date(formData.biddingEndTime).toISOString());
    }
    
    // Ensure image is properly appended
    if (formData.image) {
      submitData.append('image', formData.image);
    }
    
    if (formData.additionalImages && formData.additionalImages.length > 0) {
      formData.additionalImages.forEach((file, index) => {
        submitData.append('additionalImages', file);
      });
    }
    
    fetch('http://localhost:5000/items', {
      method: 'POST',
      body: submitData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      alert('Item submitted successfully!');
      navigate('/items-gallery');
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to submit item');
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
          <h1 className="item-title">Item Inspection & Approval Form</h1>
          <form onSubmit={handleSubmit}>
            {/* Basic Item Information */}
            <h2 className="section-header">Basic Item Information</h2>
            <div className="item-group">
              <label htmlFor="name">Item Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="item-group">
              <label htmlFor="description">Item Description</label>
              <textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                required 
              />
              {descriptionError && <div className="error-message" style={{ color: 'red', fontSize: '0.8rem' }}>{descriptionError}</div>}
            </div>
            <div className="item-group">
              <label htmlFor="price">Item Price ($)</label>
              <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} min="0" step="0.01" required />
            </div>
            <div className="item-group">
              <label htmlFor="startingPrice">Starting Bid Price ($)</label>
              <input type="number" id="startingPrice" name="startingPrice" value={formData.startingPrice} onChange={handleChange} min="0" step="0.01" placeholder="Default is Item Price" />
            </div>
            <div className="item-group">
              <label htmlFor="biddingEndTime">Bidding End Time</label>
              <input type="datetime-local" id="biddingEndTime" name="biddingEndTime" value={formData.biddingEndTime} onChange={handleChange} />
            </div>
            
            {/* Item Details - these will be displayed on the ItemView page only */}
            <h2 className="section-header">Item Details</h2>
            <div className="detail-row">
              <div className="item-group">
                <label htmlFor="condition">Condition</label>
                <select id="condition" name="condition" value={formData.condition} onChange={handleChange}>
                  <option value="Excellent">Excellent</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
              <div className="item-group">
                <label htmlFor="provenance">Provenance</label>
                <input type="text" id="provenance" name="provenance" value={formData.provenance} onChange={handleChange} />
              </div>
            </div>
            
            <div className="detail-row">
              <div className="item-group">
                <label htmlFor="dimensions">Dimensions</label>
                <input type="text" id="dimensions" name="dimensions" value={formData.dimensions} onChange={handleChange} placeholder="e.g. 50mm x 15mm" />
              </div>
              <div className="item-group">
                <label htmlFor="weight">Weight</label>
                <input type="text" id="weight" name="weight" value={formData.weight} onChange={handleChange} placeholder="e.g. 75 grams" />
              </div>
            </div>
            
            <div className="detail-row">
              <div className="item-group">
                <label htmlFor="material">Material</label>
                <input type="text" id="material" name="material" value={formData.material} onChange={handleChange} />
              </div>
              <div className="item-group">
                <label htmlFor="maker">Maker</label>
                <input type="text" id="maker" name="maker" value={formData.maker} onChange={handleChange} />
              </div>
            </div>
            
            <div className="detail-row">
              <div className="item-group">
                <label htmlFor="year">Year</label>
                <input type="text" id="year" name="year" value={formData.year} onChange={handleChange} placeholder="e.g. Circa 1960" />
              </div>
              <div className="item-group">
                <label htmlFor="authenticity">Authenticity</label>
                <select id="authenticity" name="authenticity" value={formData.authenticity} onChange={handleChange}>
                  <option value="Verified">Verified</option>
                  <option value="Unverified">Unverified</option>
                  <option value="Reproduction">Reproduction</option>
                </select>
              </div>
            </div>
            
            {/* Inspection Information */}
            <h2 className="section-header">Inspection Information</h2>
            <div className="item-group">
              <label htmlFor="inspectionNotes">Inspection Notes</label>
              <textarea id="inspectionNotes" name="inspectionNotes" value={formData.inspectionNotes} onChange={handleChange} placeholder="Add detailed notes about the item inspection here" />
            </div>
            <div className="item-group">
              <label htmlFor="inspectionStatus">Inspection Status</label>
              <select id="inspectionStatus" name="inspectionStatus" value={formData.inspectionStatus} onChange={handleChange} required>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            
            {/* Item Images */}
            <h2 className="section-header">Item Images</h2>
            <div className="item-group">
              <label htmlFor="image">Main Item Image</label>
              <input type="file" id="image" name="image" accept="image/*" onChange={handleChange} required />
              {previewUrl && (
                <div className="item-preview">
                  <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }} />
                </div>
              )}
            </div>
            <div className="item-group">
              <label htmlFor="additionalImages">Additional Images (Up to 4)</label>
              <input type="file" id="additionalImages" name="additionalImages" accept="image/*" onChange={handleChange} multiple />
              {additionalPreviews.length > 0 && (
                <div className="additional-previews">
                  {additionalPreviews.map((preview, index) => (
                    <img 
                      key={index} 
                      src={preview} 
                      alt={`Preview ${index + 1}`} 
                      style={{ maxWidth: '22%', maxHeight: '100px', marginTop: '10px', marginRight: '3%' }} 
                    />
                  ))}
                </div>
              )}
            </div>
            
            <button type="submit" className="submit-btn">Submit Item</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ItemForm;