const mongoose = require("mongoose")

const attandanceShcema = new mongoose.Schema(
  {
    Identifier: {
      type: String,
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teachers",
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "departments",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "students",
      required: true,
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "modules",
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "classes",
      required: true,
    },
    attended: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const attandance =
  mongoose.models.attandance || mongoose.model("attandance", attandanceShcema)

module.exports = attandance
