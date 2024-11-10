import React, { useState } from "react";
import './Reports.css';
import GaugeChart from "react-gauge-chart";
import name from '../assets/FactreeWriting.png'
import logo from '../assets/FactreeLogo.png'
import "@fortawesome/fontawesome-free/css/all.min.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const InspectionPage = () => {
  const data = [
    { partDescription: 'Part 1', partNumber: '123', modelNumber: 'A1', operator: 'John', shift: 'Shift 1', station: 'Station 1', batch: 'Batch 1', status: 'ACCEPTED', timestamp: '2024-11-09 12:30', defectType: 'Defect 1' },
    { partDescription: 'Part 2', partNumber: '124', modelNumber: 'A2', operator: 'Jane', shift: 'Shift 2', station: 'Station 2', batch: 'Batch 2', status: 'REJECTED', timestamp: '2024-11-10 12:45', defectType: 'Defect 2' },
  ];
  const gaugeTexts = [
    "Wall Thickness",
    "Melt Temperature",
    "Cooling Rate",
    "Blow Pressure",
    "Parison Control",
    "Cycle Time",
    "Melt Flow Index",
    "Extrusion Speed",
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [stationFilter, setStationFilter] = useState('');
  const [defectTypeFilter, setDefectTypeFilter] = useState('');
  const [resultFilter, setResultFilter] = useState('');
  const [shiftFilter, setShiftFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const itemsPerPage = 8;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const pageRange = 5;

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value); // Update start date filter
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value); // Update end date filter
  };

  const filteredData = data.filter((item) => {
    const itemDate = item.timestamp.split(" ")[0]; // Extract the date part (YYYY-MM-DD)
    const isWithinDateRange = 
      (!startDate || itemDate >= startDate) && 
      (!endDate || itemDate <= endDate);

    return (
      (stationFilter ? item.station === stationFilter : true) &&
      (defectTypeFilter ? item.defectType === defectTypeFilter : true) &&
      (resultFilter ? item.status.toLowerCase() === resultFilter.toLowerCase() : true) &&
      (shiftFilter ? item.shift === shiftFilter : true) &&
      isWithinDateRange // Apply date range filter
    );
  });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPageNumbers = () => {
    const start = Math.max(1, currentPage - Math.floor(pageRange / 2));
    const end = Math.min(totalPages, start + pageRange - 1);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  };


  return (
    <div style={{ display: 'flex' }}>
      <nav class="navbar bg-body-tertiary fixed-top" style={{width:'5px'}}>
        <div class="container-fluid">
          <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel" style={{width:'250px'}}>
            <div class="offcanvas-header">
              <img src={logo} style={{ width: '25px' }}></img>
              <img src={name} style={{ width: '100px', marginLeft: '10px' }}></img>
              <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
              <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li class="nav-item">
                  <a href="/reports" class="btn btn-outline-secondary w-100 mb-3" style={{borderRadius:'8px', marginTop:'20px'}}>Live Inspection Details</a>
                </li>
                <li class="nav-item">
                  <a href="/detailed_view" class="btn btn-outline-secondary w-100 mb-3" style={{borderRadius:'8px'}}>Detailed View</a>
                </li>
                <li class="nav-item" style={{ marginTop: '520px' }}>
                  <a href="/socials-login" class="btn btn-outline-secondary w-100 mb-3" style={{borderRadius:'8px'}}>Community</a>
                </li>
                <li class="nav-item">
                  <a href="/socials-login" class="btn btn-outline-secondary w-100 mb-3" style={{borderRadius:'8px'}}>Help Desk</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div className="main-content">
        <div style={{ padding: "20px", marginLeft: '80px', width: 'calc(100% - 220px)' }}>
          <div style={{ width: '100%' }}>
            <div className="title">
              <h1 className="live-inspection-title">Live Inspection Details</h1>
              <header style={{ textAlign: 'center', color: '#828587', marginBottom: '10px' }}>Last Updated:</header>

              <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', marginBottom: '5px' }}>
                {gaugeTexts.map((item, index) => (
                  <div key={index} style={{ textAlign: 'center' }}>
                    <GaugeChart
                      id={`gauge-chart${index}`}
                      nrOfLevels={6}
                      colors={["green", "orange", "red"]}
                      arcWidth={0.3}
                      percent={0.60}
                      textColor={'black'}
                      style={{ width: "150px" }}
                    />
                    <div>{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="table-box">
            <div>
              <div className="dropdown-container">
                <div className="dropdown">
                  <i className="fas fa-search search-icon" style={{ marginLeft: '15px' }}></i>
                  <select className="left-first" style={{ width: '170px', paddingLeft: '30px' }} value={stationFilter} onChange={(e) => setStationFilter(e.target.value)}>
                    <option>Search Station</option>
                    <option>Station 1</option>
                    <option>Station 2</option>
                  </select>
                </div>
                <div className="dropdown">
                  <i className="fas fa-search search-icon"></i>
                  <select className="left" style={{ width: '210px', paddingLeft: '30px' }} value={defectTypeFilter} onChange={(e) => setDefectTypeFilter(e.target.value)}>
                    <option>Search Defect Type</option>
                    <option>Defect 1</option>
                    <option>Defect 2</option>
                  </select>
                </div>
                <div className="dropdown">
                  <i className="fas fa-search search-icon"></i>
                  <select className="left1" style={{ width: '170px', paddingLeft: '30px' }} value={resultFilter} onChange={(e) => setResultFilter(e.target.value)}>
                    <option>Search Result</option>
                    <option>Accepted</option>
                    <option>Rejected</option>
                  </select>
                </div>
                <div className="dropdown">
                  <i className="fas fa-search search-icon"></i>
                  <select className="right" style={{ width: '150px', paddingLeft: '30px' }} value={shiftFilter} onChange={(e) => setShiftFilter(e.target.value)}>
                    <option>Search Shift</option>
                    <option>Shift 1</option>
                    <option>Shift 2</option>
                  </select>
                </div>
                <div className="dropdown">
                  <i className="fas fa-calendar-alt search-icon" style={{ marginLeft: '15px' }}></i>
                  <input type="date" value={startDate} onChange={handleStartDateChange} style={{ paddingLeft: '20px' }} />
                  <span style={{ marginLeft: '10px', marginRight: '10px' }}>to</span>
                  <input type="date" value={endDate} onChange={handleEndDateChange} style={{ paddingLeft: '20px' }} />
                </div>
                <div className="dropdown">
                  <i className="fas fa-download download-icon"></i>
                  <select className="right" style={{ width: '110px', paddingLeft: '30px' }}>
                    <option>Export</option>
                    <option>Pdf</option>
                    <option>Excel</option>
                  </select>
                </div>
              </div>
            </div>

            <table style={{
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
              borderCollapse: 'separate',
              overflow: 'hidden',
              marginTop: '20px',
            }}>
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>Part Description</th>
                  <th>Part Number</th>
                  <th>Model Number</th>
                  <th>Operator</th>
                  <th>Shift</th>
                  <th>Station</th>
                  <th>Batch</th>
                  <th>Status</th>
                  <th>Timestamp</th>
                  <th style={{ width: '130px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => (
                  <tr key={index}>
                    <td><input type="checkbox" /></td>
                    <td>{item.partDescription}</td>
                    <td>{item.partNumber}</td>
                    <td>{item.modelNumber}</td>
                    <td>{item.operator}</td>
                    <td>{item.shift}</td>
                    <td>{item.station}</td>
                    <td>{item.batch}</td>
                    <td style={{ color: item.status === "REJECTED" ? "red" : "green", fontWeight: "bold" }}>
                      {item.status}
                    </td>
                    <td>{item.timestamp}</td>
                    <td>
                      <a href='/detailed_view' style={{textDecoration:'none'}}>View Details</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="pagination-info">
                Showing {currentPage} of {totalPages} pages
              </span>
              <div className="pagination">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                  Previous
                </button>
                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={pageNum === currentPage ? "active" : ""}
                  >
                    {pageNum}
                  </button>
                ))}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                  Next
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionPage;