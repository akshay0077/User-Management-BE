import multer from "multer";

// Storage configuration
const storage = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,"./uploads")
    },
    filename:(req,file,callback)=>{
        const filename = `image-${Date.now()}.${file.originalname}`
        callback(null,filename)
    }
});

// File filter to allow only specific image formats
const filefilter = (req,file,callback)=>{
    const allowedMimeTypes = ["image/png", "image/jpg", "image/jpeg"];

    if (allowedMimeTypes.includes(file.mimetype)) {
        callback(null, true);
    } 
    else {
        callback(null, false);
        return callback(new Error("Only .png, .jpg, and .jpeg formats are allowed"));
    }
}

// Multer upload configuration

const upload = multer({
    storage:storage,
    fileFilter:filefilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // Limit file size to 5MB
    }
});

export default upload;