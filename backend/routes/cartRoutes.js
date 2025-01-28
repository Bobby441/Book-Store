import express from 'express'
import { addCart, getUserCart, updateCart } from '../controllers/cartController.js'
import authuser from '../middleware/auth.js'

const cartRouter = express.Router()

cartRouter.post('/add', authuser, addCart)
cartRouter.post('/update', authuser, updateCart)
cartRouter.post('/get', authuser, getUserCart)

export default cartRouter