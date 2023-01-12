const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./config/database");
const cors = require("cors");
require("dotenv").config();
const apiRoutes = require("./routes/apiRoutes");

app.use(cors());
app.use(bodyParser.json());

app.use(apiRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
