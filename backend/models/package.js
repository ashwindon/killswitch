const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_data',
        required: true
    },
    content: {
        type: [String],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    scheduledPublishDate: {
        type: Date,
    },
    publishDate: {
        type: Date,
        default: Date.now
    },
    isPublished: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model('package', packageSchema);
