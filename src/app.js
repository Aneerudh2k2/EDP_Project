const express = require("express");
const user = require("./routes/user");
const morgan = require("morgan");
const cookieSession = require("cookie-session");
require("dotenv").config();
require("./db");

const app = express();
const port = process.env.PORT || 3000;
// app.set("trust proxy", 1);

app.use(
  cookieSession({
    name: "Biscuit",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    keys: ["interviewcat"],
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(user);
app.use("/static", express.static("interviewcat_static"));

app.get("/test", async (req, res) => {
  res.send("hello");
});

app.listen(port, () => {
  console.log(`Server is listening to the port ${port}`);
});
