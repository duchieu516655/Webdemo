const { signupValidation, loginValidation } = require('../../validator/Validation');
module.exports = function(app) {
    const users = require('../controllers/user.controller');

    app.post('/register/:role',signupValidation, users.create);// cần name email password

    app.post('/login',loginValidation, users.login);// email và password
}   