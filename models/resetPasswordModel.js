const mongoose = require("mongoose")
const passwordResetSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      message: "User ID is required and must reference a valid user",
    },
    resetToken: {
      type: String,
      required: true,
      message: "Reset token is required and must be a string",
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      message: "Expiration date is required and must be a valid date",
    },
    accountType: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
)

const passwordResets =
  mongoose.models.passwordResets ||
  mongoose.model("passwordResets", passwordResetSchema)

module.exports = passwordResets
