const router = require("express").Router();
const controller = require("../../../controllers/api/event/otherController");
const { tryCatch } = require("../../../utils/tryCatch");

// GET

router.get("/:id", tryCatch(controller.getById));
router.get("/date/:date", tryCatch(controller.getByDate));

// POST, PUT DELETE

router.post("/", tryCatch(controller.createEvent));
router.put("/:id", tryCatch(controller.updateEvent));
router.delete("/:id", tryCatch(controller.deleteEvent));

// CONNECTED EVENT

router.get("/connected_event/:id", tryCatch(controller.getConnectedEvent));
router.put("/connected_event/:id", tryCatch(controller.updateConnectedEvent));

module.exports = router;
