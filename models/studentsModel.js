const mongoose = require("mongoose")

const studentsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    studentReg: {
      type: String,
      required: true,
      message: " Student resgistration Number is required is required ",
    },
    firstname: {
      type: String,
      required: true,
      message: " Firstname must be a string",
    },

    lastname: {
      type: String,
      required: true,
      message: " Lastname must be a string",
    },
    fingerPrint: {
      type: Number,
      required: false,
    },
    cardID: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      enum: ["Female", "Male"],
    },
    DOB: {
      type: Date,
    },
    profileImage: {
      type: String,
      message: "Profile image must be a string or null",
    },
    email: {
      type: String,
      message: "Email is required",
    },
    password: {
      type: String,
      message: "Password is required",
    },
    phone: {
      type: String,
      message: "Email is required",
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "departments",
      required: true,
    },

    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "classes" }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const students =
  mongoose.models.students || mongoose.model("students", studentsSchema)

module.exports = students
