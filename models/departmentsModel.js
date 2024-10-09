const mongoose = require("mongoose")

const departmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    departmentCode: {
      type: String,
      required: true,
    },
    departmentName: {
      type: String,
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teachers",
      required: false,
    },
  },
  { timestamps: true }
)

const departments =
  mongoose.models.departments || mongoose.model("departments", departmentSchema)

module.exports = departments
