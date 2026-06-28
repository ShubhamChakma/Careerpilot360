import multer from 'multer';

// Use memory storage for quick serverless-friendly uploads and parser access
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'text/plain',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'application/msword' // DOC
  ];

  if (allowedMimeTypes.includes(file.mimetype) || file.originalname.endsWith('.pdf') || file.originalname.endsWith('.docx') || file.originalname.endsWith('.txt')) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOCX, and TXT files are accepted for scanning.'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB limit
  },
  fileFilter
});

export default upload;
