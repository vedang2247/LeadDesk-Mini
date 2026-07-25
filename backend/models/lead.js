const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true 
    },
    budgetRange: { 
      type: String, 
      required: true 
    },
    message: { 
      type: String, 
      required: true 
    },
    status: {
      type: String,
      required: true,
      enum: ['New', 'Contacted', 'Closed'],
      default: 'New'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);