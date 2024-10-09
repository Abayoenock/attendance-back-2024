const { Router } = require("express")
const route = Router()
const deviceApiController = require("../controllers/deviceApi")
const authMiddleWare = require("../middlewares/authMiddleware")
deviceApiController.startServer()
route.post(
  "/start",
  authMiddleWare([2, 3]),
  deviceApiController.startAttendance
)
route.get(
  "/recent",
  authMiddleWare([2, 3]),
  deviceApiController.recentAttandances
)
route.get(
  "/report",
  authMiddleWare([0, 1, 2, 3]),
  deviceApiController.attendanceReport
)
route.get(
  "/reportStudent",
  authMiddleWare([4]),
  deviceApiController.StudentAttendanceReport
)
route.put("/extendTime", authMiddleWare([2, 3]), deviceApiController.extendTime)

route.post(
  "/markAttendance",

  deviceApiController.MarkAttendence
)
module.exports = route
