const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);
const usersRouter = require("./users/usersRouter");
const db = require("./database/config");

const server = express();
const port = 4000;

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "I wont tell if you wont",
    store: new KnexSessionStore({
      knex: db,
      createtable: true,
    }),
  })
);

server.use("/api", usersRouter);

server.use((err, req, res, next) => {
  console.log(err);

  res.status(500).json({
    message: "Something went wrong",
  });
});

server.listen(port, () => {
  console.log(`Running at http://localhost:${port}`);
});
