require('dotenv').config();
const mysql = require('mysql2/promise'); // Use the promise version
const express = require('express');
const cors = require('cors');
const PORT = 5000;

const app = express();
app.use(express.json());
app.use(cors());

// Create a MySQL connection pool
const db = mysql.createPool({
    host: 'localhost',        
    user: 'root',            
    password: 'root_pass813', 
    database: 'factreeai' 
});

// Route for defects
app.get('/api/defects', async (req, res) => {
    const sql = `
        SELECT defects.defect_id, defects.defect_type, defects.severity_level, 
               inspection_results.feature_name, inspection_results.is_defective,
               inspections.inspection_timestamp, products.part_name
        FROM defects
        JOIN inspection_results ON defects.result_id = inspection_results.result_id
        JOIN inspections ON inspection_results.inspection_id = inspections.inspection_id
        JOIN products ON inspections.part_id = products.part_id
    `;
    try {
        const [results] = await db.query(sql);
        res.json(results);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Route for inspections
app.get('/api/inspections', async (req, res) => {
    const sql = `
        SELECT inspections.inspection_id, inspections.inspection_timestamp, inspections.result, 
               products.part_name, camera_table.camera_serial_number, operators.operator_name
        FROM inspections
        JOIN products ON inspections.part_id = products.part_id
        JOIN camera_table ON inspections.camera_id = camera_table.camera_id
        JOIN operators ON inspections.operator_id = operators.operator_id
    `;
    try {
        const [results] = await db.query(sql);
        res.json(results);
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
