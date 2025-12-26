const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bookstore';

mongoose.connect(MONGO_URI).then(async () => {
    try {
        const UserSchema = new mongoose.Schema({
            name: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            passwordHash: { type: String, required: true },
            role: { type: String, default: 'user', enum: ['user', 'admin'] },
            wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
            createdAt: { type: Date, default: Date.now }
        });
        const User = mongoose.model('User', UserSchema);

        const email = 'admin@lumina.com';
        const password = 'admin123';
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const admin = new User({
            name: 'Lumina Admin',
            email,
            passwordHash,
            role: 'admin'
        });

        await admin.save();
        console.log('ADMIN_CREATED');
    } catch (err) {
        if (err.code === 11000) {
            console.log('ADMIN_ALREADY_EXISTS');
        } else {
            console.error(err);
        }
    } finally {
        mongoose.disconnect();
    }
});
