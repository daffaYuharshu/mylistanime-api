const { body } = require("express-validator");

const userValidation = () => {
    return [
        body("email", "Email tidak valid").isEmail(),
        body("password", "Password minimal 8 karakter").isLength({
        min: 8
        })
    ]
}

module.exports = userValidation;