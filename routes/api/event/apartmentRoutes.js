const router = require("express").Router();
const db = require("../../../config/database");
const { put, get, postEvent, getSelect, putSelect } = require("./funcitons");

// GET

router.get("/apartment_event/id", async (req, res, next) => {
  const { user_id, apartment_event_id } = req.query;

  const response = await get("apartment_events", {
    user_id: user_id,
    id: apartment_event_id,
  });

  if (response.error) {
    return next(response.error);
  }

  res.json({
    msg: "Successfuly got event!",
    data: response.data,
  });
});

router.get("/apartment_event/date", async (req, res, next) => {
  try {
    const { user_id, date } = req.query;

    const response = await db("apartment_events")
      .where("date_in", "<=", date)
      .andWhere("date_out", ">=", date)
      .andWhere({ user_id: user_id })
      .select();

    res.json({
      msg: "Successfuly got event!",
      data: response,
    });
  } catch (error) {
    return next(error);
  }
});

// POST / UPDATE

router.post("/apartment_event", async (req, res, next) => {
  const { user_id } = req.query;

  const response = await postEvent("apartment_events", user_id);

  if (response.error) {
    return next(response.error);
  }

  res.json({
    msg: "Successfuly posted event!",
    data: response.data,
  });
});

router.put("/apartment_event", async (req, res, next) => {
  const {
    user_id,
    apartment_event_id,
    guest,
    n_adults,
    n_children,
    date_in,
    date_out,
    bed_and_breakfast,
    details,
    price,
  } = req.query;

  const where = { id: apartment_event_id, user_id: user_id };
  const insertBody = {
    guest: guest,
    n_adults: n_adults,
    n_children: n_children,
    date_in: date_in,
    date_out: date_out,
    bed_and_breakfast: bed_and_breakfast,
    details: details,
    price: price,
    date_updated: new Date(),
  };

  const response = await put("apartment_events", where, insertBody);

  if (response.error) {
    return next(response.error);
  }

  res.json({
    msg: "Successfuly updated event!",
    data: response.data,
  });
});

// APARTMENTS

router.get("/apartment_event/apartments", async (req, res, next) => {
  const { user_id, apartment_event_id } = req.query;

  const response = await getSelect(
    "apartment_events",
    user_id,
    apartment_event_id,
    "event_apartments",
    "apartment_id"
  );

  if (response.error) {
    return next(response.error);
  }

  res.json({
    msg: "Successfuly got apartment ids!",
    data: response.data,
  });
});

router.put("/apartment_event/apartments", async (req, res, next) => {
  const { user_id, apartment_event_id, apartment_ids } = req.query;

  const response = await putSelect(
    "apartment_events",
    "event_apartments",
    user_id,
    apartment_event_id,
    apartment_ids,
    "apartment_id"
  );

  if (response.error) {
    return next(response.error);
  }

  res.json({
    msg: "Successfuly updated apartment selection!",
    data: response.data,
  });
});

module.exports = router;
