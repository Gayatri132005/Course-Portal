const express = require('express');
const cors = require('cors'); // ✅ Import cors
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');

const app = express();
const router = express.Router();

// ✅ Use CORS
app.use(cors()); // You can configure it too if needed

// File upload middleware
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect('mongodb+srv://gayatrikotwal13:gayatrikotwal13@cluster0.yikfgic.mongodb.net/collabDB')
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

// Catch-all 404
app.use((req, res) => {
  res.status(404).json({ msg: 'Route not found' });
});

module.exports = app;
