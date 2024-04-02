const fs = require("fs")
const config = require(`${__dirname}/config/config`)

class Utils {
  // response header for sever-sent events
  static SSE_RESPONSE_HEADER = {
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "X-Accel-Buffering": "no",
  }
  static logRequest(request)  {
    const log = {}
    log.date = new Date()
    log.url = request.url
    log.method = request.method
    fs.appendFile(config.LOG_FILE, `${JSON.stringify(log)}\n`, (error) => {
      if (error) console.log(`\t|Error appending to a file\n\t|${error}`)
    })
  }
  static saveJson(filename, data) {
    try {
      fs.writeFile(filename, data, (error) => {
        if (error) throw error
        console.log("Data saved successfully")
      })
    } catch (error) {
      console.error(
        `An error occured while trying writing to ${filename}`,
        error.message
      )
    }
  }
  static readJson(filename) {
    try {
      let data = fs.readFileSync(filename)
      console.log("Data read successfully!")
      return JSON.parse(data)
    } catch (error) {
      console.error(
        `An error occured while trying reading from ${filename}`,
        error.message
      )
    }
  }
  static convertJson(json) {
    var result = []
    for (let key in json) {
      result.push(json[key])
    }
    return result
  }
  static generateMemberId = (ids) => {
    let id = 1 + Math.floor(Math.random() * 1000)
    while (ids.includes(id)) {
      id = 1 + Math.floor(Math.random() * 1000)
    }
    ids.push(id)
    return id
  }
}
module.exports = Utils
