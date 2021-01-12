const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema(
  {
    description: { type: String, require: true, trim: true },
    completed: { type: Boolean, default: false },
    owner: { type: mongoose.Schema.Types.ObjectId, require: true, ref: 'User' },
    status: { type: String, require: true }
  },
  { timestaps: true }
);

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
