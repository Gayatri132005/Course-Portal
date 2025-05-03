require('dotenv').config(); // ✅ Add this at the top

const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');

const app = express();

// ✅ Use CORS
app.use(cors());

// File upload middleware
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Use Mongo URI from .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error('❌ Database connection error:', err));

// Routes
const userRoute = require('./routes/user');
const courseRoute = require('./routes/course');
const studentRoute = require('./routes/student');
const feeRoute = require('./routes/fee');

app.use('/user', userRoute);
app.use('/course', courseRoute);
app.use('/student', studentRoute);
app.use('/fee', feeRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ msg: 'Route not found' });
});

module.exports = app;
