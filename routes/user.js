const express=require('express')
const router=express.Router()
const Exam=require('../models/exam')

router.get("/api/exams", async (req, res) => {
  try {
    console.log("📩 Received request query:", req.query);

    const { track, major, year, search, type } = req.query;

    const query = {};
    if (track) query.track = new RegExp(`^${track}$`, "i"); // case-insensitive
    if (major) query.major = major;
    if (year) query.year = parseInt(year);

    console.log("🔍 MongoDB query object:", query);

    let exams = await Exam.find(query);
    console.log(`✅ Fetched ${exams.length} exams from DB`);

    if (search && search.trim() !== "") {
      const regex = new RegExp(search, "i");
      exams = exams.filter(
        (exam) =>
          regex.test(exam.name) ||
          regex.test(exam.typeExam) ||
          regex.test(exam.description || "")
      );
      console.log(`🔎 Exams after search filter: ${exams.length}`);
    }

    if (type && type.trim() !== "" && type.toLowerCase() !== "all") {
      exams = exams.filter(
        (exam) => exam.typeExam.toLowerCase() === type.toLowerCase()
      );
      console.log(`🎯 Exams after type filter: ${exams.length}`);
    }

    console.log("📤 Sending exams to frontend:", exams);
    res.json(exams);
    console.log(exams)
  } catch (err) {
    console.error("❌ Error fetching exams:", err);
    res.status(500).send("Error fetching exams");
  }
});

//=======================================
router.get('/download-exam/:id', async (req, res) => {
  const exam = await Exam.findById(req.params.id);
  if (!exam) return res.status(404).send("Exam not found");

  // redirect to Cloudinary raw URL but force download
  res.redirect(`${exam.pdfPath}?fl_attachment=true&filename=${encodeURIComponent(exam.name)}.pdf`);
});
module.exports=router