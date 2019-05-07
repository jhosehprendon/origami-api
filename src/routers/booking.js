const express = require('express');
const Booking = require('../models/booking');
const Activity = require('../models/activity');
const Child = require('../models/child')
const auth = require('../middleware/auth');
const checkBusiness = require('../middleware/checkBusiness');

const router = new express.Router();


//////// BOOKING ROUTES ////////

router.post('/booking/:businessId/:activityId', auth, async (req, res) => {
    const children = await Child.find({ owner: req.user._id })
    const activity = await Activity.findOne({ _id: req.params.activityId })
    const { date, time, place } = activity
    const booking = new Booking({
        date,
        time,
        place,
        children: children,
        ownerActivity: req.params.activityId,
        ownerBusiness: req.params.businessId,
        owner: req.user._id
    })

    try {
        await booking.save()
        res.status(201).send(booking)
    } catch(e) {
        res.status(400).send(err)
    }

})

//// READ ALL BOOKINGS ASSINGED TO SPECIFIC PROVIDER AND BUSINESS

router.get('/bookings', auth, checkBusiness, async (req, res) => {
    const match = {}
    const sort = {}
    if(req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    if(req.business) {
        try {
            await req.business.populate({
                path: 'booking',
                match,
                options: {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort
                }
            }).execPopulate()
    
            res.send(req.business.booking)
        } catch(e) {
            res.status(500).send()
        }
    } else {
        res.status(400).send({ error: e})
    }   
})

///// READ ALL BOOKINGS FROM SPECIFIC USER

router.get('/bookings/me', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ owner: req.user._id})
        res.send(bookings)
    }
     catch(e) {
        res.status(400).send({ error: e})
    }   
})

///// CANCEL BOOKING

router.delete('/booking/:id', auth, async (req, res) => {
    try {

        const booking = await Booking.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if(!booking) {
            res.send(404).send()
        }
        res.send(booking)
    }catch(e) {
        res.status(500).send()
    }
})

module.exports = router