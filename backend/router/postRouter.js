const multer = require('multer');
const express = require('express');
const router = express.Router();
const postController = require('../controller/postController');
const authMiddleware = require('../middleware/authMiddleware');
//const upload = require('../middleware/postMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//router.post('/createPost', upload.array('files'), postController.createPostController);
router.post('/createPost', [authMiddleware,upload.array('files')], postController.createPostController);
router.get('/getPostById', authMiddleware, postController.getPostByIdController);
router.get('/getAllUnpublishedPostsByUserId', authMiddleware, postController.getAllUnpublishedPostsByUserIdController);
router.get('/getAllPublishedPostsByUserId', authMiddleware, postController.getAllPublishedPostsByUserIdController);
router.delete('/deletePostById', authMiddleware, postController.deletePostByIdController);
router.put('/updatePostById', [authMiddleware,upload.array('files')], postController.updatePostByIdController);
module.exports = router;