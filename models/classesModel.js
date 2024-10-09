const mongoose = require("mongoose")

const classesSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teachers",
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    className: {
      type: String,
      required: true,
      message: " class name is required",
    },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "students" }],
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: "modules" }],
    teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: "teachers" }],
  },
  { timestamps: true }
)

const classes =
  mongoose.models.classes || mongoose.model("classes", classesSchema)

module.exports = classes
