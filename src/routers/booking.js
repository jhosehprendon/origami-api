const express = require('express');
const Booking = require('../models/booking');
const Activity = require('../models/activity');
const auth = require('../middleware/auth');

const router = new express.Router();


//////// BOOKING ROUTES ////////

router.post('/booking/:activityId', auth, async (req, res) => {
    const activity = await Activity.findOne({ _id: req.params.activityId, owner: req.user._id }) 
    const booking = new Booking({
        date: activity.date,
        time: activity.time,
        place: activity.place,
        ownerActivity: req.params.activityId,
        owner: req.user._id
    })

    try {
        await booking.save()
        res.status(201).send(booking)
    } catch(e) {
        res.status(400).send(err)
    }

})

module.exports = router