(() => {
    const fs = require("fs")
    const config = {}
    config.PORT = process.env.PORT || 8080
    config.ROOT = `${__dirname}/../../views`
    config.SALT_ROUNDS = 10
    config.LOG_FILE = `${__dirname}/../logs/nodejs.log`
    config.MEMBERS = `${__dirname}/../../models/data/members.json`
    config.USERS = `${__dirname}/../../models/data/users.json`
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
