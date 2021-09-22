const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    require: true,
    default: Date.now,
  },
});

mongoose.Schema({
  username: String,
  password: String,
});


module.exports = mongoose.model("Posts", PostSchema);
