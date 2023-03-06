const express = require("express");
const app = express();
const bodyParser = require("body-parser");

require("dotenv").config();
const apiRoutes = require("./routes/api/apiRoutes");
const errorHandler = require("./middleware/errorHandler");

const cors = require("cors");

app.use(bodyParser.json());

app.use(cors({ origin: "*" }));

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
