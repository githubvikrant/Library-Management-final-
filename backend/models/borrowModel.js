import mongoose from "mongoose";


const borrowSchema = new mongoose.Schema({
    user :{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    },  
    price: {
        type: Number,
        required: true
    }, 
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Borrow",
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    borrowedAt: {
        type: Date,
        default: Date.now
    },
    returnDate: {
        type: Date,
        required: true
    }, 
    returnedAt: {
        type: Date,
        default:null
    },
    
    fine: {
        type: Number,
        default: 0
    },
    notified: {
        type: Boolean,
        default: false
    }
},
   {
    timestamps: true
   }
);

export const Borrow = mongoose.model("Borrow", borrowSchema);