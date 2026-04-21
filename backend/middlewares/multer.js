import multer from "multer";

// Storage config
const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    const uniqueName = Date.now() + "-" + file.originalname;
    callback(null, uniqueName);
  },
});

// File filter (only allow images + PDF)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only Images and PDF files are allowed"), false);
  }
};

// Multer config
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default upload;