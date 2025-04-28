const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const User = require("../model/User");
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// SIGNUP route
router.post('/signup', (req, res) => {
  User.find({ email: req.body.email })
    .then(users => {
      if (users.length > 0) {
        return res.status(400).json({ error: 'Email already registered.' });
      }

      cloudinary.uploader.upload(req.files.image.tempFilePath, (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Image upload failed.' });
        }

        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({ error: err });
          }

          const newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone,
            password: hash,
            imageUrl: result.secure_url,
            imageId: result.public_id
          });

          newUser.save()
            .then(result => {
              res.status(201).json({ message: 'User created successfully!', user: result });
            })
            .catch(err => {
              console.error(err);
              res.status(500).json({ error: err });
            });
        });
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Signup failed due to server error.' });
    });
});

// LOGIN route
router.post('/login', (req, res) => {
  User.find({ email: req.body.email })
    .then(users => {
      if (users.length === 0) {
        return res.status(404).json({ msg: "Email not registered." });
      }

      const user = users[0];
      bcrypt.compare(String(req.body.password), String(user.password), (err, result) => {
        if (!result) {
          return res.status(401).json({ error: "Password does not match." });
        }

        const token = jwt.sign({
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          uId: user._id
        }, 'sbs online classes 123', { expiresIn: '365d' });

        res.status(200).json({
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          imageUrl: user.imageUrl,
          imageId: user.imageId,
          token: token
        });
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Login failed due to server error.' });
    });
});

module.exports = router;
