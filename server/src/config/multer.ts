import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Specify folder to store files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname); // Give unique filename
    },
});

export const upload = multer({ storage: storage });
