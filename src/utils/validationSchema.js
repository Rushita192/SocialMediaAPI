const Joi = require('joi');
const { objectId } = require('./customValidation')

const registration = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    username: Joi.string().required(),
    phone: Joi.string().length(10).pattern(/[4-9]{1}[0-9]{9}/).required(),
    password: Joi.string().min(6).trim(true).required(),
});

const login = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().trim(true).required(),
});

const tweetCreate = Joi.object({
    text: Joi.string().required(),
    replyTo: Joi.string().custom(objectId),
});

const tweetUpdate = Joi.object({
    text: Joi.string().required(),
});

module.exports = {
    registration,
    login,
    tweetCreate,
    tweetUpdate
}