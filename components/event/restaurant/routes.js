const router = require("express").Router();
const controller = require("./controller");
const { tryCatch } = require("../../../utils/tryCatch");

// GET

router.get("/:id", tryCatch(controller.getById));
router.get("/date/:date", tryCatch(controller.getByDate));

// POST, PUT, DELETE

router.post("/", tryCatch(controller.createEvent));
router.put("/:id", tryCatch(controller.updateEvent));
router.delete("/:id", tryCatch(controller.deleteEvent));

// ROOM

router.get("/room/:id", tryCatch(controller.getRoom));
router.put("/room/:id", tryCatch(controller.updateRoom));

// TABLES

router.get("/tables/:id", tryCatch(controller.getTables));
router.put("/tables/:id", tryCatch(controller.updateTables));

module.exports = router;
