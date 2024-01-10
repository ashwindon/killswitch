import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const post
try{
    upload.array('files');
}catch (error) {
    console.error('Multer upload files error:', error);
    return res.status(500).json({ message: error.message });
}
module.exports = upload;