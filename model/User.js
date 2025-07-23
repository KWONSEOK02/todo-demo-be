const mongoose = require("mongoose")
const Schema = mongoose.Schema
const jwt = require("jsonwebtoken");
require('dotenv').config(); // dotenv	환경변수 파일을 읽어서 process.env에 로드하는 라이브러리
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY; //process.env는 Node.js에서 환경변수를 다루는 객체


const userSchema = Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

userSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.password;
  return obj;
};


userSchema.methods.generateToken = function () {
  const token = jwt.sign({ _id: this._id }, JWT_SECRET_KEY, { expiresIn: '1d' }); //expiresIn 토큰 유통기한 1d
  return token;
};

const User = mongoose.model("User", userSchema);
module.exports = User;

