import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userschema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            select: false
        },
        refreshToken: {
            type: String,
            select: false
        },
        status: {
            type: Boolean,
            default: true
        },
        role_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role",
            required: true
        }
    },
    { timestamps: true }
);

userschema.pre('save', async function () {
    if (!this.isModified('password')) return ;
    this.password = await bcrypt.hash(this.password, 10);
});

userschema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userschema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            role_id: this.role_id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

userschema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

export const User = mongoose.model("User", userschema);
