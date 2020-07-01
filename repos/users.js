const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config;

// POST
// http://localhost/api/users/register
router.post("/register", (req, res) => {
  const newUser = new User({
    username: req.body.username,
    password: req.body.password,
  });
  // if username already in use
  User.getUserByUsername(newUser.username, (err, user) => {
    if (user != null) {
      res.json({
        success: false,
        type: "USER_ALREADY_EXIST",
        msg: "Username already in use.",
      });
    } else {
      User.addUser(newUser, (err, user) => {
        if (err) {
          res.json({ success: false, msg: "Failed to register the user" });
        } else {
          res.json({
            success: true,
            msg: "Successfully registered the user",
            user: user,
          });
        }
      });
    }
  });
});

// POST
// http://localhost/api/users/auth
router.post("/auth", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({
        success: false,
        type: "USER_NOT_EXIST",
        msg: "User does not exist.",
      });
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (isMatch) {
        // successfully authenticated user
        const token = jwt.sign({ data: user }, process.env.SECRET, {
          expiresIn: 86400, // 1 day
        });

        res.json({
          success: true,
          token: `JWT ${token}`,
          user: {
            userId: user._id,
            username: user.username,
          },
        });
      } else {
        // user exists but password didn't match
        return res.json({
          success: false,
          type: "INCORRECT_PASSWORD",
          msg: "Incorrect password!",
        });
      }
    });
  });
});

module.exports = router;
