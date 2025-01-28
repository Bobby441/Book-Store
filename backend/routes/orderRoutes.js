import express from 'express'
import { allOrders, placeOrder, placeOrderStripe, updateStatus, userOrders, verifyStripe } from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authuser from '../middleware/auth.js'

const orderRouter = express.Router()

// for admin
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

// for payments
orderRouter.post('/place', authuser, placeOrder)
orderRouter.post('/stripe', authuser, placeOrderStripe)

// verify payment
orderRouter.post('/verifystripe', authuser, verifyStripe)

// for user
orderRouter.post('/userorders', authuser, userOrders)

export default orderRouter
