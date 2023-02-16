// const router = require("express").Router();
// const { put, get, postEvent, getSelect, putSelect } = require("./funcitons");

// // GET

// router.get("/restaurant_event/id", async (req, res, next) => {
//   const { user_id, restaurant_event_id } = req.query;

//   const response = await get("restaurant_events", {
//     user_id: user_id,
//     id: restaurant_event_id,
//   });

//   if (response.error) {
//     return next(response.error);
//   }

//   res.json({
//     msg: "Successfuly got event!",
//     data: response.data,
//   });
// });

// router.get("/restaurant_event/date", async (req, res, next) => {
//   const { user_id, date } = req.query;

//   const response = await get("restaurant_events", {
//     user_id: user_id,
//     date: date,
//   });

//   if (response.error) {
//     return next(response.error);
//   }

//   res.json({
//     msg: "Successfuly got event!",
//     data: response.data,
//   });
// });

// // POST / UPDATE

// router.post("/restaurant_event", async (req, res, next) => {
//   const { user_id } = req.query;

//   const response = await postEvent("restaurant_events", user_id);

//   if (response.error) {
//     return next(response.error);
//   }

//   res.json({
//     msg: "Successfuly posted event!",
//     data: response.data,
//   });
// });

// router.put("/restaurant_event", async (req, res, next) => {
//   const {
//     user_id,
//     restaurant_event_id,
//     guest,
//     n_adults,
//     n_children,
//     start_time,
//     end_time,
//     date,
//     details,
//     price,
//   } = req.query;

//   const where = { id: restaurant_event_id, user_id: user_id };
//   const insertBody = {
//     guest: guest,
//     n_adults: n_adults,
//     n_children: n_children,
//     start_time: start_time,
//     end_time: end_time,
//     date: date,
//     details: details,
//     price: price,
//     date_updated: new Date(),
//   };

//   const response = await put("restaurant_events", where, insertBody);

//   if (response.error) {
//     return next(response.error);
//   }

//   res.json({
//     msg: "Successfuly updated event!",
//     data: response.data,
//   });
// });

// // ROOM

// router.get("/restaurant_event/room", async (req, res, next) => {
//   const { user_id, restaurant_event_id } = req.query;

//   const response = await get(
//     "restaurant_events",
//     { user_id: user_id, id: restaurant_event_id },
//     "room_id"
//   );

//   if (response.error) {
//     return next(response.error);
//   }

//   res.json({
//     msg: "Successfuly got select!",
//     data: response.data[0].room_id,
//   });
// });

// router.put("/restaurant_event/room", async (req, res, next) => {
//   const { user_id, restaurant_event_id, room_id } = req.query;

//   const where = { id: restaurant_event_id, user_id: user_id };
//   const insertBody = {
//     room_id: room_id,
//     date_updated: new Date(),
//   };

//   const response = await put("restaurant_events", where, insertBody);

//   if (response.error) {
//     return next(response.error);
//   }

//   res.json({
//     msg: "Successfuly updated selected room!",
//     data: response.data,
//   });
// });

// // TABLES

// router.get("/restaurant_event/tables", async (req, res, next) => {
//   const { user_id, restaurant_event_id } = req.query;

//   const response = await getSelect(
//     "restaurant_events",
//     user_id,
//     restaurant_event_id,
//     "event_tables",
//     "table_id"
//   );

//   if (response.error) {
//     return next(response.error);
//   }

//   res.json({
//     msg: "Successfuly got table ids!",
//     data: response.data,
//   });
// });

// router.put("/restaurant_event/tables", async (req, res, next) => {
//   const { user_id, restaurant_event_id, table_ids } = req.query;

//   const response = await putSelect(
//     "restaurant_events",
//     "event_tables",
//     user_id,
//     restaurant_event_id,
//     table_ids,
//     "table_id"
//   );

//   if (response.error) {
//     return next(response.error);
//   }

//   res.json({
//     msg: "Successfuly updated table selection!",
//     data: response.data,
//   });
// });

// module.exports = router;
const router = require("express").Router();
const controller = require("../../../controllers/api/event/restaurantController");

router.get("/:id", controller.getById);
router.get("/date/:date", controller.getByDate);

router.post("/", controller.createEvent);
router.put("/:id", controller.updateEvent);

router.get("/room/:id", controller.getRoom);
router.put("/room/:id", controller.updateRoom);

router.get("/tables/:id", controller.getTables);
router.put("/tables/:id", controller.updateTables);

module.exports = router;
