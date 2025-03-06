const express = require("express");
const sequelize = require("./config/database");
const blogRoutes = require("./routes/blogRoutes");

const app = express();
app.use(express.json());
app.use("/blogs", blogRoutes);

const PORT = process.env.PORT || 8002;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
  console.log(`Blog Service running on port ${PORT}`);
});
