const User = require("../model/User");
const bcrypt = require("bcryptjs");  //bcrypt로 변수를 만드는게 역할 동일해서 관행, 문법도 동일, 구현 차이만 있다.
const saltRounds = 10


const userController = {}

userController.createUser = async (req, res) => {
  try {
    const { email, name, password } = req.body
    const user = await User.findOne({ email })
    if (user) {
      throw new Error('이미 가입이 된 유저 입니다')
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = new User({ email, name, password: hash });
    await newUser.save();
    res.status(200).json({ status: "success" });
    
  } catch (error) {
      res.status(400).json({ status: "fail", error: error });
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
      res.status(400).json({ status: "fail", error: error });
  }
}


module.exports = userController;
