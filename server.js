const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const apiRoutes = require("./routes/api/_apiRoutes");

const errorHandler = (error, request, response, next) => {
  console.log("\n\n");
  console.error(`ERROR - ${error.message}`);
  console.log(error);
  console.log("\n\n");

  const status = error.status || 400;
  response.status(status).json({ msg: error.message });
  next();
};

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
