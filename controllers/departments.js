require("dotenv").config()

const teachersModel = require("../models/teachersModel.js")
const departmentsModel = require("../models/departmentsModel.js")

const { DepartmentSchema } = require("../lib/validationShemas.js")
const connectDB = require("../lib/db.js")

// ============ creating account controller
const createDepartment = async (req, res) => {
  console.log("reached")
  const user = req.user.userID
  try {
    const data = DepartmentSchema.safeParse(req.body)
    if (!data.success) {
      console.log(data.error.flatten())

      return res.status(400).json({ error: data.error.flatten() })
    }
    userData = data.data

    await connectDB()
    const departmentExists = await departmentsModel.find({
      departmentCode: userData.departmentCode,
    })
    console.log(departmentExists)

    if (departmentExists.length > 0) {
      return res.status(409).json({
        error: " A department with that code already exists ",
      })
    }

    const results = await departmentsModel.create({ ...userData, user })
    console.log(results)
    res.json({ message: "Department sucessfuly added  " })
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" })
    console.log(err)
  }
}

const getDepartments = async (req, res) => {
  try {
    await connectDB()
    const departments = await departmentsModel.find().populate({
      path: "teacher",
    })
    return res.status(200).json({ data: departments })
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

// get single user
const getSingleDepartment = async (req, res) => {
  try {
    const departmentID = req.params?.id
    await connectDB()
    const department = await departmentsModel.findById(departmentID).populate({
      path: "teacher",
    })
    return res.status(200).json({ data: department })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal server error" })
  }
}

// update  department information
const updateDepartment = async (req, res) => {
  const departmentID = req.params.id
  try {
    const data = DepartmentSchema.safeParse(req.body)
    if (!data.success) {
      console.log(data.error.flatten())

      return res.status(400).json({ error: data.error.flatten() })
    }
    userData = data.data

    await connectDB()
    const departmentExists = await departmentsModel.find({
      departmentCode: userData.departmentCode,
      _id: { $ne: departmentID },
    })

    console.log(departmentExists)

    if (departmentExists.length > 0) {
      return res.status(409).json({
        error: " A department with thet code already exists  ",
      })
    }

    const results = await departmentsModel.findByIdAndUpdate(
      departmentID,
      userData
    )
    console.log(results)
    res.json({ message: "Department   updated sucessfully" })
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" })
    console.log(err)
  }
}

// delete department from the database

const deleteDepartment = async (req, res) => {
  try {
    const departmentID = req.params.id
    await connectDB()
    const department = await departmentsModel.findByIdAndDelete(departmentID)
    res.status(200).json({ message: "Department  deleted successfully" })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}

const asignDepartmentToTeacher = async (req, res) => {
  try {
    await connectDB()

    const departmentPreviosData = await departmentsModel
      .findById(req.body.teacher)
      .populate({ path: "teacher" })

    if (departmentPreviosData?.teacher) {
      // update the previos hod role to a teacher
      const updateRole = await teachersModel.findByIdAndUpdate(
        departmentPreviosData.teacher._id,
        { role: 2 }
      )
    }
    const AssignedTeacher = await teachersModel.findByIdAndUpdate(
      req.body.teacher,
      {
        role: 3,
      },
      { new: true }
    )

    const department = await departmentsModel.findByIdAndUpdate(
      req.body.departmentID,
      { teacher: req.body.teacher },
      {
        new: true,
      }
    )
    console.log(department)

    res.status(200).json({
      message: ` ${AssignedTeacher?.firstname}  assigend as the HOD  of the  Department     `,
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}

module.exports = {
  createDepartment,
  updateDepartment,
  asignDepartmentToTeacher,
  deleteDepartment,
  getSingleDepartment,
  getDepartments,
  getTeachers,
}
