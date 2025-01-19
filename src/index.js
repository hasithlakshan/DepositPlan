const express = require("express");
const apiRoutes = require("./routes/api");
const app = express();
const port = 3000;

app.use(express.json());

// Routes
app.use("/api/deposits", apiRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
