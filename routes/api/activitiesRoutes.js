const router = require("express").Router();
const controller = require("../../controllers/api/activitiesController");
const { tryCatch } = require("../../utils/tryCatch");

router.get("/all", tryCatch(controller.getAll));
router.get("/:id", tryCatch(controller.get));

router.post("/", tryCatch(controller.post));
router.put("/:id", tryCatch(controller.put));
router.delete("/:id", tryCatch(controller.del));

module.exports = router;
