import multer from 'multer';
// Configure multer for memory storage
const storage = multer.memoryStorage();
// File filter
const fileFilter = (req, file, cb) => {
    // Allowed MIME types
    const allowedMimes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'video/mp4',
        'video/mpeg',
        'video/quicktime',
        'audio/mpeg',
        'audio/mp3',
        'audio/wav',
        'application/pdf',
    ];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error(`File type ${file.mimetype} is not allowed`));
    }
};
// Configure multer
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB
    },
});
// Single file upload middleware
export const uploadSingle = upload.single('file');
// Multiple files upload middleware
export const uploadMultiple = upload.array('files', 10);
//# sourceMappingURL=upload.js.map