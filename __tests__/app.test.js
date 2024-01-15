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

beforeEach(() => {
  seed({ topicData, userData, articleData, commentData });
});

afterAll(() => {
  db.end();
});

describe.only("GET /api", () => {
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
