const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `uploads/students`)
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
    cb(new Error("only images with .jpeg, .jpg or png extensions are  allowed"))
  }
}
// initialize multer midleware with storage configuration and  file filter
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
  fileFilter: fileFilter,
})

// middlweare function to handle file uploads

const uploadMiddleware = (req, res, next) => {
  // apply the multer upload middleware
  upload.single("profileImage")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      //send the error back ex file size limit
      return res.status(400).json({ error: err.message })
    }
    // when other errors occur
    else if (err) {
      return res.status(500).json({ error: `internal servor error ` })
    }
    // no errrs , continue with the request
    next()
  })
}

module.exports = uploadMiddleware
