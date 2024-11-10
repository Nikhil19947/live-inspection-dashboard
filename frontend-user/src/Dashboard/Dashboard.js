import React, { useState, useRef, useEffect } from 'react';
import './Dashboard.css';
import logo from '../assets/FactreeLogo.png';
import name from '../assets/Factree Writing.png'
import { v4 as uuidv4 } from 'uuid';

function LiveInspection() {
  const [cameraFeeds, setCameraFeeds] = useState(Array(6).fill(null)); 
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [uniquePartId, setUniquePartId] = useState('');
  const [videoSrc, setVideoSrc] = useState(null)
  const [defects, setDefects] = useState([]);
  const [summary, setSummary] = useState([]);

  const thumbnailsRefs = useRef(Array(6).fill(null));

  const handleStart = async () => {
    const newUniquePartId = uuidv4();  // Generate a new unique part ID
    setUniquePartId(newUniquePartId);

    try {
      const response = await fetch('http://127.0.0.1:5000/start_process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          part_id: newUniquePartId,
          part_name: selectedVariant,
        }),
      });
      const data = await response.json();
      console.log('Response from backend:', data);

      // Set video source with the part_id included in the URL
      setVideoSrc(`http://127.0.0.1:5000/video_feed?part_id=${newUniquePartId}`);
      setIsStreaming(true);
    } catch (error) {
      console.error("Error starting process: ", error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleStop = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/stop_process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          part_id: uniquePartId,
        }),
        mode: 'no-cors' 
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response from backend:', data);
    } catch (error) {
      console.error("Error stopping process: ", error);
    } finally {
      setIsLoading(false);
      setVideoSrc(null);
      setIsStreaming(false);
    }
  };
  

  const handleCheck = async () => {
    if (isStreaming) {
      setIsLoading(true); // Show loading state
    }

    try {
      console.log('Inspect');

      fetch('http://127.0.0.1:5000/inspect_func')
      
      // Fetch images based on unique part_id from the Flask API
      const response = await fetch(`http://127.0.0.1:5000/get_images?part_id=${uniquePartId}`);
      const data = await response.json();
  
      // Check if images are returned successfully
      if (data.error) {
        console.error(data.error);
        setIsLoading(false);
        return;
      }
  
      const { image_urls } = data;
  
      // Fetch defects and summary data for the given part_id
      const res = await fetch(`http://127.0.0.1:6001/api/defects?part_id=${uniquePartId}`);
      const defects = await res.json();
      setDefects(defects);
  
      const resp = await fetch(`http://127.0.0.1:6001/api/summary?part_id=${uniquePartId}`);
      const summary = await resp.json();
      setSummary(summary);

      console.log('image update');
      
      let newFeeds = [...cameraFeeds];
      for (let i = 0; i < 6; i++) {
        if (newFeeds.length >= 6) {
          newFeeds.shift();
        }
        newFeeds.push(image_urls[i]);
      }
  
      // Limit the number of images to 6
      newFeeds = newFeeds.slice(0, 6);
  
      setCameraFeeds(newFeeds);

      // Trigger backend to start inspection process
      await fetch('http://127.0.0.1:5000/start_inspect', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <div className="live-inspection-page">
      {/* Live Inspection Header */}
      <header className="inspection-header">
        <div className="factree-logo">
          <img src={logo} alt="Factree Logo" />
          <img src={name} alt="Factree" />
        </div>
        <h1 className="live-inspection-title">Live Inspection</h1>
      </header>
      {/* Top bar for selection and controls */}
      <div className="top-bar">
        <div className="factree-section">
          {/* Moved Variant and Station Selectors below the logo */}
          <div className="selectors-buttons">
            <div className="selectors">
              <select>
                <option>Select Station</option>
                <option>Station 1</option>
                <option>Station 2</option>
              </select>
              <select onChange={(e) => setSelectedVariant(e.target.value)}>
                <option>Select Variant</option>
                <option>Variant 1</option>
                <option>Variant 2</option>
              </select>
            </div>
            {/* Controls buttons */}
            <div className="controls-buttons">
              <button type="button" className="btn btn-primary" onClick={handleStart} disabled={isStreaming}>START</button>
              <button type="button" className="btn btn-primary" onClick={handleCheck}>INSPECT</button>
              <button type="button" className="btn btn-danger" onClick={handleStop}>STOP</button>
            </div>
          </div>
        </div>
        {/* Inspector, Batch ID, Camera Health, PLC Health */}
        <div className="controls-section">
          {/* Inspector and Batch ID in one box */}
          <div className="status-info">
            <div className="status-item">
              <label>Inspector  &nbsp;&nbsp;:&nbsp;&nbsp;</label>
              <span> Inspector 1</span>
            </div>
            <div className="status-item">
              <label>Batch ID   &nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;</label>
              <span> Batch 1</span>
            </div>
          </div>

          {/* Health statuses in another box */}
          <div className="health-statuses">
            <div className="health-status1">
              <div className="health-status-label">Camera Health&nbsp;&nbsp;:</div>
              <div className="status-circle1"></div>
            </div>
            <div className="health-status2">
              <div className="health-status-label">PLC Health&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :</div>
              <div className="status-circle2"></div>
            </div>
          </div>
        </div>


      </div>

      {/* Main inspection area */}
      <div className="main-inspection-area">
        {/* Camera and defect section */}
        <div className="camera-feed">
          <strong><span>LIVE</span></strong>
          <div className="camera-header">
            <img src={videoSrc} style={{ width: '700px', height: '450px' }} />
          </div>
        </div>

        <div className="camera-thumbnails">
          {cameraFeeds.map((feed, index) => (
            <div key={index} className="camera-thumbnail">
              <img src={feed} alt={`Camera ${index + 1}`} style={{ width: '131px', marginTop: '10px' }} />
              <span>Camera {index + 1}</span>
            </div>
          ))}
        </div>


        {/* Defect classification, metrology, and summary section */}
        <div className="side-panel">
          {/* Defect classification table */}
          {/* Defect classification table */}
          <div className="defect-classification">
            <h2 style={{ marginTop: '15px' }}>Defect Classification</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Defect</th>
                    <th>Confidence Score</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {defects.length > 0 ? (
                    defects.map((defect, i) => {
                      const defectData = defect.defect_list.split(', ').map(item => {
                        const [defectType, score] = item.split(' ');
                        return {
                          defect_type: defectType,
                          count: score,
                          percentage: (parseFloat(score) * 100).toFixed(2)
                        };
                      });

                      return defectData.map((def, j) => (
                        <tr key={`${i}-${j}`}>
                          <td>{def.defect_type}</td>
                          <td>{def.count}</td>
                          <td>{def.percentage}%</td>
                        </tr>
                      ));
                    })
                  ) : (
                    <tr>
                      <td colSpan="3">Loading defects...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>


          </div>


          {/* Metrology table */}
          <div className="metrology">
            <h2 style={{ marginTop: '5px' }}>Metrology</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Measured</th>
                    <th>Specification</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {['Height', 'Width', 'Dia'].map((parameter, i) => (
                    <tr key={i}>
                      <td>{parameter}</td>
                      <td>{(Math.random() * 100).toFixed(2)} mm</td>
                      <td>50.00 ±2</td>
                      <td className={Math.random() > 0.5 ? 'pass' : 'error'}>
                        {Math.random() > 0.5 ? '✔' : '✖'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary section */}
          <div className="summary">
            <h2 style={{ marginTop: '5px' }}>Summary</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Defect</th>
                    <th>Count</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Total Accepted</td>
                    <td>{summary.totalAccepted}</td>
                    <td>{((summary.totalAccepted / summary.totalInspected) * 100).toFixed(2)}%</td>
                  </tr>
                  <tr>
                    <td>Total Non Accepted</td>
                    <td>{summary.totalNonAccepted}</td>
                    <td>{((summary.totalNonAccepted / summary.totalInspected) * 100).toFixed(2)}%</td>
                  </tr>
                  <tr>
                    <td>Total Inspected</td>
                    <td>{summary.totalInspected}</td>
                    <td>100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>


        </div>
      </div>

      <div className="bottom-section">
        <div className="bottom-box-wrapper">
          <div className="bottom-box">
            <p>INSPECTION IN PROGRESS</p>
          </div>
          <div className="bottom-box-new">
            <p style={{ fontSize: '15px', marginTop: '12px' }}>ACCEPTED/REJECTED</p>
          </div>
        </div>
        <div className="additional-box">
          <strong><p className="additional-text">OCR</p></strong>
          <p className="additional-text">Batch&nbsp;&nbsp;&nbsp;-</p>
          <p className="additional-text">Exp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-</p>
        </div>
      </div>

    </div>
  );
}

export default LiveInspection;
