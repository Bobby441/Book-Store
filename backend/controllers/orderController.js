import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import Stripe from 'stripe'

// global variables for payment
const currency = 'inr'
const deliveryCharges = 50

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Stripe API key is missing in environment variables');
}

// stripe gateway initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


// place order using COD
const placeOrder = async(req, res) => {
  try {
    const {userId, items, amount, address} = req.body
    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: 'COD',
      payment: false,
      date: Date.now()
    }

    const newOrder = new orderModel(orderData)
    await newOrder.save()

    await userModel.findByIdAndUpdate(userId, {cartData: {}})
    res.json({
      success: true,
      message: 'Order Placed'
    })
    
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: error.message
    })
  }
}

// place order using Stripe payment method
const placeOrderStripe = async(req, res) => {
  try {
    const {userId, items, amount, address} = req.body
    const { origin } = req.headers
    
    
    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: 'Stripe',
      payment: false,
      date: Date.now()
    }

    const newOrder = new orderModel(orderData)
    await newOrder.save()

    const line_items = items.map(item => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name
        },
        unit_amount: item.price * 100  // need to check
      },
      quantity: item.quantity
    }))

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: 'delivery Charges'
        },
        unit_amount: deliveryCharges * 100 * 86 // need to check
      },
      quantity: 1
    })

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: 'payment'
    })
    res.json({
      success: true,
      session_url: session.url
    })
    
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: error.message
    })
  }
}

// verify stripe methos
const verifyStripe = async(req, res) => {
  const {orderId, success, userId} = req.body
  try {
    if(success === 'true') {
      await orderModel.findByIdAndUpdate(orderId, {payment: true})
      await userModel.findByIdAndUpdate(userId, {cartData: {}})
      res.json({
        success: true
      })
    } else {
      await orderModel.findByIdAndDelete(orderId)
      res.json({
        success: false,
      })
    }
    
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: error.message
    })
  }
}

// All orders data for admin panel
const allOrders = async(req, res) => {
  try {
    const orders = await orderModel.find({})
    res.json({
      success: true,
      orders
    })
    
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: error.message
    })
  }
}

// All orders data for User
const userOrders = async(req, res) => {
  try {
    const {userId} = req.body
    const orders = await orderModel.find({userId})
    res.json({
      success: true,
      orders 
    })
    
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: error.message
    })
  }
}

// Updating order status for admin panel
const updateStatus = async(req, res) => {
  try {
    const {orderId, status} = req.body
    await orderModel.findByIdAndUpdate(orderId, {status})
    res.json({
      success: true,
      message: 'Status Updated'
    })
    
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: error.message
    })
  }
}

export { placeOrder, placeOrderStripe, allOrders, userOrders, verifyStripe, updateStatus}