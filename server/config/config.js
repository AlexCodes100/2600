(() => {
    const fs = require("fs")
    const config = {}
    config.PORT = process.env.PORT || 8080
    config.ROOT = `${__dirname}/../../views`
    config.SALT_ROUNDS = 10
    config.LOG_FILE = `${__dirname}/../logs/nodejs.log`
    config.MEMBERS = `${__dirname}/../../models/data/members.json`
    config.USERS = `${__dirname}/../../models/data/users.json`
    config.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/2600';
    config.MONGODB_ATLAS_URI = process.env.MONGODB_ATLAS_URI || 'mongodb+srv://ricardoalexander28:7INmkH7N2oSZRvjE@2600.5unpdk2.mongodb.net/2600';
    config.logFile = (request, logs) => {
        log = {}
        log.date = new Date()
        log.url = request.url
        log.method = request.method
        logs.push(log)
        fs.appendFile(config.LOG_FILE, JSON.stringify(logs), (error) => {
            if (error)
                console.log(`\t|Error appending to a file\n\t|${error}`)
            // else
            //     console.info('\t|File was appended successfully!')
        })
    }
    module.exports = config
})()
