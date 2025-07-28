const express = require("express");
const taskController = require("../controller/task.controller");
const router = express.Router();
const authController = require("../controller/auth.controller");

router.post("/",authController.authenticate, taskController.createTask); // 인증된 사용자만 할 일 생성 가능

router.get('/',  authController.authenticate, taskController.getTask); // 사용자에 맞는 정보가 가져옴

router.put('/:id',  authController.authenticate, taskController.updateTask); //  사용자의 정보만 수정 가능

router.delete("/:id",  authController.authenticate, taskController.deleteTask); // 사용자의 정보만 삭제 가능, 인증을 거쳐서 그 사용자만 CRUD할 수 있도록 제한하는 것"이 보안상 반드시 필요 
module.exports = router;
