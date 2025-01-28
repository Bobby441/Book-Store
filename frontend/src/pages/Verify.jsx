import { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const Verify = () => {

  const {navigate, token, setCartItems, backend_url} = useContext(ShopContext)
  const [searchParams, setSearchParams] = useSearchParams()

  const success = searchParams.get('success')
  const orderId = searchParams.get('orderId')

  // verify payment( test mode)
  const verifyPayment = async() => {
    try {
      if(!token) {
        return null
      }
      const response = await axios.post(backend_url+'/api/order/verifystripe', {success, orderId}, {headers: {token}})
      console.log(response.data)
      if(response.data.success) {
        setCartItems({})
        navigate('/orders')
      } else {
        navigate('/')
      }
      
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    verifyPayment()
  }, [token])

  return (
    <div>Verify</div>
  )
}

export default Verify