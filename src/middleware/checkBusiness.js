const Business = require('../models/business');

const checkBusiness = async (req, res, next) => {
    try {
        const business = await Business.find({ owner: res.locals.user._id })
        req.business = business[0]
        res.locals.business = business

        if(business.length <= 0) {
            throw new Error()
        }
        next()
    } catch(e) {
        res.status(401).send({
            error: 'You have not created a business yet'
        })
    }
}

module.exports = checkBusiness