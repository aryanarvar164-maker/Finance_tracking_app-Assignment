import mongoose from 'mongoose';

const roleschema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            enum: ['admin', 'viewer', 'analyst'],
            unique: true
        },
        can_view: {
            type: Boolean,
            default: false
        },
        can_view_record: {
            type: Boolean,
            default: false
        },
        can_create: {
            type: Boolean,
            default: false
        },
        can_update: {
            type: Boolean,
            default: false
        },
        can_delete: {
            type: Boolean,
            default: false
        },
        can_manage_user: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

export const Role = mongoose.model("Role", roleschema);
