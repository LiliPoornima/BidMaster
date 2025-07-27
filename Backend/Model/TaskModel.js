const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'EmpModel' },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  deadline: Date,
  skillRequired: [String],
  performanceScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
   },
  {
    timestamps: true 
  }
);

module.exports = mongoose.model('TaskModel', taskSchema);
