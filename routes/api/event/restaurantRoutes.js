const router = require("express").Router();
const controller = require("../../../controllers/api/event/restaurantController");
const { tryCatch } = require("../../../utils/tryCatch");

router.get("/:id", tryCatch(controller.getById));
router.get("/date/:date", tryCatch(controller.getByDate));

router.post("/", tryCatch(controller.createEvent));
router.put("/:id", tryCatch(controller.updateEvent));

router.get("/room/:id", tryCatch(controller.getRoom));
router.put("/room/:id", tryCatch(controller.updateRoom));

router.get("/tables/:id", tryCatch(controller.getTables));
router.put("/tables/:id", tryCatch(controller.updateTables));

module.exports = router;
