require("dotenv").config()
const bcrypt = require("bcrypt")
const EmailTemplate = require("../lib/emailTemplates/EmailTemplate.js")
const sendEmail = require("../lib/sendEMAIL.js")
const teachersModel = require("../models/teachersModel.js")
const { generateStrongPassword } = require("../lib/helperFunctions.js")
const saltRounds = 10
const { teachersSchema } = require("../lib/validationShemas.js")
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
    const data = teachersSchema.safeParse(req.body)
    if (!data.success) {
      console.log(data.error.flatten())

      return res.status(400).json({ error: data.error.flatten() })
    }
    userData = data.data

    await connectDB()
    const userExists = await teachersModel.find({
      email: userData.email,
    })
    console.log(userExists)

    if (userExists.length > 0) {
      return res.status(409).json({
        error: " A teacher with that email address already exists ,",
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
    const results = await teachersModel.create(insertData)
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

const getTeachers = async (req, res) => {
  try {
    await connectDB()
    const teachers = await teachersModel.find().populate({
      path: "modules classes",
    })
    return res.status(200).json({ data: teachers })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal server error" })
  }
}

// get single user
const getSingleTeacher = async (req, res) => {
  try {
    const userID = req.params?.userID
    await connectDB()
    const user = await teachersModel.findById(userID).populate({
      path: "modules classes",
    })
    return res.status(200).json({ data: user })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal server error" })
  }
}

// update  profile information
const updateAccount = async (req, res) => {
  const userID = req.params.userID
  let profileImage = null

  if (req.file) {
    profileImage = req.file.filename
  }

  const user = req.user.userID

  try {
    const data = teachersSchema.safeParse(req.body)
    if (!data.success) {
      console.log(data.error.flatten())

      return res.status(400).json({ error: data.error.flatten() })
    }
    userData = data.data

    await connectDB()
    const userExists = await teachersModel.find({
      $and: [
        {
          email: userData.email,
        },
        { _id: { $ne: userID } },
      ],
    })
    console.log(userExists)

    if (userExists.length > 0) {
      return res.status(409).json({
        error: " A teacher with that email address already exists ,",
      })
    }

    let insertData = {
      ...userData,
    }
    if (req.file) {
      insertData = { ...insertData, profileImage }
    }
    const results = await teachersModel.findByIdAndUpdate(userID, insertData)
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
    const user = await teachersModel.findByIdAndDelete(userID)
    res.status(200).json({ message: "Teacher deleted successfully" })
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
    const user = await teachersModel.findByIdAndUpdate(
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
        .json({ error: "Teacher does not exist in the database " })
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

module.exports = {
  createAccount,
  getSingleTeacher,
  getTeachers,
  deleteUser,
  changeIsBlocked,
  updateAccount,
}
