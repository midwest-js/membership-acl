'use strict';

const _ = require('lodash');
const compare = require('./compare');

const parsePermissions = require('./util/parse-permissions');

class ForbiddenError extends Error() {
  construct(...args) {
    super(...args);

    this.name = ForbiddenError;
    this.message = this.message || 'Not authorized for request';
  }
}

module.exports = (getPermissions, getRequiredPermissions) => {
  if (!_.isFunction(getPermissions) || !_.isFunction(getRequiredPermissions)) {
    throw new TypeError('Both parameters need to be functions');
  }

  return {
    fromReq(req, res, next) {
      // TODO handle all vs any
      Promise.all([
        getPermissions(req),
        getRequiredPermissions(req),
      ]).then((result) => compare(...result);
      }).then((authorized) => {
        if (authorized) return next();

        throw new ForbiddenError();
      }).catch(next);
    },

    // calls next if user has at least one of the required permissions
    // `requiredPermissions`should be of format `entity:action` or `entity:action1,action2,action3`
    all(...requiredPermissions) {
      if (!requiredPermissions.length) return (req, res, next) => next();

      requiredPermissions = parsePermissions(requiredPermissions);

      return (req, res, next) => {
        getPermissions(req).then((permissions) => {
          const authorized = compare(permissions, requiredPermissions);

          if (!authorized) {
            throw new Error('Not authorized');
          } else {
            return true;
          }
        }).catch(next);
      }
    },

    // calls next if user has at least one of the required permissions
    // `requiredPermissions`should be of format `entity:action` or `entity:action1,action2,action3`
    any(...requiredPermissions) {
      if (!requiredPermissions.length) return (req, res, next) => next();

      requiredPermissions = parsePermissions(requiredPermissions);

      return (req, res, next) => {
        getPermissions(req).then((permissions) => {
          const authorized = compare(permissions, requiredPermissions, false);

          if (!authorized) {
            throw new ForbiddenError();
          } else {
            return true;
          }
        }).catch(next);
      }
    },
  };
};
