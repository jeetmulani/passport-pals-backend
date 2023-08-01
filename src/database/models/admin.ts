import mongoose from 'mongoose';

const adminSchema: any = new mongoose.Schema({
    email: { type: String, default: null }, //  admin@PassportPals.com
    password: { type: String, default: null },  // PassportPals@admin
    isBlock: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
}, { timestamps: true })

export const adminModel = mongoose.model('admin', adminSchema);

