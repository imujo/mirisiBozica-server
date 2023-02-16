const router = require("express").Router();
const controller = require("../../../controllers/api/event/otherController");
const { tryCatch } = require("../../../utils/tryCatch");

router.get("/:id", tryCatch(controller.getById));
router.get("/date/:date", tryCatch(controller.getByDate));

router.post("/", tryCatch(controller.createEvent));
router.put("/:id", tryCatch(controller.updateEvent));

router.get("/connected_event/:id", tryCatch(controller.getConnectedEvent));
router.put("/connected_event/:id", tryCatch(controller.updateConnectedEvent));

module.exports = router;
