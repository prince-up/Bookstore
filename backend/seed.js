const mongoose = require('mongoose');
require('dotenv').config();

const Book = mongoose.model('Book', new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: String,
    price: Number,
    createdAt: { type: Date, default: Date.now },
}));

const books = [
    {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        description: "A novel set in the Jazz Age that tells the story of Jay Gatsby's unrequited love for Daisy Buchanan.",
        price: 12.99,
        category: "Fiction"
    },
    {
        title: "1984",
        author: "George Orwell",
        description: "A dystopian social science fiction novel and cautionary tale about the future.",
        price: 14.99,
        category: "Sci-Fi"
    },
    {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        description: "A novel about the serious issues of rape and racial inequality.",
        price: 10.99,
        category: "Fiction"
    },
    {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        description: "A romantic novel of manners written by Jane Austen.",
        price: 9.99,
        category: "Romance"
    },
    {
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        description: "A story about adolescent alienation and loss of innocence.",
        price: 11.99,
        category: "Fiction"
    },
    {
        title: "Dune",
        author: "Frank Herbert",
        description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides.",
        price: 18.99,
        category: "Sci-Fi"
    },
    {
        title: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        description: "The major New York Times bestseller that explains the two systems that drive the way we think.",
        price: 16.99,
        category: "Business"
    }
];

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bookstore';

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        await Book.deleteMany({});
        console.log('Cleared existing books');
        await Book.insertMany(books);
        console.log('Seeded books');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
