'use strict';


/**
 * GET all users
 * GET all users
 *
 * pageSize BigDecimal Number of person returned (optional)
 * pageNumber Integer Pege Number (optional)
 * returns Persons
 **/
exports.userGET = function(pageSize,pageNumber) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * GET unique user
 * GET unique user
 *
 * id String The person's ID
 * pageSize BigDecimal Number of person returned (optional)
 * pageNumber Integer Pege Number (optional)
 * returns Persons
 **/
exports.userIdFriendsGET = function(id,pageSize,pageNumber) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * GET a person's friends
 * GET a list containing all friends. The list support paging
 *
 * id String The person's ID
 * returns Person
 **/
exports.userIdGET = function(id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "firstName" : "firstName",
  "lastName" : "lastName",
  "username" : "username"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Create a user
 * Create a user
 *
 * person Person The user to create (optional)
 * no response value expected for this operation
 **/
exports.userPOST = function(person) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

