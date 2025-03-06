import cloudinary from 'cloudinary';
const options = {
  port: process.env.PORT,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // Replace with your Cloud name
  api_key: process.env.CLOUDINARY_API_KEY,      // Replace with your API key
  api_secret: process.env.CLOUDINARY_API_SECRET  // Replace with your API secret
}
console.log("options------>", options)
cloudinary.v2.config(options);

export default cloudinary;
