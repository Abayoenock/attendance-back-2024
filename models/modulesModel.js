const mongoose = require("mongoose")

const modulesSchema = new mongoose.Schema(
  {
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
    moduleCode: {
      type: String,
      required: true,
    },
    moduleTitle: {
      type: String,
      required: true,
    },
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "classes" }],
    teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: "teachers" }],
  },
  { timestamps: true }
)

const modules =
  mongoose.models.modules || mongoose.model("modules", modulesSchema)

module.exports = modules
