const { signupValidation, loginValidation } = require('../../validator/Validation');
module.exports = function(app) {
    const users = require('../controllers/user.controller');

    app.post('/register/:role',signupValidation, users.create);

    app.post('/login',loginValidation, users.login);
}   