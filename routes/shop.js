const express = require('express');
const router = express.Router();
const Exam = require('../models/exam');

// --- Show all exams ---
router.get('/all-exams', async (req, res) => {
  try {
    const exams = await Exam.find().sort({ createdAt: -1 }); // latest first
    res.render('all-exams', { exams }); // render EJS page
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
