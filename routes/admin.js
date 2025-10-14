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
    const { name, track, major, year, typeExam } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required!" });
    }

    // Trim values to prevent mismatch due to extra spaces
    const trimmedName = name.trim();
    const trimmedTrack = track.trim();
    const trimmedMajor = major.trim();
    const trimmedYear = year.trim();
    const trimmedTypeExam = typeExam.trim();

    // ===== Check if exam already exists =====
    const existingExam = await Exam.findOne({
      name: trimmedName,
      track: trimmedTrack,
      major: trimmedMajor,
      year: trimmedYear,
      typeExam: trimmedTypeExam,
    });

    if (existingExam) {
      // Exam exists → stop upload
      return res.status(400).json({ message: "Exam already exists!" });
    }

    // ===== Upload exam =====
    const pdfUrl = req.file.path; // Cloudinary URL (raw)
    const downloadUrl = `${pdfUrl}?fl_attachment=true&filename=${encodeURIComponent(trimmedName)}.pdf`;

    const newExam = new Exam({
      name: trimmedName,
      track: trimmedTrack,
      major: trimmedMajor,
      year: trimmedYear,
      typeExam: trimmedTypeExam,
      pdfPath: downloadUrl,
    });

    await newExam.save();
    res.redirect('/shop/all-exams');

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload exam", error: err.message });
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