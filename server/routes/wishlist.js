const express = require('express')
const pool = require('../db/db')
const result = require('../utils/result')
const router = express.Router()

// toggle wishlist
router.post('/toggle', (req, res) => {
  const { propertyId } = req.body
  const userId = req.userId

  // Check if it already exists
  const checkSql = `SELECT id FROM wishlist WHERE userId = ? AND propertyId = ?`
  pool.query(checkSql, [userId, propertyId], (err, data) => {
    if (err) {
      res.send(result.createResult(err, null))
    } else {
      if (data.length > 0) {
        // Exists, remove it
        const deleteSql = `DELETE FROM wishlist WHERE userId = ? AND propertyId = ?`
        pool.query(deleteSql, [userId, propertyId], (err2, data2) => {
           res.send(result.createResult(err2, { status: 'removed' }))
        })
      } else {
        // Doesn't exist, add it
        const insertSql = `INSERT INTO wishlist (userId, propertyId) VALUES (?, ?)`
        pool.query(insertSql, [userId, propertyId], (err2, data2) => {
           res.send(result.createResult(err2, { status: 'added' }))
        })
      }
    }
  })
})

// get wishlist for user
router.get('/', (req, res) => {
  const userId = req.userId
  const sql = `
    SELECT p.id, p.title, p.details, p.rent, p.profileImage, p.beds, p.bathrooms 
    FROM property p
    JOIN wishlist w ON p.id = w.propertyId
    WHERE w.userId = ?
  `
  pool.query(sql, [userId], (err, data) => {
    res.send(result.createResult(err, data))
  })
})

// get wishlist ids for user (useful for frontend to know which are favorited)
router.get('/ids', (req, res) => {
  const userId = req.userId
  const sql = `SELECT propertyId FROM wishlist WHERE userId = ?`
  pool.query(sql, [userId], (err, data) => {
    res.send(result.createResult(err, data.map(item => item.propertyId)))
  })
})

module.exports = router
