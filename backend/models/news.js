const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    package: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'package',
        required: true
    },
    publishDate: {
        type: Date,
        default: Date.now
    },
    // ... other fields as needed
});

module.exports = mongoose.model('news', newsSchema);
