const joi = require('joi') // import joi for data validation

// validates the data from user registration
const registerValidation = (data) => {
    const schemaValidation = joi.object({
        username:joi.string().required().min(3).max(256),
        email:joi.string().required().min(6).max(256).email(),
        password:joi.string().required().min(6).max(1024)        
    })
    return schemaValidation.validate(data)
}

//validates the data from the user login
const loginValidation = (data) => {
    const schemaValidation = joi.object({
        email:joi.string().required().min(6).max(256).email(),
        password:joi.string().required().min(6).max(1024)        
    })
    return schemaValidation.validate(data)
}

//export the validation functions
module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation