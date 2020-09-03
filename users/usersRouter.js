const express = require("express");
const bcrypt = require("bcryptjs");
const usersModel = require("./usersModel");
const usersMiddleware = require("./usersMiddleware");

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await usersModel.findBy({ username }).first();

    if (user) {
      // If user exist exit router.post with status(400)
      return res.status(400).json({
        message: "Username taken. Please select another",
      });
    }

    // If user does not exist create the new user
    const newUser = await usersModel.add({
      username,
      password: await bcrypt.hash(password, 14),
    });

    console.log("newUser", newUser);

    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

router.get("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await usersModel.findBy({ username }).first();

    if (!user) {
      // If user does not exist exit router with status(401)
      return res.status(401).json({ message: "Username does not exist" });
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      // If passwords do not match exit with status(401)
      return res.status({ message: "Invalid password. Try again" });
    }

    req.session.user = user;
    res.json({ message: `${user.username} logged in!` });
  } catch (err) {
    next(err);
  }
});

router.get("/logout", (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        next(err);
      } else {
        res.status(204).end();
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
