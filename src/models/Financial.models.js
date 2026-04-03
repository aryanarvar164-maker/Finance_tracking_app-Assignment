import mongoose from 'mongoose';

const financialschema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            required: true,
            enum: ['income', 'expense']
        },
        category: {
            type: String,
            required: true,
            trim: true
        },
        date: {
            type: Date,
            required: true,
            default: Date.now
        },
        note: {
            type: String,
            trim: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true }
);

export const Financial = mongoose.model('Financial', financialschema);
