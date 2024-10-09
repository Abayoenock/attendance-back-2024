require("dotenv").config()

const guardiansModel = require("../models/guardiansModel")
const RwandaModel = require("../models/RwandaModel.js")
const studentsModel = require("../models/studentsModel.js")
const { guardianSchema } = require("../lib/validationShemas.js")
const { generateStrongPassword } = require("../lib/helperFunctions")
const connectDB = require("../lib/db.js")
const EmailTemplate = require("../lib/emailTemplates/EmailTemplate")
const sendEmail = require("../lib/sendEMAIL")
const bcrypt = require("bcrypt")
const saltRounds = 10
// ============ creating account controller
const createAccount = async (req, res) => {
  console.log("reached")

  let fatherprofileImage = null
  let motherprofileImage = null
  let guardianProfileImage = null
  console.log(req.files)

  if (req.files) {
    if (req.files.fatherprofileImage) {
      fatherprofileImage = req.files.fatherprofileImage[0].filename
    }
    if (req.files.motherprofileImage) {
      motherprofileImage = req.files.motherprofileImage[0].filename
    }
    if (req.files.guardianProfileImage) {
      guardianProfileImage = req.files.guardianProfileImage[0].filename
    }
  }

  const user = req.user.userID

  try {
    const data = guardianSchema.safeParse(req.body)
    if (!data.success) {
      console.log(data.error.flatten())

      return res.status(400).json({ error: data.error.flatten() })
    }
    userData = data.data

    await connectDB()
    const userExists = await guardiansModel.find({
      $and: [
        { fathersNID: userData.fathersNID },
        { mothersNID: userData.mothersNID },
        { guardiansNID: userData.guardiansNID },
      ],
    })
    console.log(userExists)

    if (userExists.length > 0) {
      return res.status(409).json({
        error: " A guardian with that id  is already registered ,",
      })
    }

    const { province, district, sector, cell, village } = userData

    const address = await RwandaModel.findOne({
      province,
      district,
      sector,
      cell,
      village,
    })
    console.log(address)
    const Generatedpassword = generateStrongPassword()
    const password = await bcrypt.hash(Generatedpassword, saltRounds)
    const insertData = {
      ...userData,
      fatherprofileImage,
      motherprofileImage,
      guardianProfileImage,
      password,
      user,
      address: address._id,
    }
    const results = await guardiansModel.create(insertData)
    console.log(results)
    res.json({ message: "Account created sucessfully" })
    res.on("finish", () => {
      const emailHtml = EmailTemplate(
        userData.guardianNames,
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

const getGuardians = async (req, res) => {
  try {
    await connectDB()
    const guardian = await guardiansModel.find().populate({
      path: "students",
    })
    return res.status(200).json({ data: guardian })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal server error" })
  }
}

// get single user
const getSingleGuardian = async (req, res) => {
  try {
    const userID = req.params?.userID
    await connectDB()
    const user = await guardiansModel
      .findById(userID)
      .populate({
        path: "students",
      })
      .populate({ path: "address" })
    return res.status(200).json({ data: user })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal server error" })
  }
}

// use by the guarians dashboard to get the profile information
const getGuardianProfile = async (req, res) => {
  try {
    const userID = req.user.userID
    await connectDB()
    const user = await guardiansModel
      .findById(userID)
      .populate({
        path: "students",
      })
      .populate({ path: "address" })
    return res.status(200).json({ data: user })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal server error" })
  }
}
// update the guardians busstop
const updateGuardianBusStop = async (req, res) => {
  try {
    const userID = req.user.userID
    await connectDB()
    const user = await guardiansModel.findByIdAndUpdate(userID, {
      busStop: req.body,
    })

    return res
      .status(200)
      .json({ message: "Bus stop cordinates has been sucessfuly Updated" })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal server error" })
  }
}
// update  profile information
const updateAccount = async (req, res) => {
  console.log("reached")

  let fatherprofileImage = null
  let motherprofileImage = null
  let guardianProfileImage = null
  console.log(req.files)
  const userID = req.params.userID

  if (req.files) {
    if (req.files.fatherprofileImage) {
      fatherprofileImage = req.files.fatherprofileImage[0].filename
    }
    if (req.files.motherprofileImage) {
      motherprofileImage = req.files.motherprofileImage[0].filename
    }
    if (req.files.guardianProfileImage) {
      guardianProfileImage = req.files.guardianProfileImage[0].filename
    }
  }

  const user = req.user.userID

  try {
    const data = guardianSchema.safeParse(req.body)
    if (!data.success) {
      console.log(data.error.flatten())

      return res.status(400).json({ error: data.error.flatten() })
    }
    userData = data.data

    await connectDB()
    const userExists = await guardiansModel.find({
      $and: [
        { fathersNID: userData.fathersNID },
        { mothersNID: userData.mothersNID },
        { guardiansNID: userData.guardiansNID },
        { _id: { $ne: userID } },
      ],
    })
    console.log(userExists)

    if (userExists.length > 0) {
      return res.status(409).json({
        error: " A guardian with that information   is already registered ,",
      })
    }

    const { province, district, sector, cell, village } = userData

    const address = await RwandaModel.findOne({
      province,
      district,
      sector,
      cell,
      village,
    })
    console.log(address)

    let insertData = {
      ...userData,

      user,
      address: address._id,
    }
    if (fatherprofileImage) {
      insertData = { ...insertData, fatherprofileImage }
    }
    if (motherprofileImage) {
      insertData = { ...insertData, motherprofileImage }
    }
    if (guardianProfileImage) {
      insertData = { ...insertData, guardianProfileImage }
    }

    const results = await guardiansModel.findByIdAndUpdate(userID, insertData)
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
    const user = await guardiansModel.findByIdAndDelete(userID)
    res.status(200).json({ message: "Guardian deleted successfully" })
    // res.on("finish", async () => {
    //   // perfoms deletes in other tables when the delete was sucessful
    //   await resetPasswordModel.deleteMany({ userID: userID })
    //   console.log("deleting user from the database")
    // })
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
    const user = await guardiansModel.findByIdAndUpdate(
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
        .json({ error: "Guardian does not exist in the database " })
    }

    res.status(200).json({
      message: `${user.guardianNames}'s account  has been successfuly ${
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
  getSingleGuardian,
  getGuardians,
  deleteUser,
  changeIsBlocked,
  updateAccount,
  getGuardianProfile,
  updateGuardianBusStop,
}
