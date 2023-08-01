import mongoose from 'mongoose';

const contactUsSchema: any = new mongoose.Schema({
    name: { type: String, default: null },
    email: { type: String, default: null },
    mobileNumber: { type: String, default: null },
    message: { type: String, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId },
    isBlock: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
}, { timestamps: true })

export const contactUsModel = mongoose.model('contactUs', contactUsSchema); 

