const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bookstore';

// Define minimal schema
const BookSchema = new mongoose.Schema({ title: String });
const Book = mongoose.model('Book', BookSchema);

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('CONNECTED_TO_DB');
        try {
            const books = await Book.find({});
            console.log(`TOTAL_BOOKS: ${books.length}`);
            if (books.length > 0) console.log('SAMPLE_BOOK:', books[0].title);
        } catch (err) {
            console.error('QUERY_ERROR:', err);
        } finally {
            mongoose.disconnect();
        }
    })
    .catch(err => console.error('CONNECTION_ERROR:', err));
