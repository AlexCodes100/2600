const config = require(`${__dirname}/../server/config/config`)
const utils = require(`${__dirname}/../server/utils`)
const user = require(`${__dirname}/../models/user`)
const express = require("express")
const bcrypt = require("bcrypt")
const memberController = express.Router()
let members = []
let authenticated = []
memberController.post('/signup', async (request, response) => {
    //let collection = client.db().collection('members')
    //members = await util.find(collection, {})
    ///console.log('MongoDB Members', members)
    console.info(`\t|Inside app.post('/signup')`)
    const { email, password } = request.body
    console.log(`\t|Password = ${password}`)
    let hashed = await bcrypt.hash(password, config.SALT_ROUNDS)
    console.log(`${password} hash is ${hashed}`)
    const member = user(email, hashed)
    if (members.length === 0)
        members = utils.readJson(config.MEMBERS)
    //console.log(members)
    const isMember = members.filter((m) => m.email === email)[0]
    if (!isMember) {
        members.push(member)
        console.info(members)
        authenticated.push(email)
        //util.insertOne(collection, members[members.length - 1])
        utils.saveJson(config.MEMBERS, JSON.stringify(members))
        response
            .status(200)
            .json({
                success: {
                    email: email,
                    message: `${email} was added successfuly to members.`,
                },
            })
    } else {
        response
            .status(200)
            .json({ error: `${email} already exists. Choose a different email` })
    }
})

memberController.post('/signin', async (request, response) => {
    //let collection = client.db().collection('members')
    //members = await util.find(collection, {})
    ///console.log('MongoDB Members', members)
    console.info(`\t|Inside app.post('/signin')`)
    const { email, password } = request.body
    if (members.length === 0)
        members = utils.readJson(config.MEMBERS)
    console.log(members)
    const error = {
        email: email,
        error: `Email or password is incorrect.`,
    }
    const member = members.filter((m) => m.email === email)[0]

    if (!member) {
        response
            .status(200)
            .json(error)
    } else {
        const isMatched = await bcrypt.compare(password, member.hashedPassword);
        if (!isMatched) {
            response
                .status(200)
                .json(error)
        } else {
            response
                .status(200)
                .json({ success: `${email} logged in successfully!` })
            authenticated.push(email)
        }
    }
})
memberController.post('/signout', (request, response) => {
    console.log('inside /signout')
    email = request.body.email
    console.log("authenticated", authenticated)
    authenticated.splice(authenticated.indexOf(email), 1)
    console.log("authenticated", authenticated)
    response
        .status(200)
        .json({
            success: {
                email: email,
                message: `${email} logout successfully.`,
            },
        })
})
module.exports = memberController