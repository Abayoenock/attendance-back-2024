const { Router } = require("express")
const route = Router()
const authController = require("../controllers/auth.js")
const authMiddleware = require("../middlewares/authMiddleware.js")
//================= route for logging in
route.post("/", authController.login)
// route for creating account , might require middleware depenfing on the  project needs
route.post("/create", authController.createAccount)

// route for updatting the user profile
route.put("/update-profile", authMiddleware([0]), authController.updateProfile)

// route for updating a user profile done bu an admin , pass in  the correct privileges
route.put(
  "/update-profile/:userID",
  authMiddleware([0]),
  authController.updateuserProfile
)

// =========== get all users from the system // pass in the required previlages
route.get("/users", authMiddleware([0]), authController.getAllUsers)
// =========== get all profile information
route.get("/user", authMiddleware([0, 1]), authController.getProfileInformation)
route.get(
  "/teacher",
  authMiddleware([3, 2]),
  authController.getTeachersProfileInformation
)
route.get(
  "/student",
  authMiddleware([4]),
  authController.getStudentProfileInformation
)
// =========== get all users from the system // pass in the required previlages
route.get("/user/:userID", authMiddleware([0]), authController.getSingleUser)
//=====================request for password reset
route.post("/reset-password", authController.resertPassword)
//====================route for changing the password of the user
route.put("/change-password", authMiddleware(), authController.changePassword)

//====================route for verifyting the password reset token
route.get("/verify-token", authController.verifyToken)

//====================route for updating the route after a password reset
route.put("/change-password-reset", authController.changePasswordReset)

//==================== this route must require the admin previlages
route.delete(
  "/delete-user-account/:userID",
  authMiddleware([0]),
  authController.deleteUser
)
//==================== this route must require the admin previlages
route.put(
  "/blockUser/:userID",
  authMiddleware([0]),
  authController.changeIsBlocked
)
module.exports = route
