const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    courseName: { type: String, required: true },
    price: { type:String, required: true }, // ✅ Fixed here
    description: { type: String, required: true },
    startingDate: { type: String, required: true },   // ✅ 'String' capitalized
    endDate: { type: String, required: true },        // ✅ fixed 'required' typo
    imageId: { type: String, required: true }, 
    imageUrl: { type: String, required: true },   
    uId: { type: String, required: true },         // ✅ corrected object structure
});

module.exports = mongoose.model('Course', courseSchema);
