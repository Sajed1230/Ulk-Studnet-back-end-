const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    name: { type: String, required: true },
    track: { type: String, enum: ['CSSE', 'SS'], required: true },
    major: { type: String, required: true },
    year: { type: Number, required: true, min: 1, max: 4 },
    typeExam: { type: String, enum: ['Cat 11', 'Fat', 'Quiz'], required: true },
    pdfPath: { type: String, required: true } // Cloudinary URL
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
