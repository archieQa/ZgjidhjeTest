const request = require("supertest");
const app = require("../app");
const { pool } = require("../config/config");

jest.mock("../services/cardProcessingService");

beforeAll(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255),
      plan VARCHAR(255),
      subscription_status VARCHAR(255)
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS plans (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      price DECIMAL NOT NULL
    )
  `);
  await pool.query(`
    INSERT INTO users (email, username, plan, subscription_status) 
    VALUES ('testuser@example.com', 'testuser', 'standard', 'active')
  `);
  await pool.query(`
    INSERT INTO plans (name, price) 
    VALUES ('standard', 19.99)
  `);
});

afterAll(async () => {
  await pool.query("DELETE FROM transactions");
  await pool.query("DELETE FROM users WHERE email = 'testuser@example.com'");
  await pool.query("DELETE FROM plans WHERE name = 'standard'");
  await pool.query("DROP TABLE IF EXISTS users");
  await pool.query("DROP TABLE IF EXISTS plans");
  await pool.end();
});

describe("Payment Controller", () => {
  test("should process a payment", async () => {
    const response = await request(app).post("/api/payments").send({
      amount: 19.99,
      paymentMethodId: "pm_123456789",
      plan: "standard",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "success");
  });

  test("should fail to process a payment with invalid data", async () => {
    const response = await request(app).post("/api/payments").send({
      amount: -1,
      paymentMethodId: "",
      plan: "",
    });
    expect(response.status).toBe(400);
  });
});
