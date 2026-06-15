const User = require("./auth.model");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const signupService = async (data) => {
  const existingUser =
    await User.findOne({
      email: data.email
    });

  if (existingUser) {
    throw new Error(
      "User already exists"
    );
  }

  const hashedPassword =
    await bcrypt.hash(
      data.password,
      10
    );

  const user = await User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
};

const loginService = async (data) => {
  const user = await User.findOne({
    email: data.email
  });

  if (!user) {
    throw new Error(
      "Invalid credentials"
    );
  }

  const isMatch =
    await bcrypt.compare(
      data.password,
      user.password
    );

  if (!isMatch) {
    throw new Error(
      "Invalid credentials"
    );
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

module.exports = {
  signupService,
  loginService
};