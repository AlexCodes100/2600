(() => {
    console.log(`current directory is ${__dirname}`)
    const homeController = require(`${__dirname}/../controllers/homeController`)
    const memberController = require(`${__dirname}/../controllers/memberController`) 
    const config = require(`${__dirname}/config/config`)
    const utils = require(`${__dirname}/utils`)
    const express = require("express")   
    const mongoose = require('mongoose'); // Import mongoose

    const app = express()
   
    app.use(express.static(config.ROOT))
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use((request, response, next) => {
        utils.logRequest(request)
        next()
    })
    app.use(homeController)
    app.use(memberController)   

    // Connect to MongoDB
    mongoose.connect(config.MONGODB_ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('MongoDB Database connected!'))
        .catch(err => console.log(err));

    // Start Node.js HTTP webapp
    app.listen(config.PORT, "localhost", () => {
        console.log(`\t|app listening on ${config.PORT}`)
    })
})()