const { Router } = require("express")
const route = Router()
const studentsController = require("../controllers/students")
const authMiddleware = require("../middlewares/authMiddleware.js")
const uploadMiddleware = require("../middlewares/uploadImageMiddleWare.js")

// route for creating account , might require middleware depenfing on the  project needs
route.post(
  "/create",
  uploadMiddleware,
  authMiddleware([0]),
  studentsController.createAccount
)
route.put(
  "/update/:userID",
  uploadMiddleware,
  authMiddleware([0]),
  studentsController.updateAccount
)
route.get("/students", authMiddleware([0]), studentsController.getStudents)

route.get(
  "/student/:userID",
  authMiddleware([0]),
  studentsController.getSingleStudent
)

// //==================== this route must require the admin previlages
route.delete(
  "/delete-user-account/:userID",
  authMiddleware([0]),
  studentsController.deleteUser
)
//==================== this route must require the admin previlages
route.put(
  "/blockUser/:userID",
  authMiddleware([0]),
  studentsController.changeIsBlocked
)
route.get("/getFingerID", authMiddleware([0]), studentsController.fingerPrint)

module.exports = route
