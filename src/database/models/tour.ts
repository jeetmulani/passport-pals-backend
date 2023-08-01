import mongoose from 'mongoose';

const tourSchema: any = new mongoose.Schema({
    image: { type: String, default: null },
    rating: { type: Number, default: null },
    location: { type: String, default: null },
    title: { type: String, default: null },
    description: { type: String, default: null },
    days: { type: Number, default: null },
    night: { type: Number, default: null },
    price: { type: Number, default: null },
    isBlock: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
}, { timestamps: true })

export const tourModel = mongoose.model<any>('tour', tourSchema);

