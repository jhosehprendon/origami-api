
const checkProvider = async (req, res, next) => {
    try {

        if(!res.locals.user.provider) {
            throw new Error()
        }
        next()
    } catch(e) {
        res.status(401).send({
            error: 'You are not a provider and not allowed to take actions on business'
        })
    }
}

module.exports = checkProvider