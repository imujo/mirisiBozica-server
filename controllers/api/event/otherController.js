const db = require("../../../config/database");
const { addEvent, getEventId } = require("../../../utils/eventFunctions");
// const validationSchema = require("../../../utils/formValidation/otherFormValidation");

// GET

const getById = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const response = await db("other_events")
    .where({ id: id, user_id: user.id })
    .select()
    .first();

  if (!response) {
    return res.json({ msg: "No other event found", data: null });
  }

  return res.json({ msg: "Got other event", data: response });
};

const getByDate = async (req, res) => {
  const { date } = req.params;
  const user = req.user;

  const response = await db("other_events")
    .where({ date: date, user_id: user.id })
    .select();

  if (!response.length) {
    return res.json({ msg: "No other events found", data: null });
  }

  return res.json({ msg: "Got other events", data: response });
};

// POST, PUT

const createEvent = async (req, res) => {
  const event_id = await addEvent();

  if (!event_id) {
    throw new Error("Could not create event");
  }

  const response = await db("other_events")
    .insert({
      event_id: event_id,
      user_id: req.user.id,
      date_created: new Date(),
    })
    .returning("id");

  const id = response[0]?.id;

  if (!id) {
    throw new Error("Could not create other event");
  }

  return res.json({
    msg: "Created resturant event",
    data: {
      id: id,
    },
  });
};

const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, all_day, start_time, end_time, date, details } = req.body;

  const insertBody = {
    title: title,
    start_time: start_time,
    end_time: end_time,
    date: date,
    details: details,
    all_day: all_day,
    date_updated: new Date(),
  };

  // const valid = validationSchema.validate(insertBody);

  // console.log(valid.error.details);

  // if (valid.error) {
  //   throw Error(valid.error);
  // }

  // console.log("Valid: ", valid.error);

  const where = { id: id, user_id: req.user.id };

  const response = await db("other_events")
    .where(where)
    .update(insertBody)
    .returning("id");

  const response_id = response[0]?.id;

  if (!response_id) throw new Error("Could not update other event");

  return res.json({
    msg: "Updated other event",
    data: {
      id: response_id,
    },
  });
};

// connected_event

const getConnectedEvent = async (req, res) => {
  const { id } = req.params;

  const response = await db("other_events")
    .where({ id: id, user_id: req.user.id })
    .select("connected_event_id")
    .first();

  if (!response?.connected_event_id) {
    return res.json({ msg: "No other event found", data: null });
  }

  return res.json({ msg: "Got other event", data: response });
};

const updateConnectedEvent = async (req, res) => {
  const { id } = req.params;
  const { connected_event_id } = req.body;

  const where = { id: id, user_id: req.user.id };

  const insertBody = {
    connected_event_id: connected_event_id,
    date_updated: new Date(),
  };

  const response = await db("other_events")
    .where(where)
    .update(insertBody)
    .returning("id");

  const response_id = response[0]?.id;

  if (!response_id)
    throw new Error("Could not update activities connected_event");

  return res.json({
    msg: "Updated other connected_event",
    data: {
      id: response_id,
    },
  });
};

module.exports = {
  getById,
  getByDate,
  createEvent,
  updateEvent,
  getConnectedEvent,
  updateConnectedEvent,
};
