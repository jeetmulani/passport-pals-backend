import mongoose from 'mongoose';

const bookingSchema: any = new mongoose.Schema({
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    email: { type: String, default: null },
    phoneNumber: { type: Number, default: null },
    address: { type: String, default: null },
    date: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId },
    isBlock: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
}, { timestamps: true })

export const bookingModel = mongoose.model('booking', bookingSchema);

