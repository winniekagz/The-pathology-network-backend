module.exports = {
    isAuthenticated : require('./auth'),
    ...require('./permissions')
};
