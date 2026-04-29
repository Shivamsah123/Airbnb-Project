const express = require('express')
const cryptoJs = require('crypto-js')
const jwt = require('jsonwebtoken')

const pool = require('../db/db')
const result = require('../utils/result')
const config = require('../utils/config')

const router = express.Router()

router.post('/register', (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body
  const encryptedPassword = String(cryptoJs.SHA256(password))
  const sql = `INSERT INTO user(firstName, lastName, email, password, phoneNumber) VALUES(?,?,?,?,?)`
  pool.query(
    sql,
    [firstName, lastName, email, encryptedPassword, phone],
    (error, data) => {
      res.send(result.createResult(error, data))
    }
  )
})

router.post('/login', (req, res) => {
  const { email, password } = req.body
  const encryptedPassword = String(cryptoJs.SHA256(password))
  const sql = `SELECT * FROM user WHERE email = ? AND password = ?`
  pool.query(sql, [email, encryptedPassword], (error, data) => {
    if (data) {
      if (data.length != 0) {
        const payload = {
          userId: data[0].id,
          role: data[0].role
        }
        const token = jwt.sign(payload, config.secret)
        const body = {
          token: token,
          firstName: data[0].firstName,
          lastName: data[0].lastName,
          role: data[0].role
        }
        res.send(result.createSuccessResult(body))
      } else res.send(result.createErrorResult('Invalid email or password'))
    } else res.send(result.createErrorResult(error))
  })
})

router.get('/profile', (req, res) => {
  const sql = `SELECT firstName, lastName, phoneNumber, email FROM user WHERE id = ?`
  pool.query(sql, [req.headers.userId], (error, data) => {
    res.send(result.createResult(error, data))
  })
})

router.put('/profile', (req, res) => {
  const { firstName, lastName, phone } = req.body
  const sql = `UPDATE user SET firstName=?, lastName=?, phoneNumber=? WHERE id = ?`
  pool.query(
    sql,
    [firstName, lastName, phone, req.headers.userId],
    (error, data) => {
      res.send(result.createResult(error, data))
    }
  )
})
module.exports = router
