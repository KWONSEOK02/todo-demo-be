const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const indexRouter = require("./routes/index"); // 하위 라우터들을 관리하는 메인 라우터
require('dotenv').config();

const app = express();

// JSON 형식의 데이터 파싱을 위한 미들웨어
app.use(bodyParser.json());
// CORS(Cross-Origin Resource Sharing) 활성화 미들웨어
app.use(cors());
// 하위 라우터들을 관리하는 메인 라우터(indexRouter)를 "/api" 경로에 연결
app.use("/api", indexRouter);

// Heroku와 같은 배포 환경에서는 MONGODB_URI 환경 변수를 주로 사용
// 개발 환경 또는 특정 배포 환경을 위해 MONGODB_URI_PROD와 같은 변수도 고려
// 두 변수 중 하나라도 설정되어 있으면 사용하도록 유연하게 처리
const mongoURI = process.env.MONGODB_URI || process.env.MONGODB_URI_PROD;

// Mongoose 연결 로직을 비동기(async/await) 패턴으로 구성
// 이 방식을 통해 데이터베이스 연결이 완료된 후 서버가 시작되도록 보장
// Operation `users.findOne()` buffering timed out after 10000ms <- 이 오류 해결을 위해 데이터 베이스 연결이 확실히 보장되고, 비정상적인 실행을 막기위함
const connectDB = async () => {
  try {
    // MongoDB URI가 설정되어 있지 않으면 오류를 발생시키고 애플리케이션을 종료합니다.
    if (!mongoURI) {
      console.error("MongoDB URI 환경 변수가 설정되지 않았습니다. .env 파일 또는 환경 변수를 확인해주세요.");
      process.exit(1); // 환경 변수 없이는 DB 연결을 시도할 수 없으므로 애플리케이션 종료
    }
    // Mongoose를 사용하여 MongoDB에 연결
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true, // URL 파서 관련 경고를 피하기 위해 사용
      useUnifiedTopology: true, // 새로운 서버 디스커버리 및 모니터링 엔진을 사용하도록 설정. 안정적인 연결을 유지하는 데 도움이 된다고 함.
      // useCreateIndex: true, // Mongoose 6 이상에서는 기본값이므로 명시적으로 설정할 필요가 없다. (인덱스 생성 관련 경고 방지)
      // useFindAndModify: false // Mongoose 6 이상에서는 기본값이므로 명시적으로 설정할 필요가 없다. (findAndModify 관련 경고 방지)
    });
    console.log('MongoDB 연결 성공...');
  } catch (err) {
    // 데이터베이스 연결 실패 시 오류 메시지를 기록하고 애플리케이션을 종료.
    console.error('DB 연결 실패:', err.message);
    process.exit(1); // 데이터베이스 연결 없이는 애플리케이션이 정상 작동하기 어려우므로 종료
  }
};

// 데이터베이스 연결을 먼저 시도한 후, 연결이 성공하면 서버를 시작.
// 이를 통해 서버가 요청을 처리하기 전에 데이터베이스 연결이 확실히 설정되도록 함.
connectDB().then(() => {
  app.listen(process.env.PORT || 5000, () => {
    console.log("서버가", process.env.PORT || 5000, "번 포트에서 실행 중입니다.");
  });
}).catch(err => {
  // 데이터베이스 연결 실패로 인해 서버 시작이 불가능한 경우 오류를 기록.
  console.error("서버 시작 중 오류 발생:", err);
});