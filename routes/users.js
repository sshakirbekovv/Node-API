const express = require("express");
const User = require("../models/User");
const router = express.Router();
const verifyToken = require("./verifyToken");
const bcrypt = require("bcryptjs");
const { registerValidation } = require("../validation/validation");

router.get("/", async (req, res) => {
  try {
    const savedUsers = await User.find();
    res.json(savedUsers);
  } catch (err) {
    res.status(404).send({message: err.message});
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user)
      res.status(400).send(`User with id: ${req.params.userId} doesn't exist!`);
    res.json(user.name);
  } catch (err) {
    res.status(400).send({message: err.message});
  }
});

router.post("/", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists!");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const roles = ["Admin", "User"];

  if (!roles.includes(req.body.role))
    return res.status(400).send("Role can be only Admin or User!");

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (err) {
    res.status(400).send({message: err.message});
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    const removedUser = await User.remove({ _id: req.params.userId });
    res.json(removedUser);
  } catch (err) {
    res.status(400).send({message: err.message});
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
      name: req.body.name,
      role: req.body.role,
    }, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).send({message: err.message});
  }
});

module.exports = router;
