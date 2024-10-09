const mongoose = require("mongoose")
// Enable Mongoose debugging
//mongoose.set("debug", true)
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return
  }

  try {
    const db = process.env.DATABASE
    await mongoose.connect(db, {
      serverSelectionTimeoutMS: 20000,
    })

    console.log("MongoDB connected")
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message)
  }
}

// Listen to Mongoose connection events
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to the database")
})

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err.message)
})

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from the database")
})

module.exports = connectDB
