const db = require("../../../config/database");
const { addEvent, getEventId } = require("../../../utils/eventFunctions");
// const validationSchema = require("../../../utils/formValidation/restaurantFormValidation");

// GET

const getById = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const response = await db("restaurant_events")
    .where({ id: id, user_id: user.id })
    .select()
    .first();

  if (!response) {
    return res.json({ msg: "No restaurant event found", data: null });
  }

  return res.json({ msg: "Got restaurant event", data: response });
};

const getByDate = async (req, res) => {
  const { date } = req.params;
  const user = req.user;

  const response = await db("restaurant_events")
    .where({ date: date, user_id: user.id })
    .select();

  if (!response) {
    return res.json({ msg: "No restaurant events found", data: null });
  }

  return res.json({ msg: "Got restaurant events", data: response });
};

// POST, PUT

const createEvent = async (req, res) => {
  const event_id = await addEvent();

  if (!event_id) {
    throw new Error("Could not create event");
  }

  const response = await db("restaurant_events")
    .insert({
      event_id: event_id,
      user_id: req.user.id,
      date_created: new Date(),
    })
    .returning("id");

  const id = response[0]?.id;

  if (!id) {
    throw new Error("Could not create restaurant event");
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
  const {
    guest,
    n_adults,
    n_children,
    start_time,
    end_time,
    date,
    details,
    price,
  } = req.body;

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

  // const valid = validationSchema.validate(insertBody);

  // console.log(valid.error.details);

  // if (valid.error) {
  //   throw Error(valid.error);
  // }

  // console.log("Valid: ", valid.error);

  const where = { id: id, user_id: req.user.id };

  const response = await db("restaurant_events")
    .where(where)
    .update(insertBody)
    .returning("id");

  const response_id = response[0]?.id;

  if (!response_id) throw new Error("Could not update resoraunt event");

  return res.json({
    msg: "Updated restaurant event",
    data: {
      id: response_id,
    },
  });
};

// ROOM

const getRoom = async (req, res) => {
  const { id } = req.params;

  const response = await db("restaurant_events")
    .where({ id: id, user_id: req.user.id })
    .select("room_id")
    .first();

  if (!response) {
    return res.json({ msg: "No restaurant event found", data: null });
  }

  return res.json({ msg: "Got restaurant event", data: response });
};

const updateRoom = async (req, res) => {
  const { id } = req.params;
  const { room_id } = req.body;

  const where = { id: id, user_id: req.user.id };

  const insertBody = {
    room_id: room_id,
    date_updated: new Date(),
  };

  const response = await db("restaurant_events")
    .where(where)
    .update(insertBody)
    .returning("id");

  const response_id = response[0]?.id;

  if (!response_id) throw new Error("Could not update resoraunt room");

  return res.json({
    msg: "Updated restaurant room",
    data: {
      id: response_id,
    },
  });
};

// TABLES

const getTables = async (req, res) => {
  const { id } = req.params;

  const event_id = await getEventId("restaurant_events", id);

  if (!event_id) throw new Error("Could not get event id");

  const response = await db("event_tables")
    .where({ user_id: req.user.id, event_id: event_id })
    .select("table_id");

  const ids = response.map((el) => el["table_id"]);

  if (!ids.length) {
    return res.json({ msg: "No tables found", data: [] });
  }

  return res.json({ msg: "Got tables", data: { ids: ids } });
};

const updateTables = async (req, res) => {
  const { id } = req.params;
  const { table_ids } = req.body;

  const event_id = await getEventId("restaurant_events", id);

  await db("event_tables")
    .where({ event_id: event_id, user_id: req.user.id })
    .del();

  const tableData = table_ids.map((id) => {
    return {
      table_id: id,
      user_id: req.user.id,
      event_id: event_id,
      date_updated: new Date(),
    };
  });

  await db("event_tables").insert(tableData);

  return res.json({
    msg: "Updated restaurant event tables",
    data: { id: id },
  });
};

module.exports = {
  getById,
  getByDate,
  createEvent,
  updateEvent,
  getRoom,
  updateRoom,
  getTables,
  updateTables,
};
