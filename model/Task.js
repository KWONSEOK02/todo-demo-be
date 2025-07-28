const mongoose = require('mongoose');
const User = require('./User');
const Schema = mongoose.Schema

const taskSchema = Schema({
  task: {
    type: String,
    required: true
  },
  isComplete: {
    type: Boolean,
    required: true
  },
  author: {
     type: Schema.Types.ObjectId,
    require: true,
    ref: "User"
  }

}, { timestamps: true }); // createdAt, updatedAt 필드가 자동으로 추가됨

const Task = mongoose.model("Task", taskSchema); // taskSchema를 기반으로 한 Task 모델을 정의

module.exports = Task;
