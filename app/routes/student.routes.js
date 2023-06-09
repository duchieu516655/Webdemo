module.exports = function(app) {
    const student = require('../controllers/student.controller.js');
    app.post('/student/classes', student.create);
}   