/* eslint-disable no-undef */
const request = require("supertest");
const app = require("../app");
const { pool } = require("../config/config");

beforeAll(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255)
    )
  `);
  await pool.query(`
    INSERT INTO users (email, username, password) 
    VALUES ('testuser@example.com', 'testuser', 'hashedpassword')
  `);
});

afterAll(async () => {
  await pool.query("DELETE FROM users WHERE email = 'testuser@example.com'");
  await pool.query("DROP TABLE IF EXISTS users");
  await pool.end();
});

describe("Auth Controller", () => {
  test("should register a new user", async () => {
    const response = await request(app).post("/auth/register").send({
      email: "newuser@example.com",
      username: "newuser",
      password: "password123",
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
  });

  test("should login an existing user", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "testuser@example.com",
      password: "hashedpassword",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  test("should not login with incorrect password", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "testuser@example.com",
      password: "wrongpassword",
    });
    expect(response.status).toBe(401);
  });
});
