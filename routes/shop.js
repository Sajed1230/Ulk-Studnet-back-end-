const express = require('express');
const router = express.Router();
const Exam = require('../models/exam');

// --- Show all exams ---
router.get('/all-exams', async (req, res) => {
  try {
    const { name, typeExam } = req.query;

    const filter = {};

    if (name) filter.name = { $regex: name, $options: 'i' }; // case-insensitive search
    if (typeExam) filter.typeExam = typeExam;

    const exams = await Exam.find(filter).sort({ createdAt: -1 });
    res.render('all-exams', { exams, name, typeExam });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});




module.exports = router;
