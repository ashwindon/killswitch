const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_data',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    scheduledPublishDate: {
        type: Date,
    },
    // ... other fields as needed
});

module.exports = mongoose.model('package', packageSchema);
