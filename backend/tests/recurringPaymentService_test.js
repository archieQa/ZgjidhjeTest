const { pool } = require("../config/config");
const {
  processRecurringPayment,
} = require("../services/recurringPaymentService");
const { processPayment } = require("../services/cardProcessingService");

jest.mock("../services/cardProcessingService");

beforeAll(async () => {
  // Create test user and plan
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
  // Clean up test data
  await pool.query("DELETE FROM transactions");
  await pool.query("DELETE FROM users WHERE email = 'testuser@example.com'");
  await pool.query("DELETE FROM plans WHERE name = 'standard'");
  await pool.end();
});

test("should log recurring payment process for active user", async () => {
  // Mock the processPayment function to return a success response
  processPayment.mockResolvedValue({ status: "success" });

  // Spy on console.log
  const logSpy = jest.spyOn(console, "log");

  // Run the recurring payment function
  await processRecurringPayment();

  // Verify that the logs were generated
  expect(logSpy).toHaveBeenCalledWith(
    expect.stringContaining(
      "Processing recurring payment for user testuser@example.com with plan standard"
    )
  );
  expect(logSpy).toHaveBeenCalledWith(
    expect.stringContaining("Payment successful for user testuser@example.com")
  );

  // Restore console.log
  logSpy.mockRestore();
});
