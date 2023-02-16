const router = require("express").Router();
const { put, get, postEvent, getSelect, putSelect } = require("./funcitons");

// GET

router.get("/other_event/id", async (req, res, next) => {
  const { user_id, other_event_id } = req.query;

  const response = await get("other_events", {
    user_id: user_id,
    id: other_event_id,
  });

  if (response.error) {
    return next(response.error);
  }

  res.json({
    msg: "Successfuly got event!",
    data: response.data,
  });
});

router.get("/other_event/date", async (req, res, next) => {
  const { user_id, date } = req.query;

  const response = await get("other_events", {
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

router.post("/other_event", async (req, res, next) => {
  const { user_id } = req.query;

  const response = await postEvent("other_events", user_id);

  if (response.error) {
    return next(response.error);
  }

  res.json({
    msg: "Successfuly posted event!",
    data: response.data,
  });
});

router.put("/other_event", async (req, res, next) => {
  const {
    user_id,
    other_event_id,
    title,
    all_day,
    start_time,
    end_time,
    date,
    details,
  } = req.query;

  const where = { id: other_event_id, user_id: user_id };
  const insertBody = {
    title: title,
    start_time: start_time,
    end_time: end_time,
    date: date,
    details: details,
    all_day: all_day,
    date_updated: new Date(),
  };

  const response = await put("other_events", where, insertBody);

  if (response.error) {
    return next(response.error);
  }

  res.json({
    msg: "Successfuly updated event!",
    data: response.data,
  });
});

// CONNECTED EVENT

router.get("/other_event/event", async (req, res, next) => {
  const { user_id, other_event_id } = req.query;

  const response = await get(
    "other_events",
    { user_id: user_id, id: other_event_id },
    "connected_event_id"
  );

  if (response.error) {
    return next(response.error);
  }

  res.json({
    msg: "Successfuly got select!",
    data: response.data[0].connected_event_id,
  });
});

router.put("/other_event/event", async (req, res, next) => {
  const { user_id, other_event_id, connected_event_id } = req.query;

  const where = { id: other_event_id, user_id: user_id };
  const insertBody = {
    connected_event_id: connected_event_id,
    date_updated: new Date(),
  };

  const response = await put("other_events", where, insertBody);

  if (response.error) {
    return next(response.error);
  }

  res.json({
    msg: "Successfuly updated selected connected event!",
    data: response.data,
  });
});

module.exports = router;
