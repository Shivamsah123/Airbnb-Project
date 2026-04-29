const mysql = require('mysql2')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'manager',
    database: 'airbnb_db'
})

const sql = `
create table if not exists wishlist (
    id integer primary key auto_increment,
    userId integer,
    propertyId integer,
    createdTimestamp DATETIME default CURRENT_TIMESTAMP
);
`

pool.query(sql, (error, data) => {
    if(error) {
        console.error(error)
    } else {
        console.log("Table 'wishlist' created successfully.")
    }
    process.exit(0)
})
