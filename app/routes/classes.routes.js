module.exports = (app) => {
    const classes = require('../controllers/classes.controller');
app.get('/classes/student/:id',classes.getStudentsByclassesId);

}