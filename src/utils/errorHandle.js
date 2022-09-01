const logger = require('pino')()
const { NOT_FOUND, SERVER_ERROR } = require('../constant/message');

const isProd = process.env.NODE_ENV === 'production';

const handleNotFound = (req, res, next) => {
    res.status(NOT_FOUND.status).json({
        message: NOT_FOUND.message,
        code: NOT_FOUND.code
    })
    next();
};

const handleError = (err, req, res, next) => {
    res.status(err.statusCode || SERVER_ERROR.code);
    res.json({
        message: err.message || SERVER_ERROR.message,
        stack: isProd ? null : err.stack
    });
}

module.exports = {
    handleError,
    handleNotFound,
};
