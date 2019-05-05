const express = require('express');
const Business = require('../models/business');
const auth = require('../middleware/auth');
const checkProvider = require('../middleware/checkProvider');

const router = new express.Router();


//////// BUSINESS ROUTES ////////

router.post('/business', auth, checkProvider, async (req, res) => {
    const business = new Business({
        ...req.body,
        owner: req.user._id
    })

    try {
        await business.save()
        res.status(201).send(business)
    } catch(e) {
        res.status(400).send(err)
    }

})

// router.get('/tasks', auth, async (req, res) => {
//     const match = {}
//     const sort = {}

//     if(req.query.completed) {
//         match.completed = req.query.completed === 'true'
//     }

//     if(req.query.sortBy) {
//         const parts = req.query.sortBy.split(':')
//         sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
//     }

//     try {
//         await req.user.populate({
//             path: 'tasks',
//             match,
//             options: {
//                 limit: parseInt(req.query.limit),
//                 skip: parseInt(req.query.skip),
//                 sort
//             }
//         }).execPopulate()
//         res.send(req.user.tasks)
//     } catch(e) {
//         res.status(500).send()
//     }
    
// })

router.get('/business/:id', auth, async (req, res) => {

    const _id = req.params.id

    try {

        const business = await Business.findOne({ _id, owner: req.user._id})

        if(!business) {
            return res.status(404).send()
        }
        res.send(business)
    } catch(e) {
        res.status(500).send()
    }

})

router.patch('/business/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'description', 'location']
    const isValidOperation = updates.every(el => {
        return allowedUpdates.includes(el)
    })

    if(!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates'})
    }

    try {
        
        const business = await Business.findOne({_id: req.params.id, owner: req.user._id})
   
        if(!business) {
            return res.status(404).send()
        }
        
        updates.forEach((el) => business[el] = req.body[el])
        await business.save()
        res.send(business)
        
    }catch(e) {
        res.status(400).send()
    }
})

router.delete('/business/:id', auth, async (req, res) => {
    try {

        const business = await Business.findOneAndDelete({ _id: req.params.id, owner: req.user._id})

        if(!business) {
            res.send(404).send()
        }
        res.send(business)
    }catch(e) {
        res.status(500).send()
    }
})

module.exports = router
