const http = require("http");

const test = require("ava");
const got = require("got");

const app = require("../index.js");

test.before(async (t) => {
	t.context.server = http.createServer(app);
    const server = t.context.server.listen();
    const { port } = server.address();
	t.context.got = got.extend({ responseType: "json", prefixUrl: `http://localhost:${port}` });
});

test.after.always((t) => {
	t.context.server.close();
});

test("GET /books returns correct status code and application/json response body", async (t) => {
	const { statusCode, headers, body } = await t.context.got("books");
	t.is(statusCode, 200);
    t.is(headers["content-type"], "application/json");
	t.true(Array.isArray(body));
	if (body.length > 0) {
		t.truthy(body[0].id);
		t.truthy(body[0].title);
	}
});

test("GET /books/:id returns correct status code and application/json response body", async (t) => {
	const { statusCode, headers, body } = await t.context.got("books/1");
	t.is(statusCode, 200);
    t.is(headers["content-type"], "application/json");
	t.truthy(body.id);
	t.truthy(body.title);
	t.truthy(body.author_id);
	t.truthy(body.category_id);
});

test("GET /authors returns correct status code and application/json response body", async (t) => {
	const { statusCode, headers, body } = await t.context.got("authors");
	t.is(statusCode, 200);
    t.is(headers["content-type"], "application/json");
	t.true(Array.isArray(body));
	if (body.length > 0) {
		t.truthy(body[0].id);
		t.truthy(body[0].name);
	}
});

test("GET /authors/:id returns correct status code and application/json response body", async (t) => {
	const { statusCode, headers, body } = await t.context.got("authors/1");
	t.is(statusCode, 200);
    t.is(headers["content-type"], "application/json");
	t.truthy(body.id);
	t.truthy(body.name);
});

test("GET /categories returns correct status code and application/json response body", async (t) => {
	const { statusCode, headers, body } = await t.context.got("categories");
	t.is(statusCode, 200);
    t.is(headers["content-type"], "application/json");
	t.true(Array.isArray(body));
	if (body.length > 0) {
		t.truthy(body[0].id);
		t.truthy(body[0].name);
	}
});

test("GET /categories/:id returns correct status code and application/json response body", async (t) => {
	const { statusCode, headers, body } = await t.context.got("categories/1");
	t.is(statusCode, 200);
    t.is(headers["content-type"], "application/json");
	t.truthy(body.id);
	t.truthy(body.name);
});

test("POST /books creates a new book and returns 201 status code", async (t) => {
	const newBook = {
		title: "Test Book",
		author_id: 1,
		category_id: 1,
		published_year: 2024
	};
	const { statusCode, headers } = await t.context.got.post("books", { json: newBook });
	t.is(statusCode, 201);
	t.is(headers["content-type"], "application/json");	t.truthy(body.id);
	t.is(body.title, newBook.title);
	t.is(body.author_id, newBook.author_id);
	t.is(body.category_id, newBook.category_id);
	t.is(body.published_year, newBook.published_year);});

test("PUT /books/:id updates a book and returns 200 status code", async (t) => {
	const updatedBook = {
		title: "Updated Book",
		author_id: 1,
		category_id: 1,
		published_year: 2025
	};
	const { statusCode, headers, body } = await t.context.got.put("books/1", { json: updatedBook });
	t.is(statusCode, 200);
	t.is(headers["content-type"], "application/json");
	t.truthy(body.id);
	t.is(body.title, updatedBook.title);
	t.is(body.published_year, updatedBook.published_year);
});

test("DELETE /books/:id deletes a book and returns 204 status code", async (t) => {
	const { statusCode } = await t.context.got.delete("books/1");
	t.is(statusCode, 204);
});

test("POST /authors creates a new author and returns 201 status code", async (t) => {
	const newAuthor = {
		name: "Test Author"
	};
	const { statusCode, headers, body } = await t.context.got.post("authors", { json: newAuthor });
	t.is(statusCode, 201);
	t.is(headers["content-type"], "application/json");
	t.truthy(body.id);
	t.is(body.name, newAuthor.name);
});

test("PUT /authors/:id updates an author and returns 200 status code", async (t) => {
	const updatedAuthor = {
		name: "Updated Author"
	};
	const { statusCode, headers, body } = await t.context.got.put("authors/1", { json: updatedAuthor });
	t.is(statusCode, 200);
	t.is(headers["content-type"], "application/json");
	t.truthy(body.id);
	t.is(body.name, updatedAuthor.name);
});

test("DELETE /authors/:id deletes an author and returns 204 status code", async (t) => {
	const { statusCode } = await t.context.got.delete("authors/1");
	t.is(statusCode, 204);
});

test("POST /categories creates a new category and returns 201 status code", async (t) => {
	const newCategory = {
		name: "Test Category"
	};
	const { statusCode, headers, body } = await t.context.got.post("categories", { json: newCategory });
	t.is(statusCode, 201);
	t.is(headers["content-type"], "application/json");
	t.truthy(body.id);
	t.is(body.name, newCategory.name);
});

test("PUT /categories/:id updates a category and returns 200 status code", async (t) => {
	const updatedCategory = {
		name: "Updated Category"
	};
	const { statusCode, headers, body } = await t.context.got.put("categories/1", { json: updatedCategory });
	t.is(statusCode, 200);
	t.is(headers["content-type"], "application/json");
	t.truthy(body.id);
	t.is(body.name, updatedCategory.name);
});

test("DELETE /categories/:id deletes a category and returns 204 status code", async (t) => {
	const { statusCode } = await t.context.got.delete("categories/1");
	t.is(statusCode, 204);
});