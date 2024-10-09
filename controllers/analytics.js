const usersModel = require("../models/usersModel.js")
const studentsModel = require("../models/studentsModel")
const connectDB = require("../lib/db")
const departmentModel = require("../models/departmentsModel.js")
const classesModel = require("../models/classesModel.js")
const teachersModel = require("../models/teachersModel.js")
const modulesModel = require("../models/modulesModel.js")
const analyticsDashboard = async (req, res) => {
  try {
    await connectDB()

    const totalStudents = await studentsModel.countDocuments({})
    const totalTeachers = await teachersModel.countDocuments({})
    const totalStaff = await usersModel.countDocuments({})
    const totalDepartments = await departmentModel.countDocuments({})
    const totalClasses = await classesModel.countDocuments({})
    const totalModules = await modulesModel.countDocuments({})
    res.json({
      totalStudents,
      totalTeachers,
      totalStaff,
      totalDepartments,
      totalClasses,
      totalModules,
    })
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  analyticsDashboard,
}
