const router = require("express").Router();

router.use("/activities", require("../../components/event/activities/routes"));
router.use("/apartment", require("../../components/event/apartment/routes"));
router.use("/restaurant", require("../../components/event/restaurant/routes"));
router.use("/other", require("../../components/event/other/routes"));

module.exports = router;
