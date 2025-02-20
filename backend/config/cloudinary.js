import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

const connectCloudinary = async() => {
  cloudinary.config({
    cloud_name: process.env.CLDNRY_NAME,
    api_key: process.env.CLDNRY_API_KEY,
    api_secret: process.env.CLDNRY_API_SECRET,
  })
}

export default connectCloudinary