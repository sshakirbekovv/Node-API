const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const {
  registerValidation,
  loginValidation,
} = require("../validation/validation");


router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists!");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const roles = ['Admin', 'User'];

  if (!roles.includes(req.body.role))
    return res.status(400).send("Role can be only Admin or User!");
  
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: hashedPassword,
  });

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: "24h",
  });

  try {
    await user.save();
    res.header("Authorization", token).send({token: token, id: user._id});
  } catch (err) {
    res.status(400).send({message: err.message});
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email is not found!");

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid password!");

  if(req.body.role !== user.role) {
    return res.status(400).send("Wrong role!");
  }

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: "24h",
  });
  res.header("Authorization", token).send({token: token, id: user._id});
});

module.exports = router;
