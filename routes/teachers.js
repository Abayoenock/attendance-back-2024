const { Router } = require("express")
const route = Router()
const teachersController = require("../controllers/teachers")
const authMiddleware = require("../middlewares/authMiddleware.js")
const uploadMiddleware = require("../middlewares/uploadImageMiddleWare.js")

// route for creating account , might require middleware depenfing on the  project needs
route.post(
  "/create",
  uploadMiddleware,
  authMiddleware([0]),
  teachersController.createAccount
)
route.put(
  "/update/:userID",
  uploadMiddleware,
  authMiddleware([0]),
  teachersController.updateAccount
)
route.get("/teachers", authMiddleware([0]), teachersController.getTeachers)

route.get(
  "/teacher/:userID",
  authMiddleware([0]),
  teachersController.getSingleTeacher
)

// //==================== this route must require the admin previlages
route.delete(
  "/delete-user-account/:userID",
  authMiddleware([0]),
  teachersController.deleteUser
)
//==================== this route must require the admin previlages
route.put(
  "/blockUser/:userID",
  authMiddleware([0]),
  teachersController.changeIsBlocked
)

module.exports = route
