import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true,
    validate: [v => v.length > 0, 'Skills cannot be empty']
  },
  performanceScore: {
    type: Number,
    required: true
  },
  experience: {
    type: Number,
    required: true,
    min: [0, 'Experience cannot be negative']
  },
  bio: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Employee = mongoose.model('Employee', EmployeeSchema);
export default Employee;
