const User = require("../model/User");
const bcrypt = require("bcryptjs");  //bcrypt로 변수를 만드는게 역할 동일해서 관행, 문법도 동일, 구현 차이만 있다.
const saltRounds = 10


const userController = {}

userController.createUser = async (req, res) => {
  try {
    const { email, name, password } = req.body

    // 비밀번호가 누락된 경우 에러 처리
    if (!password) {
      throw new Error('비밀번호를 입력해주세요'); // 비밀번호 누락 시 사용자에게 안내, 비밀번호 누락를 먼저 확인하여 예상치 못한 예외나 서버 오류, 불필요한 쿼리 비용 발생 방지지
    }  

    const user = await User.findOne({ email })
    if (user) {
      throw new Error('해당 이메일로 가입된 계정이 존재합니다') // 이메일이 중복될 경우 가입이 불가능하다는 점을 명확히 전달하기 위한 메시지 변경
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = new User({ email, name, password: hash });
    await newUser.save();
    res.status(200).json({ status: "success" });
    
  } catch (error) {
    if (error.name === 'ValidationError') {
      // 각각의 필드에 대해 에러 메시지만 추출, 몽구스 에러 대신 사용자 친화 에러 메세지 제공 목적 
      //"에러 객체의 구조가 User validation failed: password:와 같이 되어 있기 때문에, 
      // error.errors를 통해 User validation failed: 부분을 제외하고, err => err.message를 사용하여 
      // password:와 같은 필드명을 제거함으로써, 최종적으로 스키마에 정의된 사용자 친화적인 오류 메시지만 추출해 제공
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        status: "fail",
        message: messages.join('\n') // 에러 메시지 출력 후 줄바꿈
      });
    }
      res.status(400).json({ status: "fail", message: error.message }); // 이미 가입이 된 유저 오류 메세지를 프론트 엔드에 전달하기위해 message: error.message로 수정
  }
}

userController.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email },"-createdAt -updatedAt -__v");
    if (user) {
      const isMatch = bcrypt.compareSync(password, user.password); // compareSync 동기 방식   await compare 비동기 방식
        if (isMatch) {
          const token = user.generateToken();
          return res.status(200).json({ status: "success", user, token });
        }
    }
    throw new Error("아이디 또는 비밀번호가 일치하지 않습니다");

  } catch (error) {
      res.status(400).json({ status: "fail", message: error.message});
  }
}

userController.getUser = async (req, res) => {
  try {
    const { userId } = req; // req.userId에서 userId를 구조분해 할당
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("can not find user");
    }
    res.status(200).json({ status: "success", user });    
  } catch (error) {
    console.log("getUser error");
    res.status(400).json({ status: "fail", message: error.message });
  }
}


module.exports = userController;
