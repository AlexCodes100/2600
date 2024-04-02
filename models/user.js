// using factory method design pattern
const User = (email, hashedPassword) => {
    return {
        email: email,
        hashedPassword: hashedPassword,
        role:"member",
        since: new Date().toUTCString()
    }
}
module.exports = User