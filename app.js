// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const indexRouter = require("./routes/index"); // 하위 라우터들을 관리하는 메인 라우터
// require('dotenv').config();
// const app = express();
// const MONGODB_URI_PROD = process.env.MONGODB_URI_PROD;


// // JSON 형식의 데이터 파싱
// app.use(bodyParser.json());
// app.use(cors());
// app.use("/api", indexRouter); // 하위 라우터들을 관리하는 메인 라우터(indexRouter)를 "/api" 경로에 연결
// const mongoURI = MONGODB_URI_PROD;

// mongoose.connect(mongoURI, { useNewUrlParser: true }).then(() => {
//   console.log("mongoose connected");
// }).catch((err) => {
//     console.log("DB connection fail", err);
//   });

//   app.listen(process.env.PORT || 5000, () => {
//     console.log("server on 5000");
//   });
  

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const indexRouter = require("./routes/index");
require('dotenv').config();

const app = express();

// JSON 형식의 데이터 파싱
app.use(bodyParser.json());
app.use(cors());
app.use("/api", indexRouter);

// 1. Heroku에서 사용할 환경 변수 이름은 일반적으로 MONGODB_URI 입니다.
//    process.env.MONGODB_URI_PROD 대신 process.env.MONGODB_URI를 사용하는 것을 권장합니다.
//    만약 MONGODB_URI_PROD를 사용해야 한다면 Heroku Config Vars에 해당 이름을 설정해야 합니다.
const mongoURI = process.env.MONGODB_URI || process.env.MONGODB_URI_PROD; // 환경 변수 이름 유연하게 처리

// 2. Mongoose 연결 로직을 async/await 패턴으로 변경하고,
//    useUnifiedTopology: true 옵션을 추가합니다.
//    연결 실패 시 애플리케이션을 종료하는 로직도 포함합니다.
const connectDB = async () => {
  try {
    if (!mongoURI) {
      console.error("MongoDB URI 환경 변수가 설정되지 않았습니다.");
      // 환경 변수가 없으면 연결을 시도하지 않고 종료
      process.exit(1);
    }
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true, // 이 옵션이 중요합니다.
      // useCreateIndex: true, // Mongoose 6 이상에서는 기본값이므로 필요 없을 수 있습니다.
      // useFindAndModify: false // Mongoose 6 이상에서는 기본값이므로 필요 없을 수 있습니다.
    });
    console.log('MongoDB 연결 성공...');
  } catch (err) {
    console.error('DB 연결 실패:', err.message);
    // 연결 실패 시 애플리케이션 종료
    process.exit(1);
  }
};

// 3. 서버 리스닝 전에 데이터베이스 연결을 먼저 시도합니다.
//    connectDB 함수가 프로미스를 반환하므로 .then()으로 서버 시작을 연결합니다.
connectDB().then(() => {
  app.listen(process.env.PORT || 5000, () => {
    console.log("서버가", process.env.PORT || 5000, "번 포트에서 실행 중입니다.");
  });
}).catch(err => {
  console.error("서버 시작 중 오류 발생:", err);
});