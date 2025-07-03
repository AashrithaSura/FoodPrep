const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  cdn_subdomain: true, 
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    format: 'webp', 
    transformation: [
      {
        width: 500,
        height: 500,
        crop: 'fill',
        quality: 'auto',
        fetch_format: 'auto',
        dpr: 'auto' 
      }
    ],
    overwrite: false,
    resource_type: 'auto',
    use_filename: true, 
    unique_filename: false,
    type: 'upload',
    invalidate: true 
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/^image\/(jpe?g|png|webp)$/i)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
}).single('image');

const handleUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ 
          success: false,
          message: err.message 
        });
      } else {
        return res.status(500).json({ 
          success: false,
          message: 'File upload failed' 
        });
      }
    }
    next();
  });
};

module.exports = { 
  cloudinary, 
  storage,
  handleUpload 
};