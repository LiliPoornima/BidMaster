import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import axios from "axios";
import "./ImgUploader.css"; // Import the CSS file if using separate file

function ImgUploader() {
  const [image, setImage] = useState(null);
  const [allImage, setAllImage] = useState([]);

  const submitImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);

    try {
      await axios.post("http://localhost:5000/upload-img", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      getImage();
    } catch (e) {
      console.error("Error uploading image", e);
    }
  };

  const onImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const getImage = async () => {
    try {
      const result = await axios.get("http://localhost:5000/getImage");
      setAllImage(result.data.data || []);
    } catch (e) {
      console.error("Error getting image", e);
    }
  };

  const deleteImage = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete-image/${id}`);
      getImage();
    } catch (e) {
      console.error("Error deleting image", e);
    }
  };

  useEffect(() => {
    getImage();
  }, []);

  return (
    <div className="image-uploader-container">
      <Nav /><br/><br/>
      <h1>Image</h1>
      <form onSubmit={submitImage} className="upload-form">
        <input type="file" accept="image/*" onChange={onImageChange} />
        <button type="submit">Upload</button>
      </form>

      {allImage.length > 0 ? (
        <div className="image-gallery">
          {allImage.map((data) => (
            <div key={data._id} className="image-item">
              <img
                src={`http://localhost:5000/files/${data.image}`}
                alt="photos"
              />
              <button
                onClick={() => deleteImage(data._id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-images">No images available.</p>
      )}
    </div>
  );
}

export default ImgUploader;