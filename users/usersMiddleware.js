const bcrypt = require("bcryptjs");
const usersModel = require("./usersModel");

function restrict() {
  return async (req, res, next) => {
    try {
      if (!req.session || !req.session.user) {
        // Unsuccessful authentication
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }
      // Successful authentication
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = {
  restrict,
};
