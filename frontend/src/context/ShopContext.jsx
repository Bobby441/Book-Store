import { createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

export const ShopContext = createContext()

const ShopContextProvider = (props) => {

  const currency = '$'
  const delivery_charges = 5
  const backend_url = import.meta.env.VITE_BACKEND_URL
  const [books, setBooks] = useState([])
  const navigate = useNavigate()
  const [token, setToken] = useState('')
  const [cartItems, setCartItems] = useState({})

  // adding items to cart
  const addToCart = async (itemId) => {
    const cartData = {...cartItems} // use shallow copy

    if(cartData[itemId]) {
      cartData[itemId] += 1
    } else {
      cartData[itemId] = 1
    }
    setCartItems(cartData)
    if(token) {
      try {
        await axios.post(backend_url+'/api/cart/add', {itemId}, {headers: {token}})
        
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
    }
  }

  // getting total cart items
  const getCartCount = () => {
    let totalCount = 0
    for(const item in cartItems) {
      try {
        if(cartItems[item] > 0) {
          totalCount += cartItems[item]
        }
        
      } catch (error) {
        console.log(error)
      }
    }
    return totalCount
  }

  // getting total cart amount
  const getCartAmount = () => {
    let totalAmount = 0
    for(const item in cartItems) {
      if(cartItems[item] > 0) {
        let itemInfo = books.find((book) => book._id === item)
        if(itemInfo) {
          totalAmount += itemInfo.price * cartItems[item]
        }
      }
    }
    return totalAmount
  }

  // updating the quantity
  const updateQuantity = async (itemId, quantity) => {
    const cartData = {...cartItems}
    cartData[itemId] = quantity
    setCartItems(cartData)
    if(token) {
      try {
        await axios.post(backend_url+'/api/cart/update', {itemId, quantity}, {headers: {token}})
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
    }
  }

  //getting the products data
  const getProductsData = async() => {
    try {
      const response = await axios.get(backend_url+'/api/product/list')
      //console.log(response.data)
      if(response.data.success) {
        setBooks(response.data.products)
      } else {
        toast.error(response.data.message)
      }
      
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } 
  }

  //getting usercart data
  const getUserCart = async(token) => {
    try {
      const response = await axios.post(backend_url+'/api/cart/get', {}, {headers: {token}})
      if(response.data.success) {
        setCartItems(response.data.cartData)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if(!token && localStorage.getItem('token')) {
      setToken(localStorage.getItem('token')) // prevent logout upon reload the page
      getUserCart(localStorage.getItem('token'))
    }
    getProductsData()
  }, [])

  const contextValue = {books, currency, navigate, token, setToken, setCartItems, cartItems, addToCart, getCartCount, getCartAmount, updateQuantity, delivery_charges, backend_url}

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  )
}

export default ShopContextProvider