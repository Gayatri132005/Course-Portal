const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const Student = require('../model/Student');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const cloudinary = require('cloudinary').v2;
const Fee = require('../model/Fee');
const Course=require('../model/Course')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
router.post('/add-student', checkAuth, (req, res) => {

    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, 'sbs online classes 123');


    cloudinary.uploader.upload(req.files.image.tempFilePath, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Image upload failed' });
        }

        const newStudent = new Student({
            _id: new mongoose.Types.ObjectId(),
            fullName: req.body.fullName,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address,
            courseId: req.body.courseId,
            uId: verify.uId,
            imageUrl: result.secure_url,
            imageId: result.public_id
        });

        newStudent.save() 
            .then(result => {
                res.status(200).json({
                    newStudent: result
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

// get all   student 
router.get('/all-students', checkAuth, (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, 'sbs online classes 123');

    Student.find({ uId: verify.uId })
        .select('_id uId fullName address email phone courseId  imageUrl imageId') // ✅ spaces, not commas
        .then(result => {
            res.status(200).json({
                students: result  // ✅ fixed typo here
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

// get  all student for a course
router.get('/all-students/:courseId', checkAuth, (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, 'sbs online classes 123');

    Student.find({ uId: verify.uId, courseId: req.params.courseId })
        .select('_id uId fullName address email phone courseId  imageUrl imageId') // ✅ spaces, not commas
        .then(result => {
            res.status(200).json({
                students: result  // ✅ fixed typo here
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

    Student.findById(req.params.id)
        .then(student => {
            console.log("Course from DB:", student);

            if (!student) {
                return res.status(404).json({ msg: "Course not found" });
            }

            if (String(student.uId) === String(verify.uId)) {
                Student.findByIdAndDelete(req.params.id)
                    .then(result => {
                        cloudinary.uploader.destroy(student.imageId, (error, deleteImage) => {
                            if (error) {
                                console.log("Cloudinary delete error:", error);
                                return res.status(500).json({ msg: "Image deletion failed", error });
                            }

                            res.status(200).json({
                                msg: "  student and image deleted successfully",
                                result: result
                            });
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            msg: err
                        });
                    });

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

//update 
router.put('/:id', checkAuth, (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, 'sbs online classes 123');
    console.log(verify.uId);

    Student.findById(req.params.id)
        .then(student => {
            if (verify.uId != student.uId) {
                return res.status(500).json({
                    error: "you are not eligible to update  this date "
                })

            }

            if (req.files) {
                cloudinary.uploader.destroy(student.imageId, (error, deleteImage) => {
                    cloudinary.uploader.upload(req.files.image.tempFilePath, (err, result) => {
                        const newUpdatedStudent = {

                          
                            fullName: req.body.fullName,
                            phone: req.body.phone,
                            email: req.body.email,
                            address: req.body.address,
                            courseId: req.body.courseId,
                            uId: verify.uId,
                            imageUrl: result.secure_url,
                            imageId: result.public_id
                        }
                        Student.findByIdAndUpdate(req.params.id, newUpdatedStudent, { new: true })
                            .then(data => {
                                res.status(200).json({
                                    updateStudent: data
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
                    fullName: req.body.fullName,
                    phone: req.body.phone,
                    email: req.body.email,
                    address: req.body.address,
                    courseId: req.body.courseId,
                    uId: verify.uId,
                    imageUrl: student.imageUrl,
                    imageId:student.imageId
                }

                Student.findByIdAndUpdate(req.params.id, updatedData, { new: true })
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


//  get  latest 5 student data 

router.get("/latest-students",checkAuth,(req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, 'sbs online classes 123');

    Student.find({uId:verify.uId})
    .sort({$natural:-1}).limit(5)
    .then(result=>{
         res.status(200).json({
            students:result
         })
      
    })
     .catch(err=>{
        res.status.status(500).json({
            error:err
        })
     })

})
 


 //get student by id 

 router.get('/student-detail/:id', checkAuth, (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, 'sbs online classes 123');

     Student.findById(req.params.id)
     .select('_id uId fullName address email phone courseId  imageUrl imageId') // ✅ spaces, not commas
     .then(result => {

        Fee.find({uId:verify.uId,courseId:result.courseId,phone:result.phone})
        .then(feeData=>{
            Course.findById(result.courseId)
            .then(courseDetail=>{
                res.status(200).json({
                    studentDetail:result,
                    feeDetail:feeData,
                     courseDetail:courseDetail
                })

            }) .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err

            })
           
        })
       
       
        })
    })
     .catch(err => {
         res.status(500).json({
             error: err
         });
     });
});



module.exports = router;
 