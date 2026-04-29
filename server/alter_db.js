const mysql = require('mysql2')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'manager',
    database: 'airbnb_db'
})

// Check if role column exists, if not add it.
const checkColSql = `SHOW COLUMNS FROM user LIKE 'role'`

pool.query(checkColSql, (err, data) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }

    if (data.length === 0) {
        // Add role column
        pool.query(`ALTER TABLE user ADD COLUMN role VARCHAR(10) DEFAULT 'user'`, (err2) => {
            if (err2) console.error(err2)
            else {
                console.log("Added 'role' column.")
                // Set first user as admin
                pool.query(`UPDATE user SET role='admin' ORDER BY id ASC LIMIT 1`, (err3) => {
                    if (err3) console.error(err3)
                    else console.log("Set first user as admin.")
                    process.exit(0)
                })
            }
        })
    } else {
        console.log("Column 'role' already exists.")
        // Still ensure at least one admin exists
        pool.query(`UPDATE user SET role='admin' ORDER BY id ASC LIMIT 1`, (err3) => {
            process.exit(0)
        })
    }
})
