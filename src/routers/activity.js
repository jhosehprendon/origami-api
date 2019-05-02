const express = require('express');
const Activity = require('../models/activity');
const auth = require('../middleware/auth');
const checkProvider = require('../middleware/checkProvider');
const checkBusiness = require('../middleware/checkBusiness');

const router = new express.Router();


//////// ACTIVITIES ROUTES ////////

router.post('/activity/:businessId', auth, checkProvider, checkBusiness, async (req, res) => {
    const activity = new Activity({
        ...req.body,
        owner: req.params.businessId,
        place: req.business.name
    })

    try {
        await activity.save()
        res.status(201).send(activity)
    } catch(e) {
        res.status(400).send(err)
    }

})


// FILTER GET /activities?completed=false
// PAGINATION GET /activities?limit=10&skip=0 (First page with 10 results) /tasks?limit=10&skip=10 (Second page with 10 results)
// SORTNG GET /activities?sortBy=createdAt:asc

router.get('/activities', auth, checkBusiness, async (req, res) => {
    const match = {}
    const sort = {}

    if(req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.business.populate({
            path: 'activity',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        // const activities = await Activity.find({ owner: req.business._id })

        res.send(req.business.activity)
    } catch(e) {
        res.status(500).send()
    }
    
})

router.get('/activities/:id', auth, async (req, res) => {

    const _id = req.params.id

    try {

        const activity = await Activity.findOne({ _id })

        if(!activity) {
            return res.status(404).send()
        }
        res.send(activity)
    } catch(e) {
        res.status(500).send()
    }

})

router.patch('/activities/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'date', 'time', 'completed']
    const isValidOperation = updates.every(el => {
        return allowedUpdates.includes(el)
    })

    if(!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates'})
    }

    try {
        
        const activity = await Activity.findOne({_id: req.params.id})
   
        if(!activity) {
            return res.status(404).send()
        }
        
        updates.forEach((el) => activity[el] = req.body[el])
        await activity.save()
        res.send(activity)
        
    }catch(e) {
        res.status(400).send()
    }
})

// router.delete('/tasks/:id', auth, async (req, res) => {
//     try {

//         const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id})

//         if(!task) {
//             res.send(404).send()
//         }
//         res.send(task)
//     }catch(e) {
//         res.status(500).send()
//     }
// })

module.exports = router
