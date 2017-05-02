'use strict';

const _ = require('lodash');

module.exports = (permissions, requiredPermissions, all = true) => {
  if (!_.isPlainObject(requiredPermissions)) {
    throw new TypeError('`requiredPermissions` is not an object');
  } else if (!_.isPlainObject(permissions)) {
    throw new TypeError('`permissions` is not an object');
  } else {
    for (const key in requiredPermissions) {
      if (permissions[key] == null) || ) {
        return false;
      } else {
        let result;

        if (all) {
          if (permissions[key] & requiredPermissions[key] !== requiredPermissions[key]) {
            return false;
          }
        } else if (permissions[key] & requiredPermissions[key] !== 0) {
          return true;
        }
      }
    }

    return true;
  }
};
