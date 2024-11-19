require('dotenv').config();
const mysql = require('mysql2/promise'); // Use the promise version
const express = require('express');
const cors = require('cors');
const PORT = 5002;

const app = express();
app.use(express.json());
app.use(cors());

app.use(cors({
  origin: 'http://localhost:3001', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // If you need cookies or authentication headers
}));

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));



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


app.get('/api/accept', async (req, res) => {
    const { part_id } = req.query; // Extract part_id from query parameters

    // Ensure part_id is provided, otherwise return an error
    if (!part_id) {
        return res.status(400).json({ error: 'part_id is required' });
    }

    // SQL query to select the most recent record based on timestamp
    let sql = 'SELECT is_accepted FROM results WHERE part_id = ? ORDER BY timestamp DESC LIMIT 1'; // Modify SQL to sort by timestamp

    try {
        // Pass part_id as a parameter to the query to prevent SQL injection
        const results = await db.query(sql, [part_id]);

        // Check if results are found, and send them back
        if (results.length > 0) {
            res.json(results[0]); // Send the most recent `is_accepted` value
        } else {
            res.status(404).json({ error: 'No data found for the given part_id' });
        }
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


app.get('/api/get_analytics', async (req, res) => {
    const sql = `
        SELECT results.id, results.part, results.is_accepted, results.timestamp, results.station FROM results`;
    try {
        const [rows] = await db.query(sql);
        res.json(rows); 
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

app.get('/api/users', async (req, res) => {
    try {
        const [parts] = await db.query('SELECT * FROM users');
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
