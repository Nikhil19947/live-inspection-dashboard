import React, { useState } from "react";
import GaugeChart from "react-gauge-chart";
import name from '../assets/FactreeWriting.png'
import logo from '../assets/FactreeLogo.png'
import "@fortawesome/fontawesome-free/css/all.min.css";

const InspectionPage = () => {
    const data = [
        {
            user: 'John Doe',
            email: 'johndoe@gmail.com',
            role: 'Super Admin',
            status: 'active',
        },
        {
            user: 'Alice',
            email: 'alice@gmail.com',
            role: 'Operator',
            status: 'inactive',
        },
        {
            user: 'Bob',
            email: 'bob@gmail.com',
            role: 'Admin',
            status: 'active',
        },
        {
            user: 'John Doe',
            email: 'johndoe@gmail.com',
            role: 'Super Admin',
            status: 'active',
        },
        {
            user: 'Alice',
            email: 'alice@gmail.com',
            role: 'Operator',
            status: 'inactive',
        },
        {
            user: 'Bob',
            email: 'bob@gmail.com',
            role: 'Admin',
            status: 'active',
        },
        {
            user: 'John Doe',
            email: 'johndoe@gmail.com',
            role: 'Super Admin',
            status: 'active',
        },
        {
            user: 'Alice',
            email: 'alice@gmail.com',
            role: 'Operator',
            status: 'inactive',
        },
        {
            user: 'Bob',
            email: 'bob@gmail.com',
            role: 'Admin',
            status: 'active',
        },
        {
            user: 'John Doe',
            email: 'johndoe@gmail.com',
            role: 'Super Admin',
            status: 'active',
        },
        {
            user: 'Alice',
            email: 'alice@gmail.com',
            role: 'Operator',
            status: 'inactive',
        },
        {
            user: 'Bob',
            email: 'bob@gmail.com',
            role: 'Admin',
            status: 'active',
        },
        {
            user: 'John Doe',
            email: 'johndoe@gmail.com',
            role: 'Super Admin',
            status: 'active',
        },
        {
            user: 'Alice',
            email: 'alice@gmail.com',
            role: 'Operator',
            status: 'inactive',
        },
        {
            user: 'Bob',
            email: 'bob@gmail.com',
            role: 'Admin',
            status: 'active',
        },
        {
            user: 'John Doe',
            email: 'johndoe@gmail.com',
            role: 'Super Admin',
            status: 'active',
        },
        {
            user: 'Alice',
            email: 'alice@gmail.com',
            role: 'Operator',
            status: 'inactive',
        },
        {
            user: 'Bob',
            email: 'bob@gmail.com',
            role: 'Admin',
            status: 'active',
        },
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
    const itemsPerPage = 8;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const pageRange = 5;

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
                                    <a href="/reports" class="btn btn-outline-secondary w-100 mb-3" style={{ borderRadius: '8px', marginTop: '20px' }}>Live Inspection Screen</a>
                                </li>
                                <li class="nav-item">
                                    <a href="/detailed_view" class="btn btn-outline-secondary w-100 mb-3" style={{ borderRadius: '8px' }}>Insights</a>
                                </li>
                                <li class="nav-item">
                                    <a href="/reports" class="btn btn-outline-secondary w-100 mb-3" style={{ borderRadius: '8px' }}>Reports</a>
                                </li>
                                <li class="nav-item">
                                    <a href="/parts" class="btn btn-outline-secondary w-100 mb-3" style={{ borderRadius: '8px' }}>Part Settings</a>
                                </li>
                                <li class="nav-item">
                                    <a href="/admin" class="btn btn-outline-secondary w-100 mb-3" style={{ borderRadius: '8px' }}>User management</a>
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
                    <div style={{ width: '100%' }}>
                        <div className="title">
                            <p style={{ marginLeft: '15px', marginTop: '-2px' }}>Filters</p>
                            <div className="dropdown" style={{ marginBottom: '15px' }}>
                                <i className="fas fa-search search-icon" style={{ marginLeft: '15px' }}></i>
                                <select className="left-first" style={{ width: '470px', paddingLeft: '30px', height: '60px' }}>
                                    <option>Search Role</option>
                                    <option>Super Admin</option>
                                    <option>Admin</option>
                                    <option>Operator</option>
                                </select>
                            </div>
                            <div className="dropdown">
                                <i className="fas fa-search search-icon" style={{ marginLeft: '15px' }}></i>
                                <select className="left-first" style={{ width: '470px', paddingLeft: '30px', height: '60px' }}>
                                    <option>Search Plan</option>
                                    <option>Plan 1</option>
                                    <option>Plan 2</option>
                                </select>
                            </div>
                            <div className="dropdown">
                                <i className="fas fa-search search-icon" style={{ marginLeft: '15px' }}></i>
                                <select className="left-first" style={{ width: '470px', paddingLeft: '30px', height: '60px' }}>
                                    <option>Search Status</option>
                                    <option>Active</option>
                                    <option>Inactive</option>
                                    <option>Pending</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="table-box">
                        <div>
                            <div className="dropdown-container">
                                <div className="dropdown" style={{ marginLeft: '10px' }}>
                                    <i className="fas fa-download download-icon"></i>
                                    <select className="right" style={{ width: '110px', paddingLeft: '30px', marginRight: '920px' }}>
                                        <option>Export</option>
                                        <option>Pdf</option>
                                        <option>Excel</option>
                                    </select>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search User"
                                    className="form-control"
                                    style={{ marginLeft: '10px', width: '200px', borderRadius: '8px' }}
                                />

                                <a href="/add_user"><button className="btn btn-primary" style={{ padding: '8px 15px', borderRadius: '8px' }}>
                                    <i className="fas fa-user-plus" style={{ marginRight: '5px' }}></i> Add New User
                                </button></a>
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
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map((item, index) => (
                                    <tr key={index}>
                                        <td><input type="checkbox" /></td>
                                        <td>{item.user}</td>
                                        <td>{item.email}</td>
                                        <td style={{ color: item.role === "Super Admin" ? "red" : item.role === "Admin" ? "purple" : "green", fontWeight: "bold" }}>
                                            {item.role}
                                        </td>
                                        <td style={{ color: item.status === "inactive" ? "grey" : "green", fontWeight: "bold" }}>
                                            {item.status}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm"
                                                style={{ marginRight: '5px' }}
                                                title="Delete"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                            <button
                                                className="btn btn-sm"
                                                style={{ marginRight: '5px' }}
                                                title="View"
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            <button
                                                className="btn btn-sm"
                                                title="More"
                                            >
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