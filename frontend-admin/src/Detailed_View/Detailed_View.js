import React, { useState, useEffect } from "react";
import name from '../assets/FactreeWriting.png'
import logo from '../assets/FactreeLogo.png'
import { Modal } from 'react-bootstrap';
import { AiOutlineEye } from 'react-icons/ai';
import axios from 'axios'

const InspectionPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [details, setDetails] = useState({});
  const [imageUrls, setImageUrls] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:5000/get_details");
        setDetails(response.data.details);
        const imageResponse = await fetch(`http://127.0.0.1:5000/detailed_view_img`);
        if (!imageResponse.ok) {
          throw new Error(`Error fetching images: ${imageResponse.status}`);
        }
        const imageData = await imageResponse.json();

        if (imageData.image_urls && imageData.image_urls.length > 0) {
          setImageUrls([]); // Reset imageUrls state first
          setImageUrls(imageData.image_urls); // Update with new image URLs
        } else {
          console.error('No images found');
        }

      } catch (err) {
        setError("Failed to fetch details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <nav class="navbar bg-body-tertiary fixed-top" style={{ width: '5px' }}>
        <div class="container-fluid">
          <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel" style={{ width: '250px' }}>
            <div class="offcanvas-header">
              <img src={logo} style={{ width: '25px' }}></img>
              <img src={name} style={{ width: '100px', marginLeft: '10px' }}></img>
              <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
              <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li class="nav-item">
                  <a href="/reports" class="btn btn-outline-secondary w-100 mb-3" style={{ borderRadius: '8px', marginTop: '20px' }}>Live Inspection Details</a>
                </li>
                <li class="nav-item">
                  <a href="/detailed_view" class="btn btn-outline-secondary w-100 mb-3" style={{ borderRadius: '8px' }}>Detailed View</a>
                </li>
                <li class="nav-item" style={{ marginTop: '400px' }}>
                  <a href="/socials-login" class="btn btn-outline-secondary w-100 mb-3" style={{ borderRadius: '8px' }}>Community</a>
                </li>
                <li class="nav-item">
                  <a href="/socials-login" class="btn btn-outline-secondary w-100 mb-3" style={{ borderRadius: '8px' }}>Help Desk</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div style={{ padding: "20px", marginLeft: '20px' }}>
        <div style={{ width: '100%' }}>
          <h1 className="live-inspection-title">Detailed View</h1>
          <div className="dropdown" style={{ marginLeft: '1270px', marginBottom: '10px' }}>
            <i className="fas fa-download download-icon"></i>
            <select className="right" style={{ width: '110px', paddingLeft: '30px' }}>
              <option>Export</option>
              <option>Pdf</option>
              <option>Excel</option>
            </select>
          </div>

          <div className="title" style={{ display: 'flex', justifyContent: 'space-between', width: '1380px', height: '230px' }}>
            <div style={{ flex: '0.8', fontSize: '15.5px' }}> {/* Reduced font size to 12px */}
              <h2 style={{ marginBottom: '10px', color: '#828587', fontSize: '15.5px' }}>Status: {details.is_accepted ? 'Accepted' : 'Rejected'}</h2>
              <h2 style={{ color: '#828587', fontSize: '15.5px' }}>Part Number</h2>
              <h2 style={{ marginBottom: '10px', color: '#828587', fontSize: '15.5px' }}>{details.id || 'loading...'}</h2>
              <h2 style={{ color: '#828587', fontSize: '15.5px' }}>Part Description</h2>
              <h2 style={{ marginBottom: '10px', color: '#828587', fontSize: '15.5px' }}>{details.part || 'loading...'}</h2>
            </div>

            <div style={{ flex: '0.8', fontSize: '15.5px' }}> {/* Reduced font size to 12px */}
              <h2 style={{ marginBottom: '10px', color: '#828587', fontSize: '15.5px' }}>Station: {details.station}</h2>
              <h2 style={{ color: '#828587', fontSize: '15.5px' }}>Model Number</h2>
              <h2 style={{ marginBottom: '10px', color: '#828587', fontSize: '15.5px' }}>{details.model_number || 'M1'}</h2>
              <h2 style={{ color: '#828587', fontSize: '15.5px' }}>Shift</h2>
              <h2 style={{ marginBottom: '10px', color: '#828587', marginLeft: '0px', fontSize: '15.5px' }}>{details.shift || 'S1'}</h2>
            </div>

            <div style={{ flex: '0.8', fontSize: '12px' }}> {/* Reduced font size to 12px */}
              <h2 style={{ marginBottom: '10px', color: '#828587', fontSize: '15.5px' }}>Batch Number</h2>
              <h2 style={{ marginBottom: '10px', color: '#828587', fontSize: '15.5px' }}>{details.batch_number || 'B1'}</h2>
              <h2 style={{ color: '#828587', fontSize: '15.5px' }}>Inspection Timestamp</h2>
              <h2 style={{ marginBottom: '10px', color: '#828587', fontSize: '15.5px' }}>{details.timestamp || 'loading...'}</h2>
              <h2 style={{ color: '#828587', fontSize: '15.5px' }}>Defect List</h2>
              <h2 style={{ marginBottom: '10px', color: '#828587', fontSize: '15.5px' }}>{details.defect_list || 'loading...'}</h2>
            </div>

            <div style={{ flex: '1.6' }}>
              <h2 style={{ color: '#828587', fontSize: '14px' }}>Metrology Readings</h2>
              <table style={{ width: '100%', maxHeight: '200px', overflowY: 'auto', fontSize: '14px' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '5px 10px', fontSize: '14px' }}>Parameter</th>
                    <th style={{ padding: '5px 10px', fontSize: '14px' }}>Measured (mm)</th>
                    <th style={{ padding: '5px 10px', fontSize: '14px' }}>Specification (mm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '5px 10px', fontSize: '14px' }}>Height</td>
                    <td style={{ padding: '5px 10px', fontSize: '14px' }}>{details.height || 'N/A'}</td>
                    <td style={{ padding: '5px 10px', fontSize: '14px' }}>240</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '5px 10px', fontSize: '14px' }}>Neck Width</td>
                    <td style={{ padding: '5px 10px', fontSize: '14px' }}>{details.neck_width || 'N/A'}</td>
                    <td style={{ padding: '5px 10px', fontSize: '14px' }}>48</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '5px 10px', fontSize: '14px' }}>Base Width</td>
                    <td style={{ padding: '5px 10px', fontSize: '14px' }}>{details.base_width || 'N/A'}</td>
                    <td style={{ padding: '5px 10px', fontSize: '14px' }}>75</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '5px 10px', fontSize: '14px' }}>Neck Outer Diameter</td>
                    <td style={{ padding: '5px 10px', fontSize: '14px' }}>{details.neck_outer_diameter || 'N/A'}</td>
                    <td style={{ padding: '5px 10px', fontSize: '14px' }}>52</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '5px 10px', fontSize: '14px' }}>Neck Lock Length</td>
                    <td style={{ padding: '5px 10px', fontSize: '14px' }}>{details.neck_lock_length || 'N/A'}</td>
                    <td style={{ padding: '5px 10px', fontSize: '14px' }}>28</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
        <div className="camera-thumbnails" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {imageUrls && imageUrls.length > 0 ? (
            imageUrls.map((image, index) => (
              <div
                key={index}
                className="camera-thumbnail"
                style={{
                  width: '28%',
                  marginBottom: '20px',
                  height: '160px',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img
                    src={image}
                    alt={`Image ${index + 1}`}
                    className="image-box-img"
                    style={{ width: '360px', height: '140px' }}
                    onClick={() => handleImageClick(image)}
                  />
                  <button
                    onClick={() => handleImageClick(image)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '20px',
                      color: '#fff',
                    }}
                  >
                    <AiOutlineEye />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div>Loading Images...</div>
          )}
        </div>

        {/* Modal for larger view */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>View Image</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img src={selectedImage} alt="Selected Image" style={{ width: '100%' }} />
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default InspectionPage;
