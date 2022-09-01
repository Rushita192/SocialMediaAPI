const validator = require('validator');

const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('{{#label}} must be a valid mongo id');
  }
  return value;
};

const username = (value, helpers) => {
  if (!value.match(/^[0-9a-zA-Z_.-]+$/)) {
    return helpers.message('username must only contain numbers, letters, ".", "-", "_"');
  }
  return value;
};

module.exports = {
  objectId,
  username,
};