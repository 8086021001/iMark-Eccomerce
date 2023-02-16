const mongoose = require('mongoose');
const { Schema } = mongoose;




const coupon = new Schema({
    code:{
        type: String, required: true
    },
    expiry:{
        type: Date, required: true
    },
    discount:{
        type: Number, required: true
    },
    minimum:{
        type: Number, required: true
    },
    isActive:{
        type:Boolean,
        default:true
    }
})


module.exports = mongoose.models.coupon || mongoose.model("coupon", coupon);

