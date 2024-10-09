const express = require("express")
const path = require("path")
const cors = require("cors")
const app = express()

require("dotenv").config()

const authRoute = require("./routes/auth.js")
const classesRoute = require("./routes/classes.js")
const modulesRoute = require("./routes/modules.js")
const studentsRoute = require("./routes/students.js")
const teachersRoute = require("./routes/teachers.js")
const analyticsRoute = require("./routes/analytics.js")
const deviceRoute = require("./routes/deviceApi.js")
const departmentsRoute = require("./routes/departments.js")

//use the body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
)

// auth route
app.use("/api/auth", authRoute)

app.use("/api/classes", classesRoute)
app.use("/api/modules", modulesRoute)
app.use("/api/students", studentsRoute)
app.use("/api/teachers", teachersRoute) /
  app.use("/api/analytics", analyticsRoute)
app.use("/api/device", deviceRoute)
app.use("/api/departments", departmentsRoute)

app.get("/", (req, res) => {
  res.send("app listening")
  console.log("app is listening")
})
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

const port = process.env.PORT || process.env.MYPORT
app.listen(port, () => console.log(` Your app is runnnig on port ${port}`))
