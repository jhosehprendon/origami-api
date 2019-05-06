const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    status: {
        type: String,
        default: 'open'
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
    ownerActivity: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Activity'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Booking = mongoose.model('Booking', bookingSchema)

module.exports = Booking