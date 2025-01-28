import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

import connectDB from './config/db.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoutes.js'
import productRouter from './routes/productRoutes.js'
import cartRouter from './routes/cartRoutes.js'
import orderRouter from './routes/orderRoutes.js'


// App configuration
const app = express()
const port = process.env.PORT || 4000

// middleware
app.use(express.json())

app.use(cors({
  origin: process.env.FRONTEND_URL, // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],    // Allowed HTTP methods
  credentials: true,                            // If you need cookies or authorization headers
}));

connectDB()
connectCloudinary()

// API endpoints
app.get('/', (req, res) => {
  res.send('API Successfully connected')
})


// user routes end point
app.use('/api/user', userRouter)

// product routes end point
app.use('/api/product', productRouter)

// cart routes end points
app.use('/api/cart',cartRouter)

// order routes endpoint
app.use('/api/order', orderRouter)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})