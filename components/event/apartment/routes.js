const router = require("express").Router();
const controller = require("./controller");
const { tryCatch } = require("../../../utils/tryCatch");

// GET

router.get("/:event_id", tryCatch(controller.getById));
router.get("/date/:date", tryCatch(controller.getByDate));

// POST, PUT, DEL

router.post("/", tryCatch(controller.createEvent));
router.put("/:event_id", tryCatch(controller.updateEvent));
router.delete("/:event_id", tryCatch(controller.deleteEvent));

// APARTMENTS

router.get("/apartments/:event_id", tryCatch(controller.getApartments));
router.put("/apartments/:event_id", tryCatch(controller.updateApartments));

module.exports = router;
