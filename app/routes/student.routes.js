module.exports = function(app) {
    const student = require('../controllers/student.controller.js');

    app.post('/student', student.create);

    app.get('/all/student', student.findAll);

    app.get('/student/:id', student.findOne);
    
    app.put('/student/:id', student.update);

    app.delete('/student/:id', student.delete);
}   