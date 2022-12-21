const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name:process.env.COULD_NAME,
    api_key:process.env.COULD_API_KEY,
    api_secret:process.env.COULD_SECRET,

})
console.log(process.env.COULD_NAME,process.env.COULD_API_KEY,process.env.COULD_SECRET)
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder:'Camp',
        allowedFormats:['jpg','jpeg','png','bmp'],
    }
});

module.exports = {
    cloudinary,
    storage
}