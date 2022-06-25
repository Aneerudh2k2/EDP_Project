const express = require("express");
const { pool: db } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const validateEmail = (email_id) => {
  let regex = new RegExp("^[A-Za-z0-9._%+-]+@tce.edu$");
  if (!regex.test(email_id)) {
    throw Error("Please use TCE student email id!!!");
  }
};

const validatePhoneNumber = (phone_number) => {
  if (phone_number.length !== 10) {
    throw Error("Invalid phone number!!");
  }
};

const validatePassword = (password, cnf_password) => {
  if (!(cnf_password === password)) {
    throw Error("Password and confirm password ain't same!!");
  }
};

router.post("/users/signup", async (req, res) => {
  let { name, email_id, phone_number, password, cnf_password } = req.body;

  console.log({ name, email_id, phone_number, password, cnf_password });

  try {
    validateEmail(email_id);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }

  try {
    validatePhoneNumber(phone_number);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }

  try {
    validatePassword(password, cnf_password);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }

  password = await bcrypt.hash(password, 8);

  try {
    const tokens = jwt.sign(
      { email_id: email_id.toString() },
      "thisisinterviewcat"
    );

    const values = [name, email_id, phone_number, password, tokens];

    const result = await db.query(
      `insert into "user"(name, email_id, phone_number, password, createdAt, tokens) values($1,$2,$3,$4,now(),$5) returning *`,
      values
    );

    const userObject = result.rows[0];

    delete userObject.password;
    delete userObject.tokens;
    res.send({ user: userObject, tokens });
    console.log("user saved: ", { user: userObject, tokens });
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ error: error.message });
  }
});

router.post("/users/login", async (req, res) => {
  const { email_id, password } = req.body;
  const values = [email_id];
  const user = await db.query(
    `select email_id, password, name from "user" where email_id=$1`,
    values
  );
  console.log("User exists: ", user.rows);
  try {
    if (user.rows.length == 0) {
      throw new Error("Unable to login!!");
    }
    const isPasswordMatch = await bcrypt.compare(
      password,
      user.rows[0].password
    );
    if (!isPasswordMatch) throw new Error("Enter the correct password!!");
    const token = jwt.sign(
      { email_id: email_id.toString() },
      "thisisinterviewcat"
    );

    console.log("new token: ", token);
    const values = [token, email_id];
    const updateToken = await db.query(
      `update "user" set tokens=$1 where email_id=$2 returning *`,
      values
    );
    console.log("Update result: ", updateToken.rows);
    res.send({
      name: updateToken.rows[0].name,
      email_id: updateToken.rows[0].email_id,
      token: updateToken.rows[0].tokens,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
