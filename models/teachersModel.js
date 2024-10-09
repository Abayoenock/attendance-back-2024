const mongoose = require("mongoose")
const modules = require("./modulesModel")
const classes = require("./classesModel")
const teachersSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users_prison",
      required: false,
    },
    email: {
      type: String,
      required: true,
      message: "Email is required and must be a string",
    },
    phone: {
      type: String,
      required: true,
      message: "Phone number is required ",
    },

    firstname: {
      type: String,
      required: true,
      message: " Firstname must be a string",
    },
    NID: {
      type: String,
      required: true,
      message: " NationalID",
    },
    lastname: {
      type: String,
      required: true,
      message: " Lastname must be a string",
    },
    password: {
      type: String,
      required: true,
      message: "Password is required ",
    },
    profileImage: {
      type: String,
      message: "Profile image must be a string or null",
    },
    role: {
      type: Number,
      default: 2,
    },

    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: "modules" }],
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "classes" }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

const teachers =
  mongoose.models.teachers || mongoose.model("teachers", teachersSchema)

module.exports = teachers
