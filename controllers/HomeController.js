const utils = require(`${__dirname}/../server/utils`)
const express = require('express')
const homeController = express.Router()

homeController.get('/', async (request,response) => {
    utils.logRequest(request)
    response.sendFile('index.html')
})
homeController.get('/index.html', async (request,response) => {
    utils.logRequest(request)
    response.sendFile('index.html')
})
module.exports = homeController