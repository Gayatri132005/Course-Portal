const mongoose = require("mongoose");

const feeSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    courseId: { type: String, required: true },
    uId: { type: String, required: true },
    amount: { type: Number, required: true },
    remark: { type: String, required: true },
}, { timestamps: true });  // 👈 timestamps enabled!
 
module.exports = mongoose.model('Fee', feeSchema);
