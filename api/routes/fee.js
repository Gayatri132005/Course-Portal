const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const Fee=require("../model/Fee");
const mongoose=require("mongoose");
const checkAuth = require('../middleware/checkAuth');

router.post('/add-fee',checkAuth, (req, res) => {
   
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, 'sbs online classes 123');
  
    const newFee = new Fee({
        _id: new mongoose.Types.ObjectId(),
        fullName: req.body.fullName,
        phone: req.body.phone,
        courseId: req.body.courseId,
        uId: verify.uId,
        amount: req.body.amount,
        remark: req.body.remark,
    });

      newFee.save()
      .then(result=>{
        res.status(200).json({
            newFee:result
        })
      })
      .catch(err=>{
        res.status(500).json({
            error:err
        })
      })
});

//  get all collection  data for any user 

 router.get("/payment-history",checkAuth,(req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, 'sbs online classes 123');

      Fee.find({uId:verify.uId})
      .then(result=>{
        res.status(200).json({
            paymentHistory:result
        })
      })
       .catch(err=>{
        res.status(500).json({
            error:err

        })
       })
    });
//get all  payment  for  any  student  in a course



router.get('/all-payment',checkAuth,(req,res)=>{
  console.log(req.query)
  
  const token = req.headers.authorization.split(" ")[1];
  const verify = jwt.verify(token, 'sbs online classes 123');
   Fee.find({uId:verify.uId,courseId:req.query.courseId,phone:req.query.phone})
   .then(result=>{
    res.status(500).json({
      fees:result
    })
   })
   .catch(err=>{
     res.status.apply(500).json({
      error:err
     })
   })
})
 
module.exports = router;
 