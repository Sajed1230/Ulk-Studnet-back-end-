require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const adminRouter = require("./routes/admin");
const adminShop = require("./routes/shop");
const userRouter = require("./routes/user");
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
app.set('view engine', 'ejs');
app.set('views','views');

/////////////////////////////////=============================///////////////////////////////
app.use("/user", userRouter);

app.use("/admin", adminRouter);
app.use("/shop", adminShop);











//================================================================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));
//================================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
