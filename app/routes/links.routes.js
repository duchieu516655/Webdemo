module.exports = function(app) {
    const links = require('../controllers/links.controller.js');

    app.post('/links', links.create);

    app.get('/all/links',links.findAll);
}