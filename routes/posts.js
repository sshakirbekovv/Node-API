const express = require("express");
const Post = require("../models/Post");
const router = express.Router();
const verifyToken = require("./verifyToken");

router.get("/", async (req, res) => {
  try {
    const savedPosts = await Post.find()
    .populate({ path: 'user', select: 'name' });
    res.json(savedPosts);
  } catch (err) {
    res.status(400).send({message: err.message});
  }
});

router.get("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    res.json(post);
  } catch (err) {
    res.status(400).send({message: err.message});
  }
});

router.post("/", verifyToken, async (req, res) => {
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    user: req.body.user
  });

  try {
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (err) {
    res.status(400).send({message: err.message});
  }
});

router.delete("/:postId", verifyToken, async (req, res) => {
  try {
    const removedPost = await Post.remove({ _id: req.params.postId });
    res.json(removedPost);
  } catch (err) {
    res.status(400).send({message: err.message});
  }
});


router.put("/:postId", verifyToken, async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.postId, {
      title: req.body.title,
      description: req.body.description,
    }, { new: true });
    res.json(updatedPost);
  } catch (err) {
    res.status(400).send({message: err.message});
  }
});

module.exports = router;
