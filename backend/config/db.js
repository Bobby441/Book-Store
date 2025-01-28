import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

const mongo_url = process.env.MONGO_URI
const connectDB = async() => {
  try {
      await mongoose.connect(mongo_url)
      console.log('Database connected')
    
  } catch (error) {
    console.log('Database connection failed', error)
  }
}

export default connectDB