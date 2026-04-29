const express = require('express')
const pool = require('../db/db')
const result = require('../utils/result')
const router = express.Router()

router.post('/', (req, res) => {
    const { propertyId, total, fromDate, toDate } = req.body
    const sql = `INSERT INTO bookings(userId,propertyId,fromDate,toDate,total)
    VALUES (?,?,?,?,?)`
    pool.query(sql, [req.headers.userId, propertyId, fromDate, toDate, total], (error, data) => {
        res.send(result.createResult(error, data))
    })
})

router.get('/', (req, res) => {
    const sql = `
        SELECT b.id, b.propertyId, b.fromDate, b.toDate, b.total, b.status,
               p.title as propertyTitle, p.profileImage as propertyImage, p.address as propertyAddress
        FROM bookings b
        JOIN property p ON b.propertyId = p.id
        WHERE b.userId = ?
        ORDER BY b.createdTimestamp DESC
    `
    pool.query(sql, [req.headers.userId], (error, data) => {
        res.send(result.createResult(error, data))
    })
})

router.delete('/:id', (req, res) => {
    const sql = `UPDATE bookings SET status = 'cancelled' WHERE id = ? AND userId = ?`
    pool.query(sql, [req.params.id, req.headers.userId], (error, data) => {
        res.send(result.createResult(error, data))
    })
})

module.exports = router