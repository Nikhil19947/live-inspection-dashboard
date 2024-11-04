require('dotenv').config();
const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');
const PORT = 5000;

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',        
  user: 'root',            
  password: 'root_pass813', 
  database: 'factreeai' 
});

app.use(cors());
app.use(express.json());

app.get('/api/defects', (req, res) => {
    const sql = `
        SELECT defects.defect_id, defects.defect_type, defects.severity_level, 
               inspection_results.feature_name, inspection_results.is_defective,
               inspections.inspection_timestamp, products.part_name
        FROM defects
        JOIN inspection_results ON defects.result_id = inspection_results.result_id
        JOIN inspections ON inspection_results.inspection_id = inspections.inspection_id
        JOIN products ON inspections.part_id = products.part_id
    `;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

app.get('/api/inspections', (req, res) => {
    const sql = `
        SELECT inspections.inspection_id, inspections.inspection_timestamp, inspections.result, 
               products.part_name, camera_table.camera_serial_number, operators.operator_name
        FROM inspections
        JOIN products ON inspections.part_id = products.part_id
        JOIN camera_table ON inspections.camera_id = camera_table.camera_id
        JOIN operators ON inspections.operator_id = operators.operator_id
    `;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

app.get('/api/analytics', (req, res) => {
    const sql = `
        SELECT analytics.analytics_id, analytics.total_inspections, analytics.total_pass, analytics.total_fail,
               analytics.defect_count, analytics.pass_rate, analytics.fail_rate, products.part_name
        FROM analytics
        JOIN products ON analytics.part_id = products.part_id
    `;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
