const express = require('express')
const cors = require('cors')

//user defined modules
const authorization = require('./routes/authorization')
const bookingRouter = require('./routes/booking')
const categoryRouter = require('./routes/category')
const propertyRouter = require('./routes/property')
const reviewRouter = require('./routes/review')
const userRouter = require('./routes/user')
const wishlistRouter = require('./routes/wishlist')
const adminRouter = require('./routes/admin')
const adminMiddleware = require('./middlewares/adminMiddleware')

//creating the express object
const app = express()

//add the middlewares
app.use(cors())
app.use(express.static('images'))
app.use(express.json())
app.use(authorization)

app.use('/booking', bookingRouter)
app.use('/category', categoryRouter)
app.use('/property', propertyRouter)
app.use('/review', reviewRouter)
app.use('/user', userRouter)
app.use('/wishlist', wishlistRouter)
app.use('/admin', adminMiddleware, adminRouter)

//startig the server at port 4000
app.listen(4000, 'localhost', () => {
  console.log('server started at port 4000')
})
