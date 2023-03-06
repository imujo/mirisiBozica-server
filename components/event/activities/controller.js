const db = require("../../../config/database");
const { addEvent, getEventId } = require("../../../utils/eventFunctions");
const validationSchema = require("./validation");

// GET

const getById = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const response = await db("activities_events")
    .where({ id: id, user_id: user.id })
    .select()
    .first();

  if (!response) {
    return res.json({ msg: "No activities event found", data: null });
  }

  return res.json({ msg: "Got activities event", data: response });
};

const getByDate = async (req, res) => {
  const { date } = req.params;
  const user = req.user;

  const response = await db("activities_events")
    .where({ date: date, user_id: user.id })
    .select();

  if (!response.length) {
    return res.json({ msg: "No activities events found", data: null });
  }

  return res.json({ msg: "Got activities events", data: response });
};

// POST, PUT

const createEvent = async (req, res) => {
  const event_id = await addEvent();

  if (!event_id) {
    throw new Error("Could not create event");
  }

  const response = await db("activities_events")
    .insert({
      event_id: event_id,
      user_id: req.user.id,
      date_created: new Date(),
    })
    .returning("id");

  const id = response[0]?.id;

  if (!id) {
    throw new Error("Could not create activities event");
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

  const { error, value } = validationSchema.validate(insertBody);

  if (error) throw error;

  insertBody.start_time = insertBody.start_time.slice(11, 16);
  insertBody.end_time = insertBody.end_time.slice(11, 16);

  const where = { id: id, user_id: req.user.id };

  const response = await db("activities_events")
    .where(where)
    .update(insertBody)
    .returning("id");

  const response_id = response[0]?.id;

  if (!response_id) throw new Error("Could not update activities event");

  return res.json({
    msg: "Updated activities event",
    data: {
      id: response_id,
    },
  });
};

// ROOM

const getRoom = async (req, res) => {
  const { id } = req.params;

  const response = await db("activities_events")
    .where({ id: id, user_id: req.user.id })
    .select("room_id")
    .first();

  if (!response?.room_id) {
    return res.json({ msg: "No activities event found", data: null });
  }

  return res.json({ msg: "Got activities event", data: response });
};

const updateRoom = async (req, res) => {
  const { id } = req.params;
  const { room_id } = req.body;

  const where = { id: id, user_id: req.user.id };

  const insertBody = {
    room_id: room_id,
    date_updated: new Date(),
  };

  const response = await db("activities_events")
    .where(where)
    .update(insertBody)
    .returning("id");

  const response_id = response[0]?.id;

  if (!response_id) throw new Error("Could not update resoraunt room");

  return res.json({
    msg: "Updated activities room",
    data: {
      id: response_id,
    },
  });
};

// TABLES

const getTables = async (req, res) => {
  const { id } = req.params;

  const event_id = await getEventId("activities_events", id);

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
  const { selected_ids } = req.body;

  const event_id = await getEventId("activities_events", id);

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
    msg: "Updated activities event tables",
    data: { id: id },
  });
};

// ACTIVITY

const getActivity = async (req, res) => {
  const { id } = req.params;

  const response = await db("activities_events")
    .where({ id: id, user_id: req.user.id })
    .select("activity_id")
    .first();

  if (!response?.activity_id) {
    return res.json({ msg: "No activities event found", data: null });
  }

  return res.json({ msg: "Got activities event", data: response });
};

const updateActivity = async (req, res) => {
  const { id } = req.params;
  const { activity_id } = req.body;

  const where = { id: id, user_id: req.user.id };

  const insertBody = {
    activity_id: activity_id,
    date_updated: new Date(),
  };

  const response = await db("activities_events")
    .where(where)
    .update(insertBody)
    .returning("id");

  const response_id = response[0]?.id;

  if (!response_id) throw new Error("Could not update activity event activity");

  return res.json({
    msg: "Updated activities activity",
    data: {
      id: response_id,
    },
  });
};

const deleteEvent = async (req, res) => {
  const { id } = req.params;

  const event_id = await getEventId("activities_events", id);

  if (!event_id) throw new Error("Could not get event id");

  await db("activities_events")
    .where({
      id: id,
      user_id: req.user.id,
    })
    .del();

  await db("event_tables")
    .where({ user_id: req.user.id, event_id: event_id })
    .delete();

  return res.json({ msg: "Deleted activities event", data: null });
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
  getActivity,
  updateActivity,
  deleteEvent,
};
