const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler")
const {
  generateToken,
  hashPassword,
  validateRegisterUser,
  validateLoginUser } = require("../models/user");
const { User, UserType } = require("../config/database")

/**
 *  @desc    Register New User
 *  @route   /api/auth/register
 *  @method  POST
 *  @access  public
 */
module.exports.register = asyncHandler(async (req, res) => {
  const { error } = validateRegisterUser(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  let user = await User.findOne({ where: { email: req.body.email } })
  if (user) {
    return res.status(400).json({ message: "this user already registered" });
  }

  let userType = await UserType.findOne({ where: { id: req.body.type } });
  if (!userType) {
    return res.status(400).json({ message: 'this user type is not exist' });
  }

  req.body.password = await hashPassword(req.body.password)

  user = await User.create({
    type: req.body.type,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    date_of_birth: req.body.date_of_birth,
    address: req.body.address,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });
  const token = generateToken(user)



  const { password, ...other } = user.toJSON();
  res.status(201).json({ ...other, type: userType.type, token });
})

/**
 *  @desc    Login User
 *  @route   /api/auth/login
 *  @method  POST
 *  @access  public
 */
module.exports.login = asyncHandler(async (req, res) => {

  const { error } = validateLoginUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }


  let user = await User.findOne({ where: { email: req.body.email } })
  if (!user) {
    return res.status(400).json({ message: "invalid email " });
  }

  const isPasswordMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isPasswordMatch) {
    return res.status(400).json({ message: "invalid password" });
  }
  const token = generateToken(user)

  const { password, ...other } = user.toJSON();

  res.status(200).json({ ...other, token });
});
