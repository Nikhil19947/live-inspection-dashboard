import React, { useState } from "react";
import name from '../assets/FactreeWriting.png'
import logo from '../assets/FactreeLogo.png'
import { Modal } from 'react-bootstrap';
import { AiOutlineEye } from 'react-icons/ai';

const InspectionPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

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
                <li class="nav-item" style={{ marginTop: '520px' }}>
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
          <div className="dropdown" style={{ marginLeft: '1470px', marginBottom: '15px' }}>
            <i className="fas fa-download download-icon"></i>
            <select className="right" style={{ width: '110px', paddingLeft: '30px' }}>
              <option>Export</option>
              <option>Pdf</option>
              <option>Excel</option>
            </select>
          </div>
          <div className="title" style={{ display: 'flex', justifyContent: 'space-between', width: '1580px', height: '300px' }}>
            <div style={{ flex: '0.8' }}>
              <h2 style={{ marginBottom: '30px', color: '#828587' }}>Status: Rejected</h2>
              <h2 style={{ color: '#828587' }}>Part Number</h2>
              <h2 style={{ marginBottom: '30px', color: '#828587' }}>GB003HTG123</h2>
              <h2 style={{ color: '#828587' }}>Part Description</h2>
              <h2 style={{ marginBottom: '30px', color: '#828587' }}>Goldie 3000ml Short Angular Bottle</h2>
            </div>

            <div style={{ flex: '0.8' }}>
              <h2 style={{ marginBottom: '30px', color: '#828587' }}>Station: 1</h2>
              <h2 style={{ color: '#828587' }}>Model Number</h2>
              <h2 style={{ marginBottom: '30px', color: '#828587' }}>GB003HTG123</h2>
              <h2 style={{ color: '#828587' }}>Shift</h2>
              <h2 style={{ marginBottom: '30px', color: '#828587', marginLeft: '15px' }}>A</h2>
            </div>
            <div style={{ flex: '0.8' }}>
              <h2 style={{ marginBottom: '30px', color: '#828587' }}>Batch Number</h2>
              <h2 style={{ marginBottom: '30px', color: '#828587' }}>GB003HTG123</h2>
              <h2 style={{ color: '#828587' }}>Inspection Timestamp</h2>
              <h2 style={{ marginBottom: '30px', color: '#828587' }}>29-Oct-2024 05:03:01</h2>
              <h2 style={{ color: '#828587' }}>Defect List</h2>
              <h2 style={{ marginBottom: '30px', color: '#828587' }}>Flash and Pinhole</h2>
            </div>
            <div style={{ flex: '1.6' }}>
              <h2 style={{ color: '#828587' }}>Metrology Readings</h2>
              <table style={{ width: '100%', maxHeight: '200px', overflowY: 'auto', fontSize: '16px' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '5px 10px' }}>Parameter</th>
                    <th style={{ padding: '5px 10px' }}>Measured (mm)</th>
                    <th style={{ padding: '5px 10px' }}>Specification (mm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '5px 10px' }}>Height</td>
                    <td style={{ padding: '5px 10px' }}>250</td>
                    <td style={{ padding: '5px 10px' }}>240</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '5px 10px' }}>Neck Width</td>
                    <td style={{ padding: '5px 10px' }}>50</td>
                    <td style={{ padding: '5px 10px' }}>48</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '5px 10px' }}>Base Width</td>
                    <td style={{ padding: '5px 10px' }}>80</td>
                    <td style={{ padding: '5px 10px' }}>75</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '5px 10px' }}>Neck Outer Diameter</td>
                    <td style={{ padding: '5px 10px' }}>55</td>
                    <td style={{ padding: '5px 10px' }}>52</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '5px 10px' }}>Neck Lock Length</td>
                    <td style={{ padding: '5px 10px' }}>30</td>
                    <td style={{ padding: '5px 10px' }}>28</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
        <div style={{ width: '1580px', marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            {[{ label: 'No defect' }, { label: 'Defect' }, { label: 'No defect' }].map((item, index) => (
              <div key={index} style={{
                position: 'relative',
                backgroundColor: 'white',
                width: '32%',
                height: '190px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                padding: '20px',
              }}>
                {item.label}
                <img src={logo} alt="Inspection" style={{ width: '270px', height: '150px', marginLeft: '50px' }} />
                <AiOutlineEye
                  size={24}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    color: 'rgba(0, 0, 0, 0.6)',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleImageClick(logo)}
                />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {[{ label: 'Defect' }, { label: 'No defect' }, { label: 'Defect' }].map((item, index) => (
              <div key={index} style={{
                position: 'relative',
                backgroundColor: 'white',
                width: '32%',
                height: '190px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                padding: '20px',
              }}>
                {item.label}
                <img src={logo} alt="Inspection" style={{ width: '270px', height: '150px', marginLeft: '50px' }} />
                <AiOutlineEye
                  size={24}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    color: 'rgba(0, 0, 0, 0.6)',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleImageClick(logo)}
                />
              </div>
            ))}
          </div>

          <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Body style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              width: '750px',
              height: '750px',
              marginLeft: '-150px'
            }}>
              <img src={selectedImage} alt="Larger view" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </Modal.Body>
          </Modal>
        </div></div></div>
  );
};

export default InspectionPage;
