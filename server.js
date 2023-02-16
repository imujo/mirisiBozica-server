const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const apiRoutes = require("./routes/api/apiRoutes");
const errorHandler = require("./middleware/errorHandler");

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    id: 1,
  };

  next();
});

app.use("/api", apiRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
