const express=require("express");
const upload = require("../config/multerCloudinary");
const Exam = require("../models/exam");
const router=express.Router()

router.get("/add-exam",(req,res)=>{
res.render("add-exam")
})
//=================================================================


//=====///////////////////////////////======================================================

router.get('/add-exam', (req, res) => {
  res.render('add-exam');
});

//=====///////////////////////////////======================================================

// Add exam route
router.post('/add-exam', upload.single('pdfExam'), async (req, res) => {
  try {
    const { name, year, typeExam, track, major } = req.body;

    if (!req.file || !req.file.path) {
      return res.status(400).send('PDF is required.');
    }

    // ✅ Check if the exam already exists (same name, year, typeExam, track, and major)
    const existingExam = await Exam.findOne({ name, year, typeExam, track, major });

    if (existingExam) {
      // Exam already exists
      return res.status(400).send('❌ Exam already exists with the same details.');
    }

    // ✅ If not exist, add new exam
    const pdfPath = req.file.path;
    const publicId = req.file.filename;

    const newExam = new Exam({ name, year, typeExam, track, major, pdfPath, publicId });
    await newExam.save();

    res.redirect('/shop/all-exams');
  } catch (err) {
    console.error('Error adding exam:', err);
    res.status(500).send('Server error: ' + err.message);
  }
});


//======================================================

router.post("/delete/:id", async (req, res) => {
    const examId = req.params.id;

    try {
        // Find the exam
        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).send("Exam not found");
        }


        await Exam.findByIdAndDelete(examId);


        res.redirect("/shop/all-exams"); // adjust URL as per your route
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});
///==================================================================
///==================================================================
router.get('/edit/:id', async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).send('Exam not found');
    }
    res.render('edit-exam', { exam });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// POST Edit Exam
router.post('/edit-exam/:id', upload.single('pdfExam'), async (req, res) => {
  try {
    const { name, year, typeExam, track, major } = req.body;
    const updateData = { name, year, typeExam, track, major };

    // If new PDF uploaded, update the path
    if (req.file && req.file.path) {
      updateData.pdfPath = req.file.path;
    }

    await Exam.findByIdAndUpdate(req.params.id, updateData);
    res.redirect('/shop/all-exams'); // redirect to list page
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});


module.exports=router