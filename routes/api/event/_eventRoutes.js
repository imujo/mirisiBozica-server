const router = require("express").Router();

router.use("/activities", require("./activitiesRoutes"));
router.use("/apartment", require("./apartmentRoutes"));
router.use("/restaurant", require("./restaurantRoutes"));
router.use("/other", require("./otherRoutes"));

module.exports = router;
