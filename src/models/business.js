const mongoose = require('mongoose');
// const Activity = require('./activity')

const businessSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

// userSchema.virtual('activities', {
//     ref: 'Activity',
//     localField: '_id',
//     foreignField: 'owner'
// })

const Business = mongoose.model('Business', businessSchema)

module.exports = Business