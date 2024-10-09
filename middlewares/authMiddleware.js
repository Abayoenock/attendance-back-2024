const jwt = require("jsonwebtoken")

// Middleware to authenticate JWT token
const authenticateJWT =
  (role = []) =>
  (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || authHeader == "Bearer null") {
      return res.status(401).json({
        error: "Auth token missing , please login first",
      })
    }

    const token = authHeader.split(" ")[1] // Bearer <token>

    if (!token || token == "null") {
      return res.status(401).json({
        error: "Auth token missing , please login first ",
      })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(403).json({
            error:
              "Your Token has expired, login again to continue using the system",
          })
        } else {
          return res.status(403).json({
            error: " Failed to authenticate token Please login again ",
          })
        }
      }
      const userData = user.data

      // Check if the user's role matches the required role
      if (role.length > 0 && !role.includes(userData.role)) {
        return res.status(403).json({
          error:
            "You  do not have the required privileges to access the  resources",
        })
      }

      req.user = userData
      next()
    })
  }

module.exports = authenticateJWT
