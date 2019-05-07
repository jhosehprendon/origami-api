const mongoose = require('mongoose');
const Activity = require('./activity')

const businessSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
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

businessSchema.virtual('activity', {
    ref: 'Activity',
    localField: '_id',
    foreignField: 'ownerBusiness'
})

businessSchema.virtual('booking', {
    ref: 'Booking',
    localField: '_id',
    foreignField: 'ownerBusiness'
})

businessSchema.pre('findOneAndDelete', async function(next) {
    const business = this

    await Activity.deleteMany({ businessOwner: business._id })

    next()
})

const Business = mongoose.model('Business', businessSchema)

module.exports = Business