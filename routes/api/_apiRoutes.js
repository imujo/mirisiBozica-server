const router = require("express").Router();

router.use("/event", require("./event/_eventRoutes"));
router.use("/room", require("./roomRoutes"));
router.use("/table", require("./tableRoutes"));
router.use("/apartment", require("./apartmentRoutes"));
router.use("/activities", require("./activitiesRoutes"));

module.exports = router;
