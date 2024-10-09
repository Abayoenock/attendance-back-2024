require("dotenv").config()
const bcrypt = require("bcrypt")
const EmailTemplate = require("../lib/emailTemplates/EmailTemplate")
const sendEmail = require("../lib/sendEMAIL")
const studentsModel = require("../models/studentsModel.js")
const { generateStrongPassword } = require("../lib/helperFunctions")
const saltRounds = 10
const {
  studentsSchema,
  EditstudentsSchema,
} = require("../lib/validationShemas.js")
const connectDB = require("../lib/db.js")

// ============ creating account controller
const createAccount = async (req, res) => {
  console.log("reached")

  let profileImage = null

  if (req.file) {
    profileImage = req.file.filename
  }

  const user = req.user.userID

  try {
    const data = studentsSchema.safeParse(req.body)
    if (!data.success) {
      console.log(data.error.flatten())

      return res.status(400).json({ error: data.error.flatten() })
    }
    userData = data.data

    await connectDB()
    const userExists = await studentsModel.find({
      studentReg: userData.studentReg,
    })
    console.log(userExists)

    if (userExists.length > 0) {
      return res.status(409).json({
        error: " A student with that registration number already registered ,",
      })
    }
    const Generatedpassword = generateStrongPassword()
    const password = await bcrypt.hash(Generatedpassword, saltRounds)

    const insertData = {
      ...userData,
      profileImage,
      password,
      user,
    }
    const results = await studentsModel.create(insertData)
    console.log(results)
    res.json({ message: "Account created sucessfully" })
    res.on("finish", () => {
      const emailHtml = EmailTemplate(
        userData.firstname,
        `Your account has been created sucessfuly , You can login to start using the system  <br/><br>
        Email: ${userData.email} <br/><br/>
        password: ${Generatedpassword}
        `
      )
      // send an email
      sendEmail(
        `"${process.env.APPNAME}" <${process.env.EMAIL_ADDRESS}> `,
        userData.email,
        `${process.env.APPNAME}-Account created successfully `,
        emailHtml
      )
    })
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" })
    console.log(err)
  }
}

const getStudents = async (req, res) => {
  try {
    await connectDB()
    const students = await studentsModel.find().populate({
      path: "department",
    })
    return res.status(200).json({ data: students })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal server error" })
  }
}

// get single user
const getSingleStudent = async (req, res) => {
  try {
    const userID = req.params?.userID
    await connectDB()
    const user = await studentsModel.findById(userID).populate({
      path: "department",
    })
    return res.status(200).json({ data: user })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal server error" })
  }
}

// update  profile information
const updateAccount = async (req, res) => {
  console.log("reached")
  const userID = req.params.userID
  let profileImage = null

  if (req.file) {
    profileImage = req.file.filename
  }

  const user = req.user.userID

  try {
    const data = EditstudentsSchema.safeParse(req.body)
    if (!data.success) {
      console.log(data.error.flatten())

      return res.status(400).json({ error: data.error.flatten() })
    }
    userData = data.data

    await connectDB()
    const userExists = await studentsModel.find({
      $and: [
        {
          studentReg: userData.studentReg,
        },
        { _id: { $ne: userID } },
      ],
    })
    console.log(userExists)

    if (userExists.length > 0) {
      return res.status(409).json({
        error: " A student with that registration number already registered ,",
      })
    }

    let insertData = {
      ...userData,
    }
    if (req.file) {
      insertData = { ...insertData, profileImage }
    }
    const results = await studentsModel.findByIdAndUpdate(userID, insertData)
    console.log(results)
    res.json({ message: "Account updated sucessfully" })
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" })
    console.log(err)
  }
}

// delete user from the database

const deleteUser = async (req, res) => {
  try {
    const userID = req.params.userID
    await connectDB()
    const user = await studentsModel.findByIdAndDelete(userID)
    res.status(200).json({ message: "student deleted successfully" })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}
//block or unblock a user from accessing the system
const changeIsBlocked = async (req, res) => {
  try {
    const userID = req.params.userID
    await connectDB()
    const user = await studentsModel.findByIdAndUpdate(
      userID,
      [
        {
          $set: {
            isActive: { $not: "$isActive" },
          },
        },
      ],
      { new: true } // Return the updated document
    )
    if (!user) {
      return res
        .status(404)
        .json({ error: "Student does not exist in the database " })
    }

    res.status(200).json({
      message: `${user.firstname}'s account  has been successfuly ${
        user.isActive == true ? " activated" : "suspended"
      } `,
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}
// request fingerPrint
const fingerPrint = async (req, res) => {
  try {
    const userID = req.params.userID
    await connectDB()
    const usedFingerprints = await studentsModel.find().distinct("fingerPrint")
    const maxFingerprint = 127

    for (let i = 1; i <= maxFingerprint; i++) {
      if (!usedFingerprints.includes(i)) {
        return res.status(200).json({ data: { fingerID: i } })
      }
    }
    res.status(400).json({ error: "Device capacity full " })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal Server Error" })
  }
}

module.exports = {
  createAccount,
  getSingleStudent,
  getStudents,
  deleteUser,
  changeIsBlocked,
  updateAccount,
  fingerPrint,
}
