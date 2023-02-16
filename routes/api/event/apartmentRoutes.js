const router = require("express").Router();
const controller = require("../../../controllers/api/event/apartmentController");
const { tryCatch } = require("../../../utils/tryCatch");

// GET

router.get("/:id", tryCatch(controller.getById));
router.get("/date/:date", tryCatch(controller.getByDate));

// POST, PUT

router.post("/", tryCatch(controller.createEvent));
router.put("/:id", tryCatch(controller.updateEvent));

// APARTMENTS

router.get("/apartments/:id", tryCatch(controller.getApartments));
router.put("/apartments/:id", tryCatch(controller.updateApartments));

module.exports = router;
