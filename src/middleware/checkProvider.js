
const checkProvider = async (req, res, next) => {
    try {

        if(!res.locals.user.provider) {
            throw new Error()
        }
        next()
    } catch(e) {
        res.status(401).send({
            error: 'You are not allowed to create a business'
        })
    }
}

module.exports = checkProvider