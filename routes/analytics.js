const { Router } = require("express")
const route = Router()
const authMiddleware = require("../middlewares/authMiddleware.js")
const analyticsController = require("../controllers/analytics")
route.get("/", authMiddleware([0, 1]), analyticsController.analyticsDashboard)

module.exports = route
