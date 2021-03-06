const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/user');
const businessRouter = require('./routers/business');
const activityRouter = require('./routers/activity');
const bookingRouter = require('./routers/booking');

const app = express()
const port = process.env.PORT

// Maintenance Mode Middleware

// app.use((req, res, next) => {
//     res.status(503).send('Site is currently down')
// })

app.use(express.json())
app.use(userRouter)
app.use(businessRouter)
app.use(activityRouter)
app.use(bookingRouter)

app.listen(port, () => {
    console.log('Server is up on port: ' + port)
})