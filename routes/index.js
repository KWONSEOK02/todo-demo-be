const express = require("express");
const router = express.Router(); // 새로운 라우터 객체 생성 (각종 라우트들을 이 객체에 등록)
const taskApi = require('./task.api');
const userApi = require('./user.api');

router.use('/tasks', taskApi);
router.use('/user', userApi);

module.exports = router; // 라우터 객체를 외부에서 사용할 수 있도록 내보냄
//exports 해당 파일(모듈)에서 정의한 값, 함수, 객체 등을 외부에서 사용할 수 있게 내보내는 역할