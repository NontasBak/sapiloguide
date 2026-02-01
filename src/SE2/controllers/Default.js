"use strict";

var utils = require("../utils/writer.js");
var Default = require("../service/DefaultService");

/**
 * Generic controller handler that delegates to service layer
 * and writes the response using the standard JSON writer.
 *
 * @param {string} serviceFunctionName - Name of the service function to call
 * @returns {Function} Controller function that handles the request
 */
function createControllerHandler(serviceFunctionName) {
  return function (_, res, __, ...params) {
    Default[serviceFunctionName](...params)
      .then(function (response) {
        utils.writeJson(res, response);
      })
      .catch(function (response) {
        utils.writeJson(res, response);
      });
  };
}

// Authors endpoints
module.exports.authorsAuthorIdDELETE = createControllerHandler("authorsAuthorIdDELETE");
module.exports.authorsAuthorIdGET = createControllerHandler("authorsAuthorIdGET");
module.exports.authorsAuthorIdPUT = createControllerHandler("authorsAuthorIdPUT");
module.exports.authorsGET = createControllerHandler("authorsGET");
module.exports.authorsPOST = createControllerHandler("authorsPOST");

// Books endpoints
module.exports.booksBookIdDELETE = createControllerHandler("booksBookIdDELETE");
module.exports.booksBookIdGET = createControllerHandler("booksBookIdGET");
module.exports.booksBookIdPUT = createControllerHandler("booksBookIdPUT");
module.exports.booksGET = createControllerHandler("booksGET");
module.exports.booksPOST = createControllerHandler("booksPOST");

// Categories endpoints
module.exports.categoriesCategoryIdDELETE = createControllerHandler("categoriesCategoryIdDELETE");
module.exports.categoriesCategoryIdGET = createControllerHandler("categoriesCategoryIdGET");
module.exports.categoriesCategoryIdPUT = createControllerHandler("categoriesCategoryIdPUT");
module.exports.categoriesGET = createControllerHandler("categoriesGET");
module.exports.categoriesPOST = createControllerHandler("categoriesPOST");
