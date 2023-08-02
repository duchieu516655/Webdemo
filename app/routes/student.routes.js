module.exports = function(app) {
    const student = require('../controllers/student.controller.js');
    app.post('/student/classes', student.create);//học sinh join lớp học cần id lớp cần id lớp và id học sinh
    app.post('/student/creat',student.add);
}   