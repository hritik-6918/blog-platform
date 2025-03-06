const express = require("express");
const sequelize = require("./config/database");
const commentRoutes = require("./routes/commentRoutes");

const app = express();
app.use(express.json());
app.use("/comments", commentRoutes);

const PORT = process.env.PORT || 8003;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
  console.log(`Comment Service running on port ${PORT}`);
});
