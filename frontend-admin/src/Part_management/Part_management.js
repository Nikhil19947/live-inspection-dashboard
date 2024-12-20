import React, { useState, useEffect } from "react";
import name from '../assets/FactreeWriting.png'
import logo from '../assets/FactreeLogo.png'
import "@fortawesome/fontawesome-free/css/all.min.css";

const InspectionPage = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showAlert, setshowAlert] = useState(false);
    const itemsPerPage = 8;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const pageRange = 5;

    useEffect(() => {
        fetch('http://localhost:5002/api/parts')
            .then(response => response.json())
            .then(data => {
                setData(data);
            })
            .catch(error => console.error('Error fetching parts:', error));
    }, []);


    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const paginatedData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getPageNumbers = () => {
        const start = Math.max(1, currentPage - Math.floor(pageRange / 2));
        const end = Math.min(totalPages, start + pageRange - 1);
        return Array.from({ length: end - start + 1 }, (_, index) => start + index);
    };

    const handleDelete = (productId) => {
        setshowAlert(true);
        fetch(`http://localhost:5000/api/parts/${productId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                setData(data.filter(item => item.product_id !== productId)); 
            } else {
                alert('Failed to delete part');
            }
        })
        .catch(error => console.error('Error deleting part:', error));
        setTimeout(() => {
            window.location.reload();
        }, 2000);
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
                                    <a href="/dashboard" class="btn btn-outline-secondary w-100 mb-3" style={{ borderRadius: '8px', marginTop: '20px' }}>Live Inspection Dashboard</a>
                                </li>
                                <li class="nav-item">
                                    <a href="/reports" class="btn btn-outline-secondary w-100 mb-3" style={{ borderRadius: '8px' }}>Live Inspection Details</a>
                                </li>
                                <li class="nav-item">
                                    <a href="/admin" class="btn btn-outline-secondary w-100 mb-3" style={{ borderRadius: '8px' }}>User Management</a>
                                </li>
                                <li class="nav-item">
                                    <a href="/station" class="btn btn-outline-secondary w-100 mb-3" style={{ borderRadius: '8px' }}>Station Management</a>
                                </li>
                                <li class="nav-item" style={{ marginTop: '360px' }}>
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
            <div className="main-content">
                <div style={{ padding: "20px", marginLeft: '80px', width: 'calc(100% - 220px)' }}>
                    <h1 className="live-inspection-title" style={{ marginBottom: '30px' }}>Part Management</h1>
                    {
                    showAlert && (
                        <div class="alert alert-success" role="alert" style={{width:'250px', marginLeft:'555px'}}>
                            Part Deleted Successfully
                        </div>
                    )
                    }
                    <div className="table-box">
                        <div>
                            <div className="dropdown-container">
                                <div className="dropdown" style={{ marginLeft: '10px', marginBottom: '30px', marginTop: '10px' }}>
                                    <i className="fas fa-download download-icon"></i>
                                    <select className="right" style={{ width: '110px', paddingLeft: '30px', marginRight: '740px' }}>
                                        <option>Export</option>
                                        <option>Pdf</option>
                                        <option>Excel</option>
                                    </select>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search Product"
                                    className="form-control"
                                    style={{ marginLeft: '10px', width: '200px', borderRadius: '8px' }}
                                />

                                <a href="/add_part"><button className="btn btn-primary" style={{ padding: '8px 15px', borderRadius: '8px' }}>
                                    <i className="fas fa-user-plus" style={{ marginRight: '5px' }}></i> Add New Part
                                </button></a>
                            </div>
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <th><input type="checkbox" /></th>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Batch</th>
                                    <th>Created At</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map((item, index) => (
                                    <tr key={index}>
                                        <td><input type="checkbox" /></td>
                                        <td>{item.product_name}</td>
                                        <td>{item.product_type}</td>
                                        <td>{item.product_batch}</td>
                                        <td>-</td>
                                        <td>
                                            <button
                                                className="btn btn-sm"
                                                title="Delete"
                                                onClick={() => handleDelete(item.product_id)} 
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                            <button className="btn btn-sm" title="View">
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            <button className="btn btn-sm" title="More">
                                                <i className="fas fa-ellipsis-v"></i>
                                            </button>
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