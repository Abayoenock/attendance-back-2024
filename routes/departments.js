const { Router } = require("express")
const route = Router()
const departmentsController = require("../controllers/departments.js")
const authMiddleware = require("../middlewares/authMiddleware.js")

route.post(
  "/create",
  authMiddleware([0]),
  departmentsController.createDepartment
)
route.put(
  "/update/:id",
  authMiddleware([0]),
  departmentsController.updateDepartment
)
route.get(
  "/departments",
  authMiddleware([0]),
  departmentsController.getDepartments
)
route.get("/teachers", authMiddleware([0]), departmentsController.getTeachers)
route.get(
  "/department/:id",
  authMiddleware([0]),
  departmentsController.getSingleDepartment
)
route.delete(
  "/department/:id",
  authMiddleware([0]),
  departmentsController.deleteDepartment
)
route.put(
  "/assign",
  authMiddleware([0]),
  departmentsController.asignDepartmentToTeacher
)

module.exports = route
