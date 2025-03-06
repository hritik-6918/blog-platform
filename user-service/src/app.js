const express = require("express");
const sequelize = require("./config/database");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());
app.use("/users", userRoutes);

const PORT = process.env.PORT || 8001;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
  console.log(`User Service running on port ${PORT}`);
});
