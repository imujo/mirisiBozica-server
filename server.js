const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const eventRoutes = require("./routes/eventRoutes");
const roomRoutes = require("./routes/roomRoutes");
const tableRoutes = require("./routes/tableRoutes");

const errorHandler = (error, request, response, next) => {
  console.error(`ERROR - ${error.message}`);
  const status = error.status || 400;
  response.status(status).json({ msg: error.message });
  next();
};

app.use(cors());
app.use(bodyParser.json());

app.use(eventRoutes);
app.use(roomRoutes);
app.use(tableRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
