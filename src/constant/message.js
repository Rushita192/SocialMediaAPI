module.exports = {
    NOT_FOUND: {
        code: "E_NOT_FOUND",
        message:
            "The requested resource could not be found but may be available again in the future",
        status: 404,
    },
    SERVER_ERROR: {
        code: "E_INTERNAL_SERVER_ERROR",
        message: "Something bad happened on the server",
        status: 500,
    },
};