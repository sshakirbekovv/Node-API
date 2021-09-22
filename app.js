const express = require("express");
const mongoose = require("mongoose");
require("dotenv/config");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


const postRoute = require("./routes/posts");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");


app.use("/posts", postRoute);
app.use("/auth", authRoute);
app.use("/users", userRoute);


app.get("/", (req, res) => {
  res.send("App for message!");
});


mongoose.connect(process.env.DB_CONNECTION, () => {
  console.log("Connected");
});


app.listen(4000);
