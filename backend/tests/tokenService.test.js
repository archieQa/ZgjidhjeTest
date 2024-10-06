const { resetTokens } = require("../services/tokenService");
const { pool } = require("../config/config");

beforeAll(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tokens (
      id SERIAL PRIMARY KEY,
      token VARCHAR(255) UNIQUE NOT NULL,
      user_id INTEGER NOT NULL,
      expiry_date TIMESTAMP NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  await pool.query(`
    INSERT INTO tokens (token, user_id, expiry_date) 
    VALUES ('testtoken', 1, NOW() + INTERVAL '1 day')
  `);
});

afterAll(async () => {
  await pool.query("DELETE FROM tokens WHERE token = 'testtoken'");
  await pool.query("DROP TABLE IF EXISTS tokens");
  await pool.end();
});

describe("Token Service", () => {
  test("should reset expired tokens", async () => {
    await pool.query(`
      UPDATE tokens SET expiry_date = NOW() - INTERVAL '1 day' 
      WHERE token = 'testtoken'
    `);
    await resetTokens();
    const result = await pool.query(
      "SELECT * FROM tokens WHERE token = 'testtoken'"
    );
    expect(result.rows.length).toBe(0);
  });

  test("should not reset valid tokens", async () => {
    await pool.query(`
      UPDATE tokens SET expiry_date = NOW() + INTERVAL '1 day' 
      WHERE token = 'testtoken'
    `);
    await resetTokens();
    const result = await pool.query(
      "SELECT * FROM tokens WHERE token = 'testtoken'"
    );
    expect(result.rows.length).toBe(1);
  });
});
