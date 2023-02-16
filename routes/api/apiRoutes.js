const router = require("express").Router();

router.use("/event", require("./eventRoutes"));
router.use("/room", require("../../components/room/routes"));
router.use("/table", require("../../components/table/routes"));
router.use("/apartment", require("../../components/apartment/routes"));
router.use("/activities", require("../../components/activities/routes"));

module.exports = router;
