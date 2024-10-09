const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `uploads/parents`)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)
  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error("only images with .jpeg, .jpg or .png extensions are allowed"))
  }
}

// Initialize multer middleware with storage configuration and file filter
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
  fileFilter: fileFilter,
})

// Middleware function to handle multiple file uploads with different field names and folders
const uploadMiddleware = (req, res, next) => {
  // Apply the multer upload middleware for multiple fields

  upload.fields([
    { name: "fatherprofileImage", maxCount: 1 },
    { name: "motherprofileImage", maxCount: 1 },
    { name: "guardianProfileImage", maxCount: 1 },
  ])(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Send the error back, e.g., file size limit
      return res.status(400).json({ error: err.message })
    } else if (err) {
      // When other errors occur
      return res.status(500).json({ error: "internal server error" })
    }
    // No errors, continue with the request
    next()
  })
}

module.exports = uploadMiddleware
