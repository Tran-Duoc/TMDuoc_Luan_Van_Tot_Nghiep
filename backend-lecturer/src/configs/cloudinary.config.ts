import { v2 as cloudinary } from 'cloudinary'

const CLOUD_NAME = process.env.CLOUDINARY_NAME
const API_KEY = process.env.CLOUDINARY_API_KEY
const API_SECRET = process.env.CLOUDINARY_API_SECRET

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET
})

export default cloudinary
