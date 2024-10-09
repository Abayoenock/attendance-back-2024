require("dotenv").config()

const teachersModel = require("../models/teachersModel.js")
const departmentsModel = require("../models/departmentsModel.js")
const classesModel = require("../models/classesModel.js")
const studentsModel = require("../models/studentsModel.js")
const modulesModel = require("../models/modulesModel.js")
const { modulesSchema } = require("../lib/validationShemas.js")
const connectDB = require("../lib/db.js")

// ============ creating account controller
const createModule = async (req, res) => {
  console.log("reached")
  const user = req.user.userID

  try {
    const data = modulesSchema.safeParse(req.body)
    if (!data.success) {
      console.log(data.error.flatten())

      return res.status(400).json({ error: data.error.flatten() })
    }
    const Data = data.data

    await connectDB()

    const department = await departmentsModel.findOne({ teacher: user })
    if (!department) {
      return res
        .status(404)
        .json({ error: "You do not have a department assigened to you " })
    }
    const moduleExists = await modulesModel.find({
      moduleCode: Data.moduleCode,
    })
    console.log(moduleExists)

    if (moduleExists.length > 0) {
      return res.status(409).json({
        error: "A module with that code already exists",
      })
    }

    const results = await modulesModel.create({
      ...Data,
      teacher: user,
      department: department._id,
    })
    console.log(results)
    res.json({ message: "Module created succesfuly  " })
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" })
    console.log(err)
  }
}

const get_Modules = async (req, res) => {
  const user = req.user.userID
  try {
    await connectDB()
    const department = await departmentsModel.findOne({ teacher: user })
    if (!department) {
      return res
        .status(404)
        .json({ error: "You do not have a department assigened to you " })
    }
    const modules = await modulesModel
      .find({ department: department._id })
      .populate({ path: "classes teachers" })
    return res.status(200).json({ data: modules })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal server error" })
  }
}

const get_Modules_assigned = async (req, res) => {
  const user = req.user.userID
  const classID = req.params.classID
  console.log(classID)

  try {
    await connectDB()
    const teacher = await teachersModel.findOne({ _id: user })
    const modulesAssigned = teacher?.modules
    const modules = await classesModel.findById(classID)

    const modulesas = modules?.modules?.filter((module) =>
      modulesAssigned?.includes(module)
    )

    const TeacherModules = await modulesModel.find({ _id: { $in: modulesas } })
    return res.status(200).json({ data: TeacherModules })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal server error" })
  }
}
const get_class_modules = async (req, res) => {
  const user = req.user.userID
  const classID = req.params.classID
  console.log(classID)

  try {
    await connectDB()

    const TeacherModules = await modulesModel.find({
      classes: { $in: classID },
    })
    return res.status(200).json({ data: TeacherModules })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal server error" })
  }
}
const getTeachers = async (req, res) => {
  try {
    await connectDB()
    const teachers = await teachersModel.find()
    return res.status(200).json({ data: teachers })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal server error" })
  }
}

// update  department information
const updateModule = async (req, res) => {
  const moduleID = req.params.id
  try {
    const data = modulesSchema.safeParse(req.body)
    if (!data.success) {
      console.log(data.error.flatten())

      return res.status(400).json({ error: data.error.flatten() })
    }
    const Data = data.data

    await connectDB()
    const moduleExists = await modulesModel.find({
      moduleCode: Data.moduleCode,
      _id: { $ne: moduleID },
    })

    console.log(moduleExists)

    if (moduleExists.length > 0) {
      return res.status(409).json({
        error: " A modeule with taht code already exists  ",
      })
    }

    const results = await modulesModel.findByIdAndUpdate(moduleID, Data)
    console.log(results)
    res.json({ message: "Module updated successfuly" })
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" })
    console.log(err)
  }
}

const deleteModule = async (req, res) => {
  try {
    const moduleID = req.params.id
    await connectDB()
    const module = await modulesModel.findByIdAndDelete(moduleID)
    res.status(200).json({ message: "Module successfuly deleted " })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}

const assignModule = async (req, res) => {
  try {
    const moduleID = req.params.id
    const { classId, teacher } = req.body

    await connectDB()
    const module = await modulesModel.updateOne(
      { _id: moduleID },
      { $addToSet: { classes: classId, teachers: teacher } },
      { new: true }
    )
    console.log(module)

    const classes = await classesModel.updateOne(
      { _id: classId },
      { $addToSet: { modules: moduleID, teachers: teacher } },
      { new: true }
    )

    console.log(classes)
    const teachers = await teachersModel.updateOne(
      { _id: teacher },
      { $addToSet: { modules: moduleID, classes: classId } },
      { new: true }
    )
    console.log(teachers)
    res
      .status(200)
      .json({ message: "Module successfuly assigned to a class and teacher" })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}

module.exports = {
  createModule,
  updateModule,
  deleteModule,
  get_Modules,
  getTeachers,
  assignModule,
  get_Modules_assigned,
  get_class_modules,
}
