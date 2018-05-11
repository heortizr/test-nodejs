'use strict';

var utils = require('../utils/writer.js');
var Default = require('../service/DefaultService');

module.exports.userGET = function userGET (req, res, next) {
  var pageSize = req.swagger.params['pageSize'].value;
  var pageNumber = req.swagger.params['pageNumber'].value;
  Default.userGET(pageSize,pageNumber)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.userIdFriendsGET = function userIdFriendsGET (req, res, next) {
  var id = req.swagger.params['id'].value;
  var pageSize = req.swagger.params['pageSize'].value;
  var pageNumber = req.swagger.params['pageNumber'].value;
  Default.userIdFriendsGET(id,pageSize,pageNumber)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.userIdGET = function userIdGET (req, res, next) {
  var id = req.swagger.params['id'].value;
  Default.userIdGET(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.userPOST = function userPOST (req, res, next) {
  var person = req.swagger.params['person'].value;
  Default.userPOST(person)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
