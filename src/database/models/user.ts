import mongoose from 'mongoose';

const userSchema: any = new mongoose.Schema({
    name: { type: String, default: null },
    email: { type: String, default: null },
    password: { type: String, default: null },
    profileImage: { type: String, default: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png" },
    mobileNumber: { type: Number, default: null },
    otp: { type: Number, default: null },
    otpExpireTime: { type: Date, default: null },
    isBlock: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
}, { timestamps: true })

export const userModel = mongoose.model<any>('user', userSchema);

