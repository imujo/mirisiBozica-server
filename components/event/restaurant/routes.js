const router = require("express").Router();
const controller = require("./controller");
const { tryCatch } = require("../../../utils/tryCatch");

// GET

router.get("/:event_id", tryCatch(controller.getById));
router.get("/date/:date", tryCatch(controller.getByDate));

// POST, PUT, DELETE

router.post("/", tryCatch(controller.createEvent));
router.put("/:event_id", tryCatch(controller.updateEvent));
router.delete("/:event_id", tryCatch(controller.deleteEvent));

// ROOM

router.get("/room/:event_id", tryCatch(controller.getRoom));
router.put("/room/:event_id", tryCatch(controller.updateRoom));

// TABLES

router.get("/tables/:event_id", tryCatch(controller.getTables));
router.put("/tables/:event_id", tryCatch(controller.updateTables));

module.exports = router;
