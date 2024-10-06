// auth_backend/server.js
const app = require("./app");
const { initializeDatabase } = require("./config/config");
const PORT = process.env.PORT || 3000;

(async () => {
  await initializeDatabase(); // Initialize the database
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
