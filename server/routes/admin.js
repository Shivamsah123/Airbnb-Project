const express = require('express')
const pool = require('../db/db')
const result = require('../utils/result')
const router = express.Router()

// Get all users
router.get('/users', (req, res) => {
    const sql = `SELECT id, firstName, lastName, email, phoneNumber, role, isDeleted FROM user`
    pool.query(sql, (err, data) => {
        res.send(result.createResult(err, data))
    })
})

// Delete user (or rather, soft delete)
router.delete('/users/:id', (req, res) => {
    const { id } = req.params
    const sql = `UPDATE user SET isDeleted = 1 WHERE id = ?`
    pool.query(sql, [id], (err, data) => {
        res.send(result.createResult(err, data))
    })
})

// Get overall stats
router.get('/stats', (req, res) => {
    const queries = {
        users: `SELECT COUNT(*) as count FROM user WHERE isDeleted = 0`,
        properties: `SELECT COUNT(*) as count FROM property`,
        bookings: `SELECT COUNT(*) as count FROM bookings`
    }
    
    let stats = {}
    let errors = []
    
    // Execute queries (ideally with Promise.all in a production env, using nested callbacks for simplicity here)
    pool.query(queries.users, (err, userData) => {
        if(err) errors.push(err)
        else stats.users = userData[0].count
        
        pool.query(queries.properties, (err, propData) => {
            if(err) errors.push(err)
            else stats.properties = propData[0].count
            
            pool.query(queries.bookings, (err, bookData) => {
                if(err) errors.push(err)
                else stats.bookings = bookData[0].count
                
                if (errors.length > 0) res.send(result.createErrorResult(errors[0]))
                else res.send(result.createSuccessResult(stats))
            })
        })
    })
})

// Get all properties
router.get('/properties', (req, res) => {
    const sql = `
        SELECT p.id, p.title, p.address, p.rent, p.profileImage, u.firstName as ownerName, u.email as ownerEmail 
        FROM property p
        JOIN user u ON p.ownerId = u.id
    `
    pool.query(sql, (err, data) => {
        res.send(result.createResult(err, data))
    })
})

// Delete a property
router.delete('/properties/:id', (req, res) => {
    const { id } = req.params
    const sql = `DELETE FROM property WHERE id = ?`
    pool.query(sql, [id], (err, data) => {
        res.send(result.createResult(err, data))
    })
})

// Get all bookings
router.get('/bookings', (req, res) => {
    const sql = `
        SELECT b.id, b.fromDate, b.toDate, b.total, b.createdTimestamp,
               u.firstName as userName, u.email as userEmail,
               p.title as propertyTitle
        FROM bookings b
        JOIN user u ON b.userId = u.id
        JOIN property p ON b.propertyId = p.id
        ORDER BY b.createdTimestamp DESC
    `
    pool.query(sql, (err, data) => {
        res.send(result.createResult(err, data))
    })
})

module.exports = router
