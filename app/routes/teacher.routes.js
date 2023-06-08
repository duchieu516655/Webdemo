module.exports = function(app) {
    const teacher = require('../controllers/teacher.controller.js');

    app.post('/teacher', teacher.create);

    app.get('/all/teacher', teacher.findAll);

    app.get('/teacher/:id', teacher.findOne);

    app.put('/teacher/:id', teacher.update);

    app.delete('/teacher/:id', teacher.delete);
    
    app.get('/teachers/students/:id',teacher.getStudentsByTeacherId);
}   