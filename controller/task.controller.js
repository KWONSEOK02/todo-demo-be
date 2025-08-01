const Task = require("../model/Task");

const taskController = {};

taskController.createTask = async (req, res) => {
  try {
    const { task, isComplete } = req.body; // 클라이언트의 요청 body에서 task와 isComplete 값을 추출
    const {userId} = req;
    const newTask = new Task({ task, isComplete, author: userId });
    await newTask.save();
    res.status(200).json({ status: "ok", data: newTask });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message || "작업 생성 중 오류가 발생했습니다." });
  }
};

taskController.getTask = async (req, res) => {
    try {
      const { userId } = req; //req에서 userId를 추출 <- 인증 미들웨어에서 정의된(req.userId) userId 사용해야함. 추출 안하고 userid 사용 시 undefined로 오류 발생
      const taskList = await Task.find({ author: userId}).select("-__v").populate("author"); // 토큰에서 추출한 유저 ID로 그 유저 정보만 추출
      //console.log("getTask_taskList_result", taskList);
      res.status(200).json({ status: "ok", data: taskList });
    } catch (err) {
      res.status(400).json({ status: "fail", error: err });
    }
  };

// 기존 updateTask 함수 (주석 처리)
/*
taskController.updateTask = async (req, res) =>{
    try{
        // req.params는 URL 경로에 포함된 변수(파라미터) 값을 담고 있음
        // 예: /tasks/123 요청 시 req.params.id는 "123"이 됨
        const { id } = req.params;
        const {isComplete} = req.body; // 완료 상태 추출
        const updatedTask = await Task.findByIdAndUpdate(  // 함수 호출시 소괄호로 
            id, 
            {isComplete},
            { new: true } // 업데이트 후의 변경된 문서를 반환할지”를 결정하는 옵션  new: true
        );
        res.status(200).json({ status: "ok", data: updatedTask });
    } catch (err) {
        res.status(400).json({ status: 'fail', error: err });
    }
};    
*/

// 새로운 updateTask 함수
// req.body 전체를 업데이트하며, runValidators: true 옵션과 404 처리 추가
// (실제 사용 함수)
taskController.updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body, 
      { new: true, runValidators: true } // runValidators: true  req.body에 담긴 데이터가 Mongoose 스키마 규칙에 맞는지 검증
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ status: "success", data: updatedTask });
  } catch (error) {
    res.status(400).json({ status: "fail", message: "예기치 못한 문제로 update 실패" });
  }
};

// 기존 deleteTask 함수 (주석 처리)
/*
taskController.deleteTask = async (req, res) =>{
    try{
        const { id } = req.params; // URL에서 id만 추출 
        const deleteTask = await Task.findByIdAndDelete(id);
        res.status(200).json({ status: "ok", data: deleteTask });
    } catch (err) {
        res.status(400).json({ status: 'fail', error: err });
    }
};    
*/

// 새로운 deleteTask 함수
// req.params.id를 바로 사용하며, 응답 status를 "success"로 반환
// (실제 사용 함수)
taskController.deleteTask = async (req, res) => {
  try {
    const deleteItem = await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: "success", data: deleteItem });
  } catch (error) {
    res.status(400).json({ status: "fail", message: "예기치 못한 문제로 삭제 실패" });
  }
};

module.exports = taskController;
