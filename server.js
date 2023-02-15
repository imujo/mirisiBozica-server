const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const eventRoutes = require("./routes/eventRoutes");
const roomRoutes = require("./routes/roomRoutes");
const tableRoutes = require("./routes/tableRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const apartmentRoutes = require("./routes/apartmentRoutes");
const activitiesRoutes = require("./routes/activitiesRoutes");

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

app.use(eventRoutes);
app.use(restaurantRoutes);
app.use(apartmentRoutes);
app.use(activitiesRoutes);
app.use(roomRoutes);
app.use(tableRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
