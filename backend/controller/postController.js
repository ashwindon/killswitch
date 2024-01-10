const postService = require('../services/postService.js');
exports.createPostController = async (req, res) => {
    try {        
        const { title, description, immediatePublish, scheduledPublishDate } = req.body;
        const files = req.files;
        const userID = req.session.userID;
        //console.log("req.body: ", req.body);
        console.log("req.files: ", req.files);
        console.log("title: ", title);
        console.log("description: ", description);
        console.log("immediatePublish: ", immediatePublish);
        // Validate input
        if (!title || !description) {
            return res.status(400).json({ message: 'Title, description and tags are required' });
        }
        
        // Call the postService to handle the business logic
        const postDto = await postService.createPostService({ userID, title, description, immediatePublish, scheduledPublishDate, files });
        // Send a success response
        return res.status(200).json({
            message: 'Post created successfully',
            success: true,
            post: postDto
        });
    } catch (error) {
        // Error handling
        console.error('Post creation error:', error);
        return res.status(500).json({ message: error.message });
    }
};

//write a controller to get all the published posts
exports.getAllPublishedPostsByUserIdController = async (req, res) => {
    try {
        // Call the postService to handle the business logic
        const postsDto = await postService.getAllPublishedPostsByUserIdService(req.session.userID);
        // Send a success response
        return res.status(200).json({
            message: 'Published Posts fetched successfully',
            success: true,
            posts: postsDto
        });
    } catch (error) {
        // Error handling
        console.error('Post fetching error:', error);
        return res.status(500).json({ message: error.message });
    }
};

//write a controller to get all the posts
exports.getAllUnpublishedPostsByUserIdController = async (req, res) => {
    try {
        // Call the postService to handle the business logic
        const postsDto = await postService.getAllUnpublishedPostsByUserIdService(req.session.userID);
        // Send a success response
        return res.status(200).json({
            message: 'Unpublished Posts fetched successfully',
            success: true,
            posts: postsDto
        });
    } catch (error) {
        // Error handling
        console.error('Post fetching error:', error);
        return res.status(500).json({ message: error.message });
    }
};
//write a controller to get a post by id
exports.getPostByIdController = async (req, res) => {
    try {
        const id = req.query.id;
        // Call the postService to handle the business logic
        const postDto = await postService.getPostByIdService(id);
        // Send a success response
        return res.status(200).json({
            message: 'Post fetched successfully',
            success: true,
            post: postDto
        });
    } catch (error) {

        // Error handling
        console.error('Post fetching error:', error);
        return res.status(500).json({ message: error.message });
    }
}

exports.deletePostByIdController = async (req, res) => {
    try {
        const id = req.query.id;
        // Call the postService to handle the business logic
        const postDto = await postService.deletePostByIdService(id);
        // Send a success response
        return res.status(200).json({
            message: 'Post deleted by id successfully',
            success: true
        });
    } catch (error) {

        // Error handling
        console.error('Post fetching error:', error);
        return res.status(500).json({ message: error.message });
    }
}

exports.updatePostByIdController = async (req, res) => {
    try {
        const id = req.query.id;
        const { title, description, immediatePublish, scheduledPublishDate } = req.body;
        const files = req.files;
        // Call the postService to handle the business logic
        const postDto = await postService.updatePostByIdService(id, { title, description, immediatePublish, scheduledPublishDate, files });
        // Send a success response
        return res.status(200).json({
            message: 'Post updated by id successfully',
            success: true
        });
    } catch (error) {

        // Error handling
        console.error('Post fetching error:', error);
        return res.status(500).json({ message: error.message });
    }
}