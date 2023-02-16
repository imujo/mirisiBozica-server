const router = require("express").Router();
const db = require("../../../config/database");
const { put, get, postEvent, getSelect, putSelect } = require("./funcitons");

// GET

router.get("/activities_event/id", async (req, res, next) => {
  const { user_id, activities_event_id } = req.query;

  const response = await get("activities_events", {
    user_id: user_id,
    id: activities_event_id,
  });

  if (response.error) {
    return next(response.error);
  }

  res.json({
    msg: "Successfuly got event!",
    data: response.data,
  });
});

router.get("/activities_event/date", async (req, res, next) => {
  const { user_id, date } = req.query;

  const response = await get("activities_events", {
    user_id: user_id,
    date: date,
  });

  if (response.error) {
    return next(response.error);
  }

  res.json({
    msg: "Successfuly got event!",
    data: response.data,
  });
});

// POST / UPDATE

router.post("/activities_event", async (req, res, next) => {
  const { user_id } = req.query;

  const response = await postEvent("activities_events", user_id);

  if (response.error) {
    return next(response.error);
  }

  res.json({
    msg: "Successfuly posted event!",
    data: response.data,
  });
});

router.put("/activities_event", async (req, res, next) => {
  const {
    user_id,
    activities_event_id,
    guest,
    n_adults,
    n_children,
    start_time,
    end_time,
    date,
    details,
    price,
  } = req.query;

  const where = { id: activities_event_id, user_id: user_id };
  const insertBody = {
    guest: guest,
    n_adults: n_adults,
    n_children: n_children,
    start_time: start_time,
    end_time: end_time,
    date: date,
    details: details,
    price: price,
    date_updated: new Date(),
  };

  const response = await put("activities_events", where, insertBody);

  if (response.error) {
    return next(response.error);
  }

  res.json({
    msg: "Successfuly updated event!",
    data: response.data,
  });
});

// ROOM

router.get("/activities_event/room", async (req, res, next) => {
  const { user_id, activities_event_id } = req.query;

  const response = await get(
    "activities_events",
    { user_id: user_id, id: activities_event_id },
    "room_id"
  );

  if (response.error) {
    return next(response.error);
  }

  res.json({
    msg: "Successfuly got select!",
    data: response.data[0].room_id,
  });
});

router.put("/activities_event/room", async (req, res, next) => {
  const { user_id, activities_event_id, room_id } = req.query;

  const where = { id: activities_event_id, user_id: user_id };
  const insertBody = {
    room_id: room_id,
    date_updated: new Date(),
  };

  const response = await put("activities_events", where, insertBody);

  if (response.error) {
    return next(response.error);
  }

  res.json({
    msg: "Successfuly updated selected room!",
    data: response.data,
  });
});

// TABLES

router.get("/activities_event/tables", async (req, res, next) => {
  const { user_id, activities_event_id } = req.query;

  const response = await getSelect(
    "activities_events",
    user_id,
    activities_event_id,
    "event_tables",
    "table_id"
  );

  if (response.error) {
    return next(response.error);
  }

  res.json({
    msg: "Successfuly got table ids!",
    data: response.data,
  });
});

router.put("/activities_event/tables", async (req, res, next) => {
  const { user_id, activities_event_id, table_ids } = req.query;

  const response = await putSelect(
    "activities_events",
    "event_tables",
    user_id,
    activities_event_id,
    table_ids,
    "table_id"
  );

  if (response.error) {
    return next(response.error);
  }

  res.json({
    msg: "Successfuly updated table selection!",
    data: response.data,
  });
});

// ACTIVITY

router.get("/activities_event/activity", async (req, res, next) => {
  const { user_id, activities_event_id } = req.query;

  const response = await get(
    "activities_events",
    { user_id: user_id, id: activities_event_id },
    "activity_id"
  );

  if (response.error) {
    return next(response.error);
  }

  res.json({
    msg: "Successfuly got select!",
    data: response.data[0].activity_id,
  });
});

router.put("/activities_event/activity", async (req, res, next) => {
  const { user_id, activities_event_id, activity_id } = req.query;

  const where = { id: activities_event_id, user_id: user_id };
  const insertBody = {
    activity_id: activity_id,
    date_updated: new Date(),
  };

  const response = await put("activities_events", where, insertBody);

  if (response.error) {
    return next(response.error);
  }

  res.json({
    msg: "Successfuly updated selected room!",
    data: response.data,
  });
});

module.exports = router;
