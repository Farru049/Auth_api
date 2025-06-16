//Import all the dependencies
require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const upload = require("./utils/cloudinary");

//app initialization
const app = express();
app.use(express.json());
app.use(cors());

//Database Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

//Defining the Schema
const UserSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

//jsonweb secretkey
const JWT_KEY = process.env.JWT_KEY || "SECRET_KEY_DEV";

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    const file = req.file;

    res.status(200).json({
      message: "File uploaded successfully",
      url: file.path,
      filename: file.originalname,
      uploadedBy: decoded.userId,
    });
  } catch (err) {
    res.status(400).json({ message: "Upload failed", error: err.message });
  }
});

//Signup Route->POST(REST API) because we are creating  new data
app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedpassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedpassword });
    await user.save();
    const token = jwt.sign({ userId: user._id }, JWT_KEY, { expiresIn: "4h" });
    res.status(201).json({ message: "User Created Successfully", token });
  } catch (error) {
    res.status(400).json({ message: "User Already Exists or invalid data" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ error: "User not found" });

  const isPassword = await bcrypt.compare(password, user.password);

  if (!isPassword)
    return res.status(401).json({ message: "Incorrect password" });

  const token = jwt.sign({ userId: user._id }, JWT_KEY, { expiresIn: "4h" });
  res.json({ token });
});

app.get("/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, JWT_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    res.json({ message: `Welcom, user ${decoded.userId}` });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
