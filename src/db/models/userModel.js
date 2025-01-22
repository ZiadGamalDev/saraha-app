import mongoose from 'mongoose';

const userRole = {
    USER: 'user',
    ADMIN: 'admin'
};

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Object.values(userRole),
        default: userRole.USER
    },
    phone: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    image: String
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;