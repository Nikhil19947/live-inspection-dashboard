require('dotenv').config();
const mysql = require('mysql2/promise'); // Use the promise version
const express = require('express');
const cors = require('cors');
const PORT = 6001;

const app = express();
app.use(express.json());
app.use(cors());

// Create a MySQL connection pool
const db = mysql.createPool({
    host: 'localhost',        
    user: 'root',            
    password: 'root_pass813', 
    database: 'dummydb' 
});

// Route for defects
app.get('/api/defects', async (req, res) => {
    const { part_id } = req.query; // Extract part_id from query parameters

    let sql = 'SELECT * FROM results';
    let params = [];

    if (part_id) {
        // If part_id is provided, modify the query to filter based on part_id
        sql += ' WHERE part_id = ?';
        params.push(part_id); // Add the part_id to the query params
    }

    try {
        const [results] = await db.query(sql, params); // Pass params to avoid SQL injection
        res.json(results); // Send the filtered results as JSON
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});


  

app.get('/api/summary', async (req, res) => {
    const { part_id } = req.query; // Extract part_id from query parameters

    let sql = `
        SELECT 
            COUNT(*) AS total_count, 
            SUM(CASE WHEN is_accepted = 1 THEN 1 ELSE 0 END) AS total_accepted,
            SUM(CASE WHEN is_accepted = 0 THEN 1 ELSE 0 END) AS total_non_accepted
        FROM results
    `;
    let params = [];

    if (part_id) {
        // If part_id is provided, modify the query to filter based on part_id
        sql += ' WHERE part_id = ?';
        params.push(part_id); // Add the part_id to the query params
    }

    try {
        const [results] = await db.query(sql, params); // Pass params to avoid SQL injection
        const { total_count, total_accepted, total_non_accepted } = results[0];
        
        res.json({
            totalAccepted: total_accepted,
            totalNonAccepted: total_non_accepted,
            totalInspected: total_count
        }); // Send the counts as JSON
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});


// Route for analytics
app.get('/api/analytics', async (req, res) => {
    const sql = `
        SELECT analytics.analytics_id, analytics.total_inspections, analytics.total_pass, analytics.total_fail,
               analytics.defect_count, analytics.pass_rate, analytics.fail_rate, products.part_name
        FROM analytics
        JOIN products ON analytics.part_id = products.part_id
    `;
    try {
        const [results] = await db.query(sql);
        res.json(results);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Route for parts
app.get('/api/parts', async (req, res) => {
    try {
        const [parts] = await db.query('SELECT * FROM products WHERE is_deleted = 0');
        res.json(parts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching parts data' });
    }
});

app.delete('/api/parts/:id', (req, res) => {
    const partId = req.params.id;    
    const sql = 'UPDATE products SET is_deleted = 1 WHERE product_id = ?';
    
    db.query(sql, [partId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete part' });
        }
        return res.status(200).json({ message: 'Part deleted successfully' });
    });
});

app.get('/api/station', async (req, res) => {
    try {
        const [parts] = await db.query('SELECT * FROM station WHERE is_deleted = 0');
        res.json(parts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching station data' });
    }
});

app.delete('/api/station/:id', (req, res) => {
    const stationId = req.params.id;    
    const sql = 'UPDATE station SET is_deleted = 1 WHERE station_id = ?';
    
    db.query(sql, [stationId], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Failed to delete station' });
        }
        return res.status(200).json({ message: 'Station deleted successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
