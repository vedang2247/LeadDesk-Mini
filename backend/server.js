const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL, 
  credentials: true,              
}));
app.use(express.json()); 
app.use(cookieParser());


const authRoutes = require('./routes/authRoutes'); 
const leadRoutes = require('./routes/leadRoutes');


app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);


app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'LeadDesk Mini API is running!' });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Error connecting to MongoDB:`, error.message);
  });