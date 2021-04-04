
const cloudinary = require('cloudinary').v2
require("dotenv").config();


cloudinary.config({
    cloud_name: "dlx751s5y",
    api_key: "735787691426762",
    api_secret: "z2ffaUFewKDafzY27lH-FBbp26Q"
})

export default cloudinary;