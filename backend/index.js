const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Stripe = require('stripe')
require('dotenv').config()

const app = express()
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

// Config
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bookstore'
const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_with_a_strong_secret'
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder'
const PORT = process.env.PORT || 4000

const stripe = Stripe(STRIPE_SECRET_KEY)

// Database Connection
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))

// Mongoose Schemas
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'user', enum: ['user', 'admin'] },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  createdAt: { type: Date, default: Date.now }
})
const User = mongoose.model('User', UserSchema)

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: String,
  price: Number,
  category: { type: String, default: 'General' },
  reviews: [{
    user: String,
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
})
const Book = mongoose.model('Book', BookSchema)

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    quantity: Number,
    section: String,
    title: String,
    price: Number
  }],
  total: Number,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
})
const Order = mongoose.model('Order', OrderSchema)

// Middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Access denied' })
  try {
    const verified = jwt.verify(token, JWT_SECRET)
    req.user = verified
    next()
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' })
  }
}

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user && (user.role === 'admin' || user.email === 'admin@lumina.com')) {
      next();
    } else {
      res.status(403).json({ error: 'Admin access required' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error check admin' });
  }
}

// Routes - Auth
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' })

    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ error: 'Email already registered' })

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)
    const role = email === 'admin@lumina.com' ? 'admin' : 'user' // Simple auto-admin for demo

    const newUser = new User({ name, email, passwordHash, role })
    const saved = await newUser.save()
    const token = jwt.sign({ id: saved._id, email: saved.email }, JWT_SECRET, { expiresIn: '7d' })

    res.status(201).json({ token, user: { id: saved._id, name: saved.name, email: saved.email, role: saved.role } })
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    const matched = await bcrypt.compare(password, user.passwordHash)
    if (!matched) return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    res.status(500).json({ error: 'Login failed' })
  }
})

// Routes - User & Wishlist
app.post('/api/user/wishlist/:bookId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const bookId = req.params.bookId;

    const index = user.wishlist.indexOf(bookId);
    if (index === -1) {
      user.wishlist.push(bookId); // Add
    } else {
      user.wishlist.splice(index, 1); // Remove
    }
    await user.save();
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update wishlist' });
  }
});

app.get('/api/user/wishlist', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// Routes - Books
app.get('/api/books', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } }
        ]
      };
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const books = await Book.find(query).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

app.post('/api/books/:id/reviews', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const book = await Book.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!book) return res.status(404).json({ error: 'Book not found' });
    if (!user) return res.status(404).json({ error: 'User not found' });

    book.reviews.push({
      user: user.name,
      rating,
      comment
    });

    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add review' });
  }
});

app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// Admin Routes (Books)
app.post('/api/books', auth, isAdmin, async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const saved = await newBook.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create book' });
  }
});

app.put('/api/books/:id', auth, isAdmin, async (req, res) => {
  try {
    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update book' });
  }
});

app.delete('/api/books/:id', auth, isAdmin, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

// Routes - Orders
app.post('/api/orders', auth, async (req, res) => {
  try {
    const { items, total, status } = req.body
    const newOrder = new Order({
      user: req.user.id,
      items,
      total,
      status: status || 'Pending'
    })
    const saved = await newOrder.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order' })
  }
})

app.get('/api/orders/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Routes - Payment
app.post('/api/payment/create-intent', async (req, res) => {
  try {
    const { amount } = req.body
    if (!amount) return res.status(400).json({ error: 'Amount is required' })

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    })

    res.send({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.error('Stripe error:', err)
    res.status(500).json({ error: 'Payment initialization failed' })
  }
})


app.listen(PORT, () => console.log(`Backend running on port ${PORT}`))
