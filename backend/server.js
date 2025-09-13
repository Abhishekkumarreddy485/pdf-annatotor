// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const pdfRoutes = require('./routes/pdfs');
const highlightRoutes = require('./routes/highlights');

const app = express();
const PORT = process.env.PORT || 4000;

// connect DB
connectDB();

// middleware
app.use(cors({
  origin: 'http://localhost:3000', // React frontend
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*'); // allow any origin
  }
}));

// api routes
app.use('/api/auth', authRoutes);
app.use('/api/pdfs', pdfRoutes);
app.use('/api/highlights', highlightRoutes);

// health check
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date() }));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
