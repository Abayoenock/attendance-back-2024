require("dotenv").config()

const teachersModel = require("../models/teachersModel.js")
const departmentsModel = require("../models/departmentsModel.js")
const classesModel = require("../models/classesModel.js")
const studentsModel = require("../models/studentsModel.js")
const { classesSchema } = require("../lib/validationShemas.js")
const connectDB = require("../lib/db.js")

// ============ creating account controller
const createClass = async (req, res) => {
  console.log("reached")
  const user = req.user.userID

  try {
    const data = classesSchema.safeParse(req.body)
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
    const classExists = await classesModel.find({
      className: Data.className,
    })
    console.log(classExists)

    if (classExists.length > 0) {
      return res.status(409).json({
        error: "A class with tah name already exists",
      })
    }

    const results = await classesModel.create({
      ...Data,
      teacher: user,
      department: department._id,
    })
    console.log(results)
    res.json({ message: "Class sucessfuly created  " })
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" })
    console.log(err)
  }
}

const get_classes = async (req, res) => {
  const user = req.user.userID
  try {
    await connectDB()
    const department = await departmentsModel.findOne({ teacher: user })
    if (!department) {
      return res
        .status(404)
        .json({ error: "You do not have a department assigened to you " })
    }
    const classes = await classesModel.find({ department: department._id })
    return res.status(200).json({ data: classes })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal server error" })
  }
}
const get_classes_assigned = async (req, res) => {
  const user = req.user.userID
  try {
    await connectDB()

    const classes = await classesModel.find({ teachers: { $in: [user] } })
    return res.status(200).json({ data: classes })
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
const updateClass = async (req, res) => {
  const classID = req.params.id
  try {
    const data = classesSchema.safeParse(req.body)
    if (!data.success) {
      console.log(data.error.flatten())

      return res.status(400).json({ error: data.error.flatten() })
    }
    const Data = data.data

    await connectDB()
    const classExists = await classesModel.find({
      className: Data.className,
      _id: { $ne: classID },
    })

    console.log(classExists)

    if (classExists.length > 0) {
      return res.status(409).json({
        error: " A class with that name already exists  ",
      })
    }

    const results = await classesModel.findByIdAndUpdate(classID, Data)
    console.log(results)
    res.json({ message: "class    updated sucessfully" })
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" })
    console.log(err)
  }
}

const deleteClass = async (req, res) => {
  try {
    const classID = req.params.id
    await connectDB()
    const classes = await classesModel.findByIdAndDelete(classID)
    res.status(200).json({ message: "Class  deleted successfully" })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}

const getStudentsByDepartmentAndClass = async (departmentId, classId) => {
  try {
    const students = await studentsModel.aggregate([
      {
        $match: {
          department: departmentId,
        },
      },

      {
        $sort: { firstname: -1 },
      },
    ])

    return students
  } catch (error) {
    console.error("Error fetching students:", error)
    throw error
  }
}

const get_assign_students = async (req, res) => {
  const user = req.user.userID
  const classID = req.params.id
  try {
    await connectDB()
    const department = await departmentsModel.findOne({ teacher: user })
    if (!department) {
      return res
        .status(404)
        .json({ error: "You do not have a department assigened to you " })
    }
    const students = await getStudentsByDepartmentAndClass(
      department._id,
      classID
    )

    return res.status(200).json({ data: students })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal server error" })
  }
}

// assign students to the class

const assignStudentToClass = async (req, res) => {
  try {
    const classID = req.params.id
    const { student, action } = req.body
    await connectDB()

    if (action == "add") {
      const result = await studentsModel.findByIdAndUpdate(
        student,
        {
          $push: { classes: classID },
        },
        { new: true }
      )
      console.log(result)
      res.status(200).json({ message: "Student added to class" })
    } else {
      const result = await studentsModel.findByIdAndUpdate(
        student,
        {
          $pull: { classes: classID },
        },
        { new: true }
      )
      console.log(result)
      res.status(200).json({ message: "Student removed class" })
    }

    res.on("finish", async () => {
      if (action == "add") {
        const result = await classesModel.findByIdAndUpdate(
          classID,
          {
            $push: { students: student },
          },
          { new: true }
        )
        console.log(result)
      } else {
        const result = await classesModel.findByIdAndUpdate(
          classID,
          {
            $pull: { students: student },
          },
          { new: true }
        )
        console.log(result)
      }
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}

module.exports = {
  createClass,
  updateClass,

  deleteClass,
  get_classes_assigned,
  getTeachers,
  get_classes,
  get_assign_students,
  assignStudentToClass,
}
