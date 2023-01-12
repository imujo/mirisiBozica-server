const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./config/database");
const cors = require("cors");
require("dotenv").config();
const eventRoutes = require("./routes/eventRoutes");
const roomRoutes = require("./routes/roomRoutes");

app.use(cors());
app.use(bodyParser.json());

const errorHandler = (error, request, response, next) => {
  console.error(`ERROR - ${error.message}`);
  const status = error.status || 400;
  response.status(status).json({ msg: error.message });
};

app.use(eventRoutes);
app.use(roomRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
