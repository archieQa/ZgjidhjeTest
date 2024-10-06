const request = require("supertest");
const app = require("../app");

describe("Error Middleware", () => {
  test("should handle 404 errors", async () => {
    const response = await request(app).get("/nonexistent-route");
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Not Found");
  });

  test("should handle validation errors", async () => {
    const response = await request(app).post("/auth/register").send({
      email: "invalid-email",
      username: "",
      password: "short",
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
  });
});
