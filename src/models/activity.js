const mongoose = require('mongoose');
const Booking = require('./booking');

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

activitySchema.virtual('booking', {
    ref: 'Booking',
    localField: '_id',
    foreignField: 'ownerActivity'
})

// Deletes user businesses when user is removed
activitySchema.pre('findOneAndDelete', async function(next) {
    const activity = this
    console.log(activity._conditions._id)
    await Booking.deleteMany({ ownerActivity: activity._conditions._id })

    next()
})

const Activity = mongoose.model('Activity', activitySchema)

module.exports = Activity