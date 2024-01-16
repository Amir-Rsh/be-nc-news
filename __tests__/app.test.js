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
    expect(response.body.endpoints).toHaveProperty("GET /api");
    expect(response.body.endpoints).toHaveProperty("GET /api/topics");
    expect(response.body.endpoints).toHaveProperty("GET /api/articles");
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
  it.only("200: responds the requested article", async () => {
    const response = await request(app).get("/api/articles/1");
    expect(response.status).toBe(200);
    const foundArticle = response.body.article.article;
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
  it.only("404: responds the appropriate message when article_id is valid but not in the database", async () => {
    const response = await request(app).get("/api/articles/999");
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("Not Found");
  });
  it.only("400: responds the appropriate message when article_id is not valid", async () => {
    const response = await request(app).get("/api/articles/invalid");
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Bad Request");
  });
});
