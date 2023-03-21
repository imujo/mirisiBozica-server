const db = require("../../../config/database");
const {
  addEvent,
  dateToFormatedDate,
} = require("../../../utils/eventFunctions");
const validationSchema = require("./validation");

// TODO add middleware to check if event exist (event_id)

// GET

const getById = async (req, res) => {
  const { event_id } = req.params;
  const user = req.user;

  // let response = await db("restaurant_events")
  //   .where({ id: id, user_id: user.id })
  //   .select()
  //   .first();  event 12995 res event 12974
  let restaurant_details = await db("restaurant_events")
    .where({
      event_id: event_id,
      user_id: req.user.id,
    })
    .first();

  // let room = await db("rooms").where({ id: restaurant_details.room_id });

  // restaurant_details.room = room[0];

  delete restaurant_details.room_id;

  return res.json({ msg: "Got restaurant event", data: restaurant_details });
};

const getByDate = async (req, res) => {
  const { date } = req.params;
  const user = req.user;

  const response = await db("restaurant_events")
    .where({ user_id: user.id, date: dateToFormatedDate(date) })
    .orderBy("start_time")
    .select();

  if (!response.length) {
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
      event_id: event_id,
    },
  });
};

const updateEvent = async (req, res) => {
  const { event_id } = req.params;
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
    date: dateToFormatedDate(date),
    details: details,
    price: price,
    date_updated: new Date(),
  };

  const { error, value } = validationSchema.validate(insertBody);

  if (error) throw error;

  insertBody.start_time = insertBody.start_time.slice(11, 16);
  insertBody.end_time = insertBody.end_time.slice(11, 16);

  const where = { event_id: event_id, user_id: req.user.id };

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
  const { event_id } = req.params;

  const response = await db
    .select("rooms.*")
    .from("events")
    .join("restaurant_events", "events.id", "=", "restaurant_events.event_id")
    .join("rooms", "restaurant_events.room_id", "=", "rooms.id")
    .where("events.id", event_id);

  return res.json({ msg: "Got room", data: response });
};

const updateRoom = async (req, res) => {
  const { event_id } = req.params;
  let { id: room_id } = req.body;

  await db("event_tables")
    .where({ user_id: req.user.id, event_id: event_id })
    .del();

  const response = await db("restaurant_events")
    .where({ event_id: event_id, user_id: req.user.id })
    .update({
      room_id: room_id,
      date_updated: new Date(),
    })
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
  const { event_id } = req.params;

  const response = await db("event_tables")
    .where({ user_id: req.user.id, event_id: event_id })
    .select("table_id");

  const ids = response.map((el) => el["table_id"]);

  if (!ids.length) {
    return res.json({ msg: "No tables found", data: [] });
  }
  const tables = await db("tables")
    .where({ user_id: req.user.id })
    .whereIn("id", ids)
    .select();

  return res.json({ msg: "Got tables", data: tables });
};

const updateTables = async (req, res) => {
  const { event_id } = req.params;
  const { selected_ids } = req.body;

  await db("event_tables")
    .where({ event_id: event_id, user_id: req.user.id })
    .del();

  const tableData = selected_ids.map((id) => {
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
    data: { event_id: event_id },
  });
};

const deleteEvent = async (req, res) => {
  const { event_id } = req.params;

  await db("restaurant_events")
    .where({
      event_id: event_id,
      user_id: req.user.id,
    })
    .del();

  await db("event_tables")
    .where({ user_id: req.user.id, event_id: event_id })
    .del();

  await db("events").where({ id: event_id }).del();

  return res.json({ msg: "Deleted restaurant event", data: null });
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
  deleteEvent,
};
