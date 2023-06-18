const { signupValidation, loginValidation } = require('../../validator/Validation');
module.exports = function(app) {
    const teacher = require('../controllers/teacher.controller.js');

    app.post('/teacher/creat',teacher.createClasses);

}   