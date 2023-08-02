module.exports = (app) => {
    const classes = require('../controllers/classes.controller');
    app.get('/classes/student/:id',classes.getStudentsByclassesId);//hiển thị danh sách lớp theo id của lớp cần id lớp học
}