# Live Inspection Dashboard

This project is a real-time inspection dashboard designed for monitoring product quality and defects using AI/ML models. The project includes a frontend admin dashboard for live monitoring and a backend system that manages product inspections, user accounts, and reporting.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Running the Project](#running-the-project)
4. [Database Setup](#database-setup)
5. [License](#license)

---

## Prerequisites

Before you start, ensure that you have the following software installed on your system:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MySQL** (for database setup)

---

## Installation

To set up the project on your local machine, follow these steps:

### 1. Clone the Repository

Clone the repository from GitHub to your local machine:

```bash
git clone https://github.com/Nikhil19947/live-inspection-dashboard.git
cd live-inspection-dashboard
```

### 2. Install Frontend Dependencies

Navigate to the `frontend-admin` directory and install the required dependencies:

```bash
cd frontend-admin
npm install
```

### 3. Install Backend Dependencies

Navigate to the `backend` directory and install the required dependencies:

```bash
cd backend
npm install
```

---

## Running the Project

### 1. Running the Frontend

To start the frontend server, navigate to the `frontend-admin` directory and run:

```bash
npm start
```

This will start the frontend server at `http://localhost:3000`.

### 2. Running the Backend

To start the backend server, navigate to the `backend` directory and run the following commands:

```bash
node login.js
node dashboard.js
```

This will start the backend servers for user authentication and inspection data management.

---

## Database Setup

To run the project, you'll need to set up a MySQL database and create the necessary tables. Follow these steps:

### 1. Create the Database

Create a database named `dummydb`:

```sql
CREATE DATABASE dummydb;
USE dummydb;
```

### 2. Create the Tables

Execute the following SQL queries to create the required tables:

#### 1. Products Table

```sql
CREATE TABLE products (
    product_id VARCHAR(36) PRIMARY KEY,
    product_name VARCHAR(255),
    product_type VARCHAR(255),
    product_batch VARCHAR(255),
    is_deleted TINYINT(1)
);
```

#### 2. Inspections Table

```sql
CREATE TABLE inspections (
    id VARCHAR(45) PRIMARY KEY,
    part_id VARCHAR(255),
    input_frame_path TEXT,
    inference_frame_path TEXT,
    defect_list TEXT,
    is_accepted TINYINT(1),
    timestamp DATETIME,
    station VARCHAR(45),
    part VARCHAR(45)
);
```

#### 3. Station Table

```sql
CREATE TABLE station (
    station_id VARCHAR(45) PRIMARY KEY,
    station_name VARCHAR(45),
    location VARCHAR(45),
    is_deleted TINYINT
);
```

#### 4. Users Table

```sql
CREATE TABLE users (
    username VARCHAR(45) PRIMARY KEY,
    password VARCHAR(255),
    first_name VARCHAR(45),
    last_name VARCHAR(45),
    phone_number LONGTEXT,
    role VARCHAR(45),
    shift VARCHAR(45),
    reporting_manager VARCHAR(45)
);
```

#### 5. Results Table

```sql
CREATE TABLE results (
    part_id INT PRIMARY KEY,
    part_description VARCHAR(45),
    part_number INT,
    model_number INT,
    operator VARCHAR(45),
    shift VARCHAR(45),
    station VARCHAR(45),
    batch VARCHAR(45),
    status VARCHAR(45),
    timestamp VARCHAR(45)
);
```
