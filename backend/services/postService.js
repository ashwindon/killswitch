const {S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { randomUUID } = require('crypto');
const User = require('../models/user_data');
const packageObj = require('../models/package');
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const s3Client = new S3Client({
    region: bucketRegion,
    credentials: {
        accessKeyId: accessKey, 
        secretAccessKey: secretAccessKey
    }
});

//write a service to fetch all published posts regardless of the user
exports.getAllPublishedPostsService = async () => {
    try{
        const posts = await packageObj.find({isPublished: true});
        // for( const p of posts){
        //     const finalContent = [];
        //     const content = p.content;
        //     for(const c of content){
        //         const url = `${process.env.DISTRIBUTION_DOMAIN_NAME}/${c}`
        //         finalContent.push(url);
        //     }
        //     p.content = finalContent;
        // }
        return posts;
    }catch(err){
        console.error(err);
        throw new Error('Internal server error');
    }
};


exports.getAllPublishedPostsByUserIdService = async (userID) => {
    try{
        const posts = await packageObj.find({creator: userID, isPublished: true});
        return posts;
    }catch(err){
        console.error(err);
        throw new Error('Internal server error');
    }
};

exports.getAllUnpublishedPostsByUserIdService = async (userID) => {
    try{
        const posts = await packageObj.find({creator: userID, isPublished: false});
        return posts;
    }catch(err){
        console.error(err);
        throw new Error('Internal server error');
    }
};

exports.getPostByIdService = async (postID) => {
    try{
        const post = await packageObj.findById({_id: postID});

        if(!post){
            throw new Error('Post not found!');
        }
        return post;
        // const finalContent = [];
        // const content = post.content;
        // for(const c of content){
        //     // const getObjectParams = {
        //     //     Bucket: bucketName,
        //     //     Key: c
        //     // };
        //     // const command = new GetObjectCommand(getObjectParams);
        //     // const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        //     const url = `${process.env.DISTRIBUTION_DOMAIN_NAME}/${c}`
        //     finalContent.push(url);
        // }

        // //return post;
        // return {
        //     title: post.title,
        //     description: post.description,
        //     publishDate: post.publishDate,
        //     scheduledPublishDate: post.scheduledPublishDate,
        //     isPublished: post.isPublished,
        //     creator: post.creator,
        //     content: finalContent
        // };
    }catch(err){
        console.error(err);
        throw new Error('Internal server error');
    }
};

exports.createPostService = async (packageDto) => {
    try {
        const { userID, title, description, immediatePublish, scheduledPublishDate, files} = packageDto;
        const newPackage = new packageObj({
            creator: userID,
            title: title,
            description: description,
        });
        if(immediatePublish){
            newPackage.isPublished = true;
            newPackage.publishDate = Date.now();
            newPackage.scheduledPublishDate = Date.now();   
        }else{
            newPackage.isPublished = false;
            newPackage.scheduledPublishDate = scheduledPublishDate;
            newPackage.publishDate = scheduledPublishDate;
        }
        
        const imageName = [];
        const params = files.map((file) => {
            const tempName = `${newPackage._id}/${randomUUID()}-${file.originalname}`;
            imageName.push(tempName);
            return {
                Bucket: bucketName,
                Key: tempName,
                Body: file.buffer
            };
        });
        const finalContent = imageName.map((name) => {
            const url = `${process.env.DISTRIBUTION_DOMAIN_NAME}/${name}`
            return url;
        });
        const result = await Promise.all(params.map(param => s3Client.send(new PutObjectCommand(param))));
        newPackage.content = finalContent;
        console.log(result);
        await newPackage.save();
        return { success: true, result };
    } catch (err) {
        console.error(err);
        throw new Error('Internal server error');
    }
};

exports.deletePostByIdService = async (postID) => {
    try{
        const post = await packageObj.findById({_id: postID});
        if(!post){
            throw new Error('Post not found!');
        }
        const content = post.content;
        const params = content.map((c) => {
            const fileId = c.replace(`${process.env.DISTRIBUTION_DOMAIN_NAME}/`, '');
            return {
                Bucket: bucketName,
                Key: fileId
            };
        }
        );
        const result = await Promise.all(params.map(param => s3Client.send(new DeleteObjectCommand(param))));
        console.log(result);
        await packageObj.deleteOne({_id: postID});
        return {success: true};
    }catch(err){
        console.error(err);
        throw new Error('Internal server error');
    }
};

exports.updatePostByIdService = async (postID, packageDto) => {
    try{
        const {title, description, immediatePublish, scheduledPublishDate, files} = packageDto;
        const post = await packageObj.findById({_id: postID});
        if(!post){
            throw new Error('Post not found!');
        }
        if(title){
            post.title = title;
        }
        if(description){
            post.description = description;
        }
        if(immediatePublish == true){
            post.isPublished = true;
            post.publishDate = Date.now();
            post.scheduledPublishDate = Date.now();
        }
        if(scheduledPublishDate){
            post.isPublished = false;
            post.publishDate = scheduledPublishDate;
            post.scheduledPublishDate = scheduledPublishDate;
        }
        const imageName = [];
        const params = files.map((file) => {
            const tempName = `${post._id}/${randomUUID()}-${file.originalname}`;
            imageName.push(tempName);
            return {
                Bucket: bucketName,
                Key: tempName,
                Body: file.buffer
            };
        });
        const finalContent = imageName.map((name) => {
            const url = `${process.env.DISTRIBUTION_DOMAIN_NAME}/${name}`
            return url;
        });
        const result = await Promise.all(params.map(param => s3Client.send(new PutObjectCommand(param))));
        //write code to append finalContent to the post.content array
        post.content = post.content.concat(finalContent);
        console.log(result);
        await post.save();
        return { success: true, result };
    }catch(err){
        console.error(err);
        throw new Error('Internal server error');
    }
}