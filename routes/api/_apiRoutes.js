const router = require("express").Router();

router.use("/event", require("./event/_eventRoutes"));
router.use("/room", require("./roomRoutes"));
// router.use("/table", require("./tableRoutes"));
// router.use("/activities", require("./event/_eventRoutes"));

module.exports = router;
