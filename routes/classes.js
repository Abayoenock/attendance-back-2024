const { Router } = require("express")
const route = Router()
const classesController = require("../controllers/classes")
const authMiddleware = require("../middlewares/authMiddleware.js")

route.post("/create", authMiddleware([3]), classesController.createClass)
route.put("/update/:id", authMiddleware([3]), classesController.updateClass)
route.get("/classes", authMiddleware([3]), classesController.get_classes)
route.get(
  "/classes_assigned",
  authMiddleware([3, 2]),
  classesController.get_classes_assigned
)
route.get(
  "/assignClassStudents/:id",
  authMiddleware([3]),
  classesController.get_assign_students
)
route.get("/teachers", authMiddleware([3]), classesController.getTeachers)

route.delete("/delete/:id", authMiddleware([3]), classesController.deleteClass)
route.put(
  "/assignClassToStudent/:id",
  authMiddleware([3]),
  classesController.assignStudentToClass
)
module.exports = route
