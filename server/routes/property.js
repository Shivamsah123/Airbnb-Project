const express = require('express')
const pool = require('../db/db')
const result = require('../utils/result')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'images' })
const adminMiddleware = require('../middlewares/adminMiddleware')

router.post('/', adminMiddleware, upload.single('photo'), (req, res) => {
  const {
    categoryId,
    title,
    details,
    address,
    contactNo,
    ownerName,
    isLakeView,
    isTV,
    isAC,
    isWifi,
    isMiniBar,
    isBreakfast,
    isParking,
    guests,
    bedrooms,
    beds,
    bathrooms,
    rent,
  } = req.body

  console.log(req.body)

  const sql = `
    INSERT INTO property (
        categoryId, title,details, address, contactNo, ownerName, isLakeView,
        isTV, isAC, isWifi, isMiniBar, isBreakfast, isParking, guests,
        bedrooms, beds, bathrooms, rent, profileImage, userId
    ) VALUES (
        ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, ?
    )`

  pool.query(
    sql,
    [
      categoryId,
      title,
      details,
      address,
      contactNo,
      ownerName,
      isLakeView,
      isTV,
      isAC,
      isWifi,
      isMiniBar,
      isBreakfast,
      isParking,
      guests,
      bedrooms,
      beds,
      bathrooms,
      rent,
      req.file.filename,
      req.userId,
    ],
    (error, data) => {
      console.log(error)
      res.send(result.createResult(error, data))
    }
  )
})

router.get('/', (req, res) => {
  const { search } = req.query
  let sql = `SELECT id,title,details,rent,profileImage, beds, bathrooms FROM property`
  const params = []
  
  if (search && search.trim() !== '') {
    sql += ` WHERE title LIKE ? OR details LIKE ? OR address LIKE ?`
    params.push(`%${search}%`, `%${search}%`, `%${search}%`)
  }
  
  pool.query(sql, params, (error, data) => {
    res.send(result.createResult(error, data))
  })
})

router.get('/details/:id', (request, res) => {
  const { id } = request.params

  const sql = `SELECT * FROM property where id = ?`
  pool.query(sql, [id], (error, data) => {
    res.send(result.createResult(error, data))
  })
})

router.delete('/:id', (req, res) => {
  const { id } = req.params
  console.log(`id = ${id}`)

  const sql = `DELETE FROM property where id = ?`
  pool.query(sql, [id], (error, data) => {
    res.send(result.createResult(error, data))
  })
})

module.exports = router
