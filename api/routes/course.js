const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const Course = require('../model/Course');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const cloudinary = require('cloudinary').v2;
 const  fee=require('../model/Fee')
const Student = require('../model/Student');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

router.post('/add-course', checkAuth, (req, res) => {

    console.log("FILES: ", req.files);

    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, 'sbs online classes 123');


    cloudinary.uploader.upload(req.files.image.tempFilePath, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Image upload failed' });
        }

        const newCourse = new Course({
            _id: new mongoose.Types.ObjectId(),
            courseName: req.body.courseName,
            price: req.body.price,

            description: req.body.description,
            startingDate: req.body.startingDate,
            endDate: req.body.endDate,
            uId: verify.uId,
            imageUrl: result.secure_url,
            imageId: result.public_id
        });


        newCourse.save()
            .then(result => {
                res.status(200).json({
                    newCourse: result
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });

    });

});






router.get('/all-courses', checkAuth, (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, 'sbs online classes 123');

    Course.find({ uId: verify.uId })
        .select('_id uId courseName description price startingDate endDate imageUrl imageId') // ✅ spaces, not commas
        .then(result => {
            res.status(200).json({
                courses: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});



router.get('/course-detail/:id', checkAuth, (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, 'sbs online classes 123');

    Course.findById(req.params.id)
        .select('_id uId courseName description price startingDate endDate imageUrl imageId') // ✅ spaces, not commas
        .then(result => {
            Student.find({ courseId: req.params.id })
                .then(students => {
                    res.status(200).json({
                        courses: result,
                        studentsList: students
                    })

                });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});




router.delete('/:id', checkAuth, (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, 'sbs online classes 123');

    Course.findById(req.params.id)
        .then(course => {
            console.log("Course from DB:", course);

            if (!course) {
                return res.status(404).json({ msg: "Course not found" });
            }

            if (String(course.uId) === String(verify.uId)) {
                Course.findByIdAndDelete(req.params.id)
                    .then(result => {
                        cloudinary.uploader.destroy(course.imageId, (error, deleteImage) => {

                            Student.deleteMany({ courseId: req.params.id })


                                .then(data => {
                                    res.status(200).json({
                                        msg: "Course and image deleted successfully",
                                        result: data
                                    });
                                })
                                .catch(err => {
                                    res.status(500).json({
                                        msg: err
                                    });
                                });
                        });
                    })


            } else {
                res.status(403).json({
                    msg: "Bad request: Unauthorized user"
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                msg: "Server error",
                error: err.message
            });
        });
});


router.put('/:id', checkAuth, (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, 'sbs online classes 123');
    console.log(verify.uId);


    Course.findById(req.params.id)
        .then(course => {
            if (verify.uId != course.uId) {
                return res.status(500).json({
                    error: "you are not eligible to update  this date "
                })

            }

            if (req.files) {


                cloudinary.uploader.destroy(course.imageId, (error, deleteImage) => {
                    cloudinary.uploader.upload(req.files.image.tempFilePath, (err, result) => {

                        const newUpdatedCourse = {

                            courseName: req.body.courseName,
                            price: req.body.price,
                            description: req.body.description,
                            startingDate: req.body.startingDate,
                            endDate: req.body.endDate,
                            uId: verify.uId,
                            imageUrl: result.secure_url,
                            imageId: result.public_id
                        }
                        Course.findByIdAndUpdate(req.params.id, newUpdatedCourse, { new: true })
                            .then(data => {
                                res.status(200).json({
                                    updateCourse: data
                                })
                            })

                            .catch(err => {
                                console.log(err)
                                res.status(500).json({
                                    error: err
                                })
                            })



                    });

                })

            }
            else {
                const updatedData = {
                    courseName: req.body.courseName,
                    price: req.body.price,
                    description: req.body.description,
                    startingDate: req.body.startingDate,
                    endDate: req.body.endDate,
                    uId: verify.uId,
                    imageUrl: course.imageUrl,
                    imageId: course.imageId
                }

                Course.findByIdAndUpdate(req.params.id, updatedData, { new: true })
                    .then(data => {
                        res.status(200).json({
                            updateData: data
                        })

                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        })
                    })

            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})



// get latest  5  courses  data 

router.get('/latest-student', checkAuth, (req, rees) => {
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, 'sbs online classes 123');

    Course.find({ uId: verify.uId })
        .sort({ $natural: -1 }).limit(5)
        .then(result => {
            res.status(200).json({
                courses: result
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});





//home


router.get('/home', checkAuth, async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const verify = jwt.verify(token, 'sbs online classes 123');

        // Correct query for limiting results to 5
        const newFees = await fee.find({ uId: verify.uId }).sort({ $natural: -1 }).limit(5);
        const newStudents = await Student.find({ uId: verify.uId }).sort({ $natural: -1 }).limit(5);
        const totalCourse = await Course.countDocuments({ uId: verify.uId });
        const totalStudent = await Student.countDocuments({ uId: verify.uId });
         const totalAmount=await  fee.aggregate([
            {$match:{uId:verify.uId}},
            {$group:{_id:null,total:{$sum:"$amount"}}}
         ])

         res.status(200).json({
            fees: newFees,
            students: newStudents,
            courses: totalCourse, // <-- Add this
            totalCourse: totalCourse,
            totalStudent: totalStudent,
            totalAmount: totalAmount.length > 0 ? totalAmount[0].total : 0
        });
        
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
});



module.exports = router;

