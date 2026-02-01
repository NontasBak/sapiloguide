const http = require("http");
const test = require("ava");
const got = require("got");
const app = require("../index.js");

test.before(async (t) => {
  t.context.server = http.createServer(app);
  const server = t.context.server.listen();
  const { port } = server.address();
  t.context.got = got.extend({
    responseType: "json",
    prefixUrl: `http://localhost:${port}`,
  });
});

test.after.always((t) => {
  t.context.server.close();
});

test("GET /authors returns status 200 and content-type application/json", async (t) => {
  const { statusCode, headers } = await t.context.got("authors");
  t.is(statusCode, 200);
  t.is(headers["content-type"], "application/json");
});

test("GET /authors/:authorId returns status 200 and content-type application/json", async (t) => {
  const { statusCode, headers } = await t.context.got("authors/1");
  t.is(statusCode, 200);
  t.is(headers["content-type"], "application/json");
});

test("DELETE /authors/:authorId returns status 204", async (t) => {
  const { statusCode } = await t.context.got.delete("authors/1");
  t.is(statusCode, 204);
});

test("GET /books returns status 200 and content-type application/json", async (t) => {
  const { statusCode, headers } = await t.context.got("books");
  t.is(statusCode, 200);
  t.is(headers["content-type"], "application/json");
});

test("GET /books/:bookId returns status 200 and content-type application/json", async (t) => {
  const { statusCode, headers } = await t.context.got("books/1");
  t.is(statusCode, 200);
  t.is(headers["content-type"], "application/json");
});

test("DELETE /books/:bookId returns status 204", async (t) => {
  const { statusCode } = await t.context.got.delete("books/1");
  t.is(statusCode, 204);
});

test("GET /categories returns status 200 and content-type application/json", async (t) => {
  const { statusCode, headers } = await t.context.got("categories");
  t.is(statusCode, 200);
  t.is(headers["content-type"], "application/json");
});

test("GET /categories/:categoryId returns status 200 and content-type application/json", async (t) => {
  const { statusCode, headers } = await t.context.got("categories/1");
  t.is(statusCode, 200);
  t.is(headers["content-type"], "application/json");
});

test("DELETE /categories/:categoryId returns status 204", async (t) => {
  const { statusCode } = await t.context.got.delete("categories/1");
  t.is(statusCode, 204);
});
