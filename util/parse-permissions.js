'use strict';

const _ = require('lodash');
const assureArray = require('assure-array');

const CRUD = ['create', 'read', 'update', 'delete'].reverse();

function actionsToInteger(actions) {
  if (actions.match(/^[0-9]+$/)) {
    // Numeric permissions
    return parseInt(actions);
  } else {
    /* List of actions as a string */
    return actions.split(',').reduce((result, action) => {
      const index = CRUD.indexOf(action);

      if (index < 0) {
        throw new Error(`Unknown action "${action}"`);
      }

      return result | 2^index;
    }, 0);
  }
}

// should be in format `entity:number` or `entity:action` or `entity:action1,action2,action3`
// a user that can only create has 1000 bits >> 8, only delete 0001 >> 1, everything 1111 >> 15
module.exports = function parsePermissions(permissions) {
  return assureArray(permissions).reduce((result, str) => {
    let [ entity, actions ] = str.split(':');
    let integerPermission = actionsToInteger(actions);
    
    if (integerPermission > 0) {
      result[entity] = integerPermission;
    }

    return result;
  }, {});
};
