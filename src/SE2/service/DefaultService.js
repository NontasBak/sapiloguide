"use strict";

var utils = require("../utils/writer.js");

/**
 * Helper function to create a promise that resolves with example data.
 *
 * @param {Object} exampleData - The example data to return
 * @param {number} code - HTTP status code (default: 200)
 * @returns {Promise} Promise that resolves with the example data
 */
function createMockResponse(exampleData, code) {
  return new Promise(function (resolve) {
    var examples = {};
    if (exampleData) {
      examples["application/json"] = exampleData;
    }
    if (Object.keys(examples).length > 0) {
      resolve(utils.respondWithCode(code, examples[Object.keys(examples)[0]]));
    } else {
      resolve(utils.respondWithCode(code));
    }
  });
}

// Mock data constants
var MOCK_AUTHOR = {
  name: "name",
  id: 0,
};

var MOCK_BOOK = {
  category_id: 1,
  published_year: 5,
  id: 0,
  title: "title",
  author_id: 6,
};

var MOCK_CATEGORY = {
  name: "name",
  id: 0,
};

/**
 * Delete an author
 *
 * authorId Long
 * no response value expected for this operation
 **/
exports.authorsAuthorIdDELETE = function (_) {
  return createMockResponse(null, 204);
};

/**
 * Get details of a specific author
 *
 * authorId Long
 * returns Author
 **/
exports.authorsAuthorIdGET = function (_) {
  return createMockResponse(MOCK_AUTHOR, 200);
};

/**
 * Update an author
 *
 * body AuthorInput
 * authorId Long
 * returns Author
 **/
exports.authorsAuthorIdPUT = function (_, __) {
  return createMockResponse(MOCK_AUTHOR, 200);
};

/**
 * Get all authors
 *
 * returns List
 **/
exports.authorsGET = function () {
  return createMockResponse([MOCK_AUTHOR, MOCK_AUTHOR], 200);
};

/**
 * Add a new author
 *
 * body AuthorInput
 * returns Author
 **/
exports.authorsPOST = function (_) {
  return createMockResponse(MOCK_AUTHOR, 201);
};

/**
 * Delete a book
 *
 * bookId Long
 * no response value expected for this operation
 **/
exports.booksBookIdDELETE = function (_) {
  return createMockResponse(null, 204);
};

/**
 * Get details of a specific book
 *
 * bookId Long
 * returns Book
 **/
exports.booksBookIdGET = function (_) {
  return createMockResponse(MOCK_BOOK, 200);
};

/**
 * Update a book
 *
 * body BookInput
 * bookId Long
 * returns Book
 **/
exports.booksBookIdPUT = function (_, __) {
  return createMockResponse(MOCK_BOOK, 200);
};

/**
 * Get all books
 *
 * returns List
 **/
exports.booksGET = function () {
  return createMockResponse([MOCK_BOOK, MOCK_BOOK], 200);
};

/**
 * Add a new book
 *
 * body BookInput
 * returns Book
 **/
exports.booksPOST = function (_) {
  return createMockResponse(MOCK_BOOK, 201);
};

/**
 * Delete a category
 *
 * categoryId Long
 * no response value expected for this operation
 **/
exports.categoriesCategoryIdDELETE = function (_) {
  return createMockResponse(null, 204);
};

/**
 * Get details of a specific category
 *
 * categoryId Long
 * returns Category
 **/
exports.categoriesCategoryIdGET = function (_) {
  return createMockResponse(MOCK_CATEGORY, 200);
};

/**
 * Update a category
 *
 * body CategoryInput
 * categoryId Long
 * returns Category
 **/
exports.categoriesCategoryIdPUT = function (_, __) {
  return createMockResponse(MOCK_CATEGORY, 200);
};

/**
 * Get all categories
 *
 * returns List
 **/
exports.categoriesGET = function () {
  return createMockResponse([MOCK_CATEGORY, MOCK_CATEGORY], 200);
};

/**
 * Add a new category
 *
 * body CategoryInput
 * returns Category
 **/
exports.categoriesPOST = function (_) {
  return createMockResponse(MOCK_CATEGORY, 201);
};
