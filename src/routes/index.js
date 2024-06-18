module.exports = function(app) {
    app.use('/api/access', require('./access.route'));
}

