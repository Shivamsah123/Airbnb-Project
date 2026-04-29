const mysql = require('mysql2')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'manager',
    database: 'airbnb_db'
})

const sql = `ALTER TABLE bookings ADD COLUMN status VARCHAR(20) DEFAULT 'upcoming'`

pool.query(sql, (err) => {
    if (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log("Column 'status' already exists in 'bookings'.")
        } else {
            console.error("Error adding column:", err)
        }
    } else {
        console.log("Added 'status' column to 'bookings' table.")
    }
    process.exit(0)
})
