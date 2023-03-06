const router = require("express").Router();
const controller = require("./controller");
const { tryCatch } = require("../../utils/tryCatch");

router.get("/multiple", tryCatch(controller.getMultiple));
router.get("/all", tryCatch(controller.getAll));
router.get("/all_room/:room_id", tryCatch(controller.getAllInRoom));
router.get("/:id", tryCatch(controller.get));

router.post("/", tryCatch(controller.post));
router.put("/:id", tryCatch(controller.put));
router.put("/room/:id", tryCatch(controller.putRoom));
router.delete("/:id", tryCatch(controller.del));

module.exports = router;
