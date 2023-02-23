const mongoose =require('mongoose')
const {Schema} =  mongoose;

const orderSchema = new Schema({
    shippingInfo: {
        houseName: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        zip: {
            type: Number,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    },
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    orderItems: [
        {
            proId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product"
            },
            quantity: {
                type: Number
            }
        }
    ],
    totalAmount: {
        type:Number,
        required: true
    },
    paymentMode: {
        type: String,
        required: true
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
    orderStatus:{
        type:String,
        default:"placed"
    },
    inReturn:{
        type:Boolean,
        default:false,
    },
    isShipped:{
        type:Boolean,
        default:false
    },
    isCancelled: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    deliveredAt: {
        type: Date,
    },
    returned:
    {
        type:Boolean,
        default:false
    }

})


module.exports = mongoose.models.order || mongoose.model("order", orderSchema);
