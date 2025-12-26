const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bookstore';

mongoose.connect(MONGO_URI).then(async () => {
    try {
        // Define minimal schema to query
        const User = mongoose.model('User', new mongoose.Schema({ email: String }), 'users');

        const admin = await User.findOne({ email: 'admin@lumina.com' });

        if (admin) {
            console.log('ADMIN_EXISTS');
        } else {
            console.log('ADMIN_NOT_FOUND');
        }
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
});
