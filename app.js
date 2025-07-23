const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const indexRouter = require("./routes/index"); // 하위 라우터들을 관리하는 메인 라우터
require('dotenv').config();
const app = express();
const MONGODB_URI_PROD = process.env.MONGODB_URI_PROD;


// JSON 형식의 데이터 파싱
app.use(bodyParser.json());
app.use(cors());
app.use("/api", indexRouter); // 하위 라우터들을 관리하는 메인 라우터(indexRouter)를 "/api" 경로에 연결
const mongoURI = MONGODB_URI_PROD;

mongoose.connect(mongoURI, { useNewUrlParser: true }).then(() => {
  console.log("mongoose connected");
}).catch((err) => {
    console.log("DB connection fail", err);
  });

  app.listen(process.env.PORT || 5000, () => {
    console.log("server on 5000");
  });
  