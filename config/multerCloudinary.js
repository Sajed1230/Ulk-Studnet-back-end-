const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// --- Cloudinary Config ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- Cloudinary Storage for PDF ---
const pdfStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    
    folder: 'exams',
    resource_type: 'raw',        // Must be 'raw' for PDFs
    allowed_formats: ['pdf'],
    format: 'pdf',               // 👈 Ensures .pdf extension in URL
    
  }),
});


const upload = multer({ storage: pdfStorage });

module.exports = upload;
