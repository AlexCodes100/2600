const config = require(`${__dirname}/../server/config/config`);
const utils = require(`${__dirname}/../server/utils`);
const User = require(`${__dirname}/../models/user`); // Import the Mongoose User model
const express = require("express");
const bcrypt = require("bcrypt");
const memberController = express.Router();

memberController.post("/signup", async (request, response) => {
    console.info(`\t|Inside app.post('/signup')`);
    const { email, password } = request.body;
    console.log(`\t|Password = ${password}`);
    let hashed = await bcrypt.hash(password, config.SALT_ROUNDS);
    console.log(`${password} hash is ${hashed}`);
    const member = new User({ email: email, hashedPassword: hashed });

    const isMember = await User.findOne({ email: email }); // Use Mongoose User model
    if (!isMember) {
        await member.save(); // Use Mongoose save method
        response.status(200).json({
            success: {
                email: email,
                message: `${email} was added successfully to members.`,
            },
        });
    } else {
        response
            .status(200)
            .json({ error: `${email} already exists. Choose a different email` });
    }
});

memberController.post("/signin", async (request, response) => {
    console.info(`\t|Inside app.post('/signin')`);
    const { email, password } = request.body;

    const error = {
        email: email,
        error: `Email or password is incorrect.`,
    };
    const member = await User.findOne({ email: email }); // Use Mongoose User model

    if (!member) {
        response.status(200).json(error);
    } else {
        const isMatched = await bcrypt.compare(password, member.hashedPassword);
        if (!isMatched) {
            response.status(200).json(error);
        } else {
            response
                .status(200)
                .json({ success: `${email} logged in successfully!` });
        }
    }
});

memberController.post("/signout", (request, response) => {
    console.log("inside /signout");
    email = request.body.email;
    response.status(200).json({
        success: {
            email: email,
            message: `${email} logout successfully.`,
        },
    });
});

module.exports = memberController;