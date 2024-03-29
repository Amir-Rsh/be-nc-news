const seed = require("../db/seeds/seed");
const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index");
const fs = require("fs/promises");
const Test = require("supertest/lib/test");

beforeEach(async () => {
  await seed({ topicData, userData, articleData, commentData });
});

afterAll(async () => {
  await db.end();
});

describe("GET /api", () => {
  it("200: responds with instruction on how to use endpoints", async () => {
    const response = await request(app).get("/api");
    const expectedOutput = await fs.readFile("./endpoints.json", "utf-8");
    expect(response.status).toBe(200);
    expect(response.body.endpoints).toEqual(JSON.parse(expectedOutput));
  });
});

describe("GET /api/topics", () => {
  it("200: responds with all of the topics", async () => {
    const response = await request(app).get("/api/topics");
    expect(response.status).toBe(200);
    response.body.topics.map((topic) => {
      expect(topic).toHaveProperty("slug");
      expect(topic).toHaveProperty("description");
    });
  });
});

describe("GET /api/articles/:article_id", () => {
  it("200: responds the requested article", async () => {
    const response = await request(app).get("/api/articles/1");
    expect(response.status).toBe(200);
    const foundArticle = response.body.article;
    expect(foundArticle.article_id).toBe(1);
    expect(foundArticle.title).toBe("Living in the shadow of a great man");
    expect(foundArticle.topic).toBe("mitch");
    expect(foundArticle.author).toBe("butter_bridge");
    expect(foundArticle.body).toBe("I find this existence challenging");
    expect(foundArticle).toHaveProperty("created_at");
    expect(foundArticle.votes).toBe(100);
    expect(foundArticle.article_img_url).toBe(
      "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
    );
  });
  it("404: responds the appropriate message when article_id is valid but not in the database", async () => {
    const response = await request(app).get("/api/articles/999");
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("article not found");
  });
  it("400: responds the appropriate message when article_id is not valid", async () => {
    const response = await request(app).get("/api/articles/invalid");
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Bad Request");
  });
});

describe("GET /api/articles", () => {
  it("200: responds with all of the articles without body property and with comment_count property", async () => {
    const response = await request(app).get("/api/articles");
    expect(response.status).toBe(200);
    expect(response.body.articles.length).toBe(13);
    response.body.articles.map((article) => {
      expect(article).toHaveProperty("author");
      expect(article).toHaveProperty("title");
      expect(article).toHaveProperty("article_id");
      expect(article).toHaveProperty("topic");
      expect(article).toHaveProperty("created_at");
      expect(article).toHaveProperty("votes");
      expect(article).toHaveProperty("article_img_url");
      expect(article).toHaveProperty("comment_count");
    });
    expect(response.body.articles[0]).toEqual({
      article_id: 3,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      author: "icellusedkars",
      comment_count: "2",
      created_at: "2020-11-03T09:12:00.000Z",
      title: "Eight pug gifs that remind me of mitch",
      topic: "mitch",
      votes: 0,
    });
    expect(response.body.articles).toBeSortedBy("created_at", {
      descending: true,
    });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  it("200: responds the comments for the requested article ordered by created_at", async () => {
    const response = await request(app).get("/api/articles/1/comments");
    expect(response.status).toBe(200);
    const comments = response.body.comments;
    expect(comments.length).toBe(11);
    comments.map((comment) => {
      expect(comment).toHaveProperty("comment_id");
      expect(comment).toHaveProperty("body");
      expect(comment).toHaveProperty("article_id");
      expect(comment).toHaveProperty("author");
      expect(comment).toHaveProperty("votes");
      expect(comment).toHaveProperty("created_at");
    });
    expect(comments).toBeSortedBy("created_at");
  });
  it("200: responds the comments for the requested article ordered by created_at", async () => {
    const response = await request(app).get("/api/articles/7/comments");
    expect(response.status).toBe(200);
    expect(response.body.comments).toEqual([]);
  });
  it("404: responds the appropriate message when article_id is valid but not in the database", async () => {
    const response = await request(app).get("/api/articles/999/comments");
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("article not found");
  });
  it("400: responds the appropriate message when article_id is not valid", async () => {
    const response = await request(app).get("/api/articles/invalid/comments");
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Bad Request");
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  it("201: responds with the posted comment and posts a new comment", async () => {
    const newComment = { username: "butter_bridge", body: "testing the body" };
    const response = await request(app)
      .post("/api/articles/10/comments")
      .send(newComment);
    expect(response.status).toBe(201);
    const comment = response.body.comment;
    expect(comment.author).toBe(newComment.username);
    expect(comment.body).toBe(newComment.body);
    expect(comment.article_id).toBe(10);
  });
  it("404: responds with appropriate message when article_id is not found", async () => {
    const newComment = { username: "butter_bridge", body: "testing the body" };
    const response = await request(app)
      .post("/api/articles/999/comments")
      .send(newComment);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("article not found");
  });
  it("400: responds with appropriate message when posted comment does not contain required properties", async () => {
    const newComment = { body: "testing the body" };
    const response = await request(app)
      .post("/api/articles/10/comments")
      .send(newComment);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Bad Request. Missing properties.");
  });
  it("400: responds with appropriate message when posted comment contains invalid property values", async () => {
    const newComment = { username: 8777, body: 67 };
    const response = await request(app)
      .post("/api/articles/10/comments")
      .send(newComment);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Bad Request");
  });
  it("404: responds with appropriate message when username does not exist", async () => {
    const newComment = { username: "amir", body: "test body" };
    const response = await request(app)
      .post("/api/articles/10/comments")
      .send(newComment);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("username does not exist");
  });
});

describe("PATCH /api/articles/:article_id", () => {
  const patch = { inc_votes: 100 };
  it("200: responds with the patched article", async () => {
    const response = await request(app).patch("/api/articles/1").send(patch);
    expect(response.status).toBe(200);
    const article = response.body.article;
    expect(article.votes).toBe(200);
    expect(article.title).toBe("Living in the shadow of a great man");
    expect(article.topic).toBe("mitch");
    expect(article.author).toBe("butter_bridge");
    expect(article.body).toBe("I find this existence challenging");
    expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
    expect(article.article_img_url).toBe(
      "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
    );
  });
  it("404: responds with the appropriate message when article is not found", async () => {
    const patch = { inc_votes: 100 };
    const response = await request(app).patch("/api/articles/900").send(patch);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("article not found");
  });
  it("400: responds with the appropriate message when article_id is invalid", async () => {
    const patch = { inc_votes: 100 };
    const response = await request(app)
      .patch("/api/articles/invalid")
      .send(patch);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Bad Request");
  });
  it("400: responds with the appropriate message when patch does not have inc_votes", async () => {
    const patch = { no_votes: 100 };
    const response = await request(app)
      .patch("/api/articles/invalid")
      .send(patch);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Bad Request");
  });
  it("400: responds with the appropriate message when inc_votes is invalid", async () => {
    const patch = { inc_votes: "i'm invalid" };
    const response = await request(app)
      .patch("/api/articles/invalid")
      .send(patch);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Bad Request");
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  const patch = { inc_votes: 100 };
  it("204: responds with no content", async () => {
    const response = await request(app).delete("/api/comments/1");
    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });
  it("404: responds with appropriate message when comment is not found", async () => {
    const response = await request(app).delete("/api/comments/1000");
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("comment does not exist");
  });
  it("400: responds with appropriate message when comment_id is invalid", async () => {
    const response = await request(app).delete("/api/comments/invalid");
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Bad Request");
  });
});

describe("GET /api/users", () => {
  it("200: responds with all of the users", async () => {
    const response = await request(app).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body.users.length).toBe(4);
    response.body.users.forEach((user) => {
      expect(typeof user.username).toBe("string");
      expect(typeof user.avatar_url).toBe("string");
      expect(typeof user.name).toBe("string");
    });
  });
});

describe("GET /api/articles?topic=...", () => {
  it("200: responds with articles on the requested topic", async () => {
    const response = await request(app).get("/api/articles?topic=mitch");
    expect(response.status).toBe(200);
    response.body.articles.forEach((article) => {
      expect(article.topic).toBe("mitch");
    });
  });
  it("200: responds with empty array when no article on the requested topic is found", async () => {
    const response = await request(app).get("/api/articles?topic=paper");
    expect(response.status).toBe(200);
    expect(response.body.articles).toEqual([]);
  });
  it("404: responds with appropriate message when topic is not found", async () => {
    const response = await request(app).get("/api/articles?topic=not_a_topic");
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("topic does not exist");
  });
});

describe("GET /api/articles/:article_id?comment_count", () => {
  it("200: responds with requested article and its comment_count", async () => {
    const response = await request(app).get("/api/articles/1?comment_count");
    expect(response.status).toBe(200);
    expect(response.body.article).toEqual({
      article_id: 1,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      title: "Living in the shadow of a great man",
      topic: "mitch",
      votes: 100,
      comment_count: "11",
    });
  });
  it("200: responds with requested article and its comment_count when no comment is found", async () => {
    const response = await request(app).get("/api/articles/7?comment_count");
    expect(response.status).toBe(200);
    expect(response.body.article).toEqual({
      article_id: 7,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      author: "icellusedkars",
      body: "I was hungry.",
      comment_count: "0",
      created_at: "2020-01-07T14:08:00.000Z",
      title: "Z",
      topic: "mitch",
      votes: 0,
    });
  });
});

describe("GET /api/articles?sort_by?order", () => {
  it("200: responds with all of the articles by the requested sort", async () => {
    const response = await request(app).get("/api/articles?sort_by=article_id");
    expect(response.status).toBe(200);
    expect(response.body.articles).toBeSortedBy("article_id", {
      descending: true,
    });
  });
  it("200: responds with all of the articles by the requested order and sort", async () => {
    const response = await request(app).get(
      "/api/articles?sort_by=article_id&order=asc"
    );
    expect(response.status).toBe(200);
    expect(response.body.articles).toBeSortedBy("article_id");
  });
  it("400: responds with appropriate message when sort_by query is invalid", async () => {
    const response = await request(app).get("/api/articles?sort_by=invalid");
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("invalid sort_by query");
  });
  it("400: responds with appropriate message when order query is invalid", async () => {
    const response = await request(app).get("/api/articles?order=invalid");
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("invalid order query");
  });
});

describe("POST /api/users", () => {
  it("201: adds a new user to the database", async () => {
    const newUser = {
      username: "johnny-boy",
      name: "john doe",
      avatar_url: "badUrl",
      user_id: "asifh739461",
    };
    const response = await request(app).post("/api/users").send(newUser);
    expect(response.status).toBe(201);
    expect(response.body.user).toEqual(newUser);
  });
  it("400: gives an error if username already exists", async () => {
    const newUser = {
      username: "johnny-boy",
      name: "john doe",
      avatar_url: "badUrl",
      user_id: "asifh739461",
    };
    const newerUser = {
      username: "johnny-boy",
    };

    const firstPost = await request(app).post("/api/users").send(newUser);
    const response = await request(app).post("/api/users").send(newerUser);

    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("username already exists");
  });
  it("400: gives an error if all details have not been provided", async () => {
    const newUser = {
      name: "john doe",
      avatar_url: "badUrl",
    };
    const response = await request(app).post("/api/users").send(newUser);

    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("details have not been provided");
  });
});

describe("GET /api/users/:user_id", () => {
  it("200: gets user by username", async () => {
    const response = await request(app).get("/api/users/1");
    expect(response.status).toBe(200);
    expect(response.body.user).toEqual({
      user_id: "1",
      username: "butter_bridge",
      name: "jonny",
      avatar_url:
        "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
    });
  });
  it("404: gives an error if id does not exist", async () => {
    const response = await request(app).get("/api/users/9999");
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("user does not exist");
  });
});
