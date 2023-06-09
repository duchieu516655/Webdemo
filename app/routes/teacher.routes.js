const { signupValidation, loginValidation } = require('../../validator/Validation');
module.exports = function(app) {
    const teacher = require('../controllers/teacher.controller.js');

    app.post('/teacher/creat',teacher.createClasses);

    // app.get('/all/teacher', teacher.findAll);

    // app.get('/teacher/:id', teacher.findOne);

    // app.put('/teacher/:id', teacher.update);

    // app.delete('/teacher/:id', teacher.delete);
}   