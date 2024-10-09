const { Router } = require("express")
const route = Router()
const modulesController = require("../controllers/modules.js")
const authMiddleware = require("../middlewares/authMiddleware.js")

route.post("/create", authMiddleware([3]), modulesController.createModule)
route.put("/update/:id", authMiddleware([3]), modulesController.updateModule)
route.get("/modules", authMiddleware([3]), modulesController.get_Modules)
route.get(
  "/modules_assigned/:classID",
  authMiddleware([3, 2]),
  modulesController.get_Modules_assigned
)
route.get(
  "/class_modules/:classID",
  authMiddleware([3, 0, 1]),
  modulesController.get_class_modules
)
route.delete("/delete/:id", authMiddleware([3]), modulesController.deleteModule)
route.post(
  "/assigneModule/:id",
  authMiddleware([3]),
  modulesController.assignModule
)
module.exports = route
