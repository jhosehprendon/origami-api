const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    ownerBusiness: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Business'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Activity = mongoose.model('Activity', activitySchema)

module.exports = Activity