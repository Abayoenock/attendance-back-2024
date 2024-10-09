const createMqttClient = require("../lib/MqttClient.js")
require("dotenv").config()
const connectDB = require("../lib/db.js")
const studentsModel = require("../models/studentsModel.js")
const classesModel = require("../models/classesModel.js")
const attendanceModel = require("../models/attendance.js")
const logger = require("../lib/logger.js")
const sendEmail = require("../lib/sendEMAIL.js")
const sendSMS = require("../lib/sendSMS.js")
const emailTemplate = require("../lib/emailTemplates/escapeEmailTemplate.js")
const getCurrentDateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0") // Months are zero-based
  const day = String(now.getDate()).padStart(2, "0")
  const hours = String(now.getHours()).padStart(2, "0")
  const minutes = String(now.getMinutes()).padStart(2, "0")

  return `${year}-${month}-${day} ${hours}:${minutes}`
}
const startServer = async () => {
  await connectDB()
  const messageHandler = async (topic, message) => {
    try {
      console.log(topic, message)
    } catch (err) {
      console.error(`MongoDB insert error: ${err}`)
      logger.error(err)
    }
  }

  const { client, publishMessage } = createMqttClient(
    ["STUDENTS_ATTENDANCE"],
    messageHandler
  )
  global.publishMessage = publishMessage
}
// insert the data in the database

// const InsertData = async (req, res) => {
//   try {
//     await connectDB()
//     const { fingerID, deviceSN } = req.body
//     const student = await studentsModel
//       .findOne({ fingerPrint: fingerID })
//       .populate({
//         path: "guardian",
//         select: "email  guardianPhone  busStop ",
//       })
//     const bus = await busModel.findOne({ deviceSN })
//     const trip = await tripsModel.findOne({ bus, status: { $ne: "completed" } })
//     if (!trip) {
//       return res.json({ error: "No current trips available" })
//     }
//     // check if the bus is not full
//     if (trip.students.length >= bus.seats) {
//       return res.json({ error: "bus full" })
//     }

//     // check if the child has already boarded
//     const exists = await tripsBoardModel.findOne({
//       trip: trip._id,
//       student: student._id,
//     })
//     console.log(exists)

//     if (exists) {
//       return res.json({ error: "Student is aready in the bus " })
//     }

//     const tripBoard = await tripsBoardModel.create({
//       student: student._id,
//       trip: trip._id,
//       busStop: student.guardian.busStop,
//     })
//     console.log(tripBoard)

//     res.json({ message: "Student entered the bus " })

//     res.on("finish", async () => {
//       publishMessage("STUDENT_IN", JSON.stringify({ sucess: true }))
//       const result = await tripsModel.findByIdAndUpdate(
//         trip._id,
//         {
//           $push: { tripBoards: tripBoard._id, students: student._id },
//         },
//         { new: true }
//       )
//       console.log(result)
//     })
//   } catch (err) {
//     console.log(err)
//   }
// }

const startAttendance = async (req, res) => {
  try {
    await connectDB()
    const user = req.user.userID
    const { classId, module, endTime } = req.body

    const classData = await classesModel.findById(classId)
    const students = classData.students
    const uniqueName = getCurrentDateTime()
    students.forEach(async (student) => {
      const insertData = await attendanceModel.create({
        Identifier: uniqueName,
        teacher: user,
        department: classData.department,
        student,
        module,
        class: classId,
      })
      console.log(insertData)
    })
    console.log(students)

    res.status(200).json({ message: "Attendance Initiated" })

    res.on("finish", async () => {
      publishMessage(
        "START_ATTENDANCE",
        JSON.stringify({
          class: classId,
          module: module,
          endTime: endTime,
          identifier: uniqueName,
        })
      )
    })
  } catch (err) {
    console.log(err)
  }
}
const extendTime = async (req, res) => {
  try {
    const extendInfo = req.body
    publishMessage("START_ATTENDANCE", JSON.stringify(extendInfo))
    res.status(200).json({ message: "Attendance Extended by Five minutes " })
  } catch (err) {
    res.status(500).json({ error: "Internal server Error " })
  }
}

const recentAttandances = async (req, res) => {
  try {
    await connectDB()
    const user = req.user.userID
    const result = await attendanceModel
      .distinct("Identifier")
      .where({ teacher: user })

    const mappedData = await Promise.all(
      result.map(async (identifier) => {
        const attendedCount = await attendanceModel.countDocuments({
          Identifier: identifier,
          attended: true,
        })

        const notAttendedCount = await attendanceModel.countDocuments({
          Identifier: identifier,
          attended: false,
        })

        const details = await attendanceModel
          .findOne({
            Identifier: identifier,
          })
          .populate({ path: "module class", select: " className moduleCode " })

        return {
          identifier,
          attended: attendedCount,
          notAttended: notAttendedCount,
          classData: details.class,
          module: details.module,
        }
      })
    )

    console.log(mappedData)
    res.status(200).json({ data: mappedData })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Internal Server Error" })
  }
}

const attendanceReport = async (req, res) => {
  const { classId, moduleId } = req.query
  try {
    await connectDB()
    const attendanceData = await attendanceModel
      .find({
        class: classId,
        module: moduleId,
      })
      .populate({
        path: "student module",
        select: " firstname lastname  studentReg moduleCode",
      })

    res.status(200).json({ data: attendanceData })
  } catch (error) {
    console.error("Error fetching attendance data:", error)
    throw error
  }
}

const StudentAttendanceReport = async (req, res) => {
  const { classId, moduleId } = req.query
  const user = req.user.userID
  try {
    await connectDB()
    const attendanceData = await attendanceModel
      .find({
        class: classId,
        module: moduleId,
        student: user,
      })
      .populate({
        path: "student module",
        select: " firstname lastname  studentReg moduleCode",
      })

    res.status(200).json({ data: attendanceData })
  } catch (error) {
    console.error("Error fetching attendance data:", error)
    throw error
  }
}

// const mark attendance

const MarkAttendence = async (req, res) => {
  let { identifier, fingerID, card } = req.body
  console.log(req.body)
  if (card == "none") {
    card = "not Available"
  }
  try {
    await connectDB()
    // find the student by card or fingerprint
    const student = await studentsModel.findOne({
      $or: [{ cardID: card }, { fingerPrint: fingerID }],
    })
    console.log(student)
    if (!student) {
      return res.json({ error: "Student Not Found " })
    }

    const attendanceData = await attendanceModel
      .findOne({
        Identifier: identifier,
        student: student._id,
      })
      .populate({ path: "student" })
    if (!attendanceData) {
      return res.json({ error: "Wrong Class" })
    }
    if (attendanceData.attended) {
      return res.json({ error: "Already attended" })
    }
    const update = await attendanceModel.findByIdAndUpdate(attendanceData._id, {
      attended: true,
    })

    res.status(200).json({ message: attendanceData?.student?.firstname })
  } catch (error) {
    console.error("Error fetching attendance data:", error)
    throw error
  }
}

module.exports = {
  startServer,
  startAttendance,
  recentAttandances,
  extendTime,
  attendanceReport,
  StudentAttendanceReport,
  MarkAttendence,
}
