module.exports = (app) => {
    const classes = require('../controllers/classes.controller');

    app.post('/classes',classes.create);

    app.get('/all/classes',classes.findAll);

    app.get('/classes/student/:id',classes.getStudentsByclassesId);
}