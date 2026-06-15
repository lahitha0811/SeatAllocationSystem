const {
  signupService,
  loginService
} = require("./auth.service");

const signup = async (req, res) => {
  try {
    const user =
      await signupService(req.body);

    res.status(201).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const data =
      await loginService(req.body);

    res.json({
      success: true,
      ...data
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  signup,
  login
};