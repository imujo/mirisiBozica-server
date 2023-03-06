const db = require("../../config/database");

const get = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const response = await db("tables")
    .where({ id: id, user_id: user.id })
    .select()
    .first();

  if (!response) {
    return res.json({ msg: "No table found", data: null });
  }

  return res.json({ msg: "Got table", data: response });
};

const getAll = async (req, res) => {
  const response = await db("tables").where({ user_id: req.user.id }).select();

  if (!response.length) {
    return res.json({ msg: "No tables found", data: [] });
  }

  return res.json({ msg: "Got tables", data: response });
};

const getMultiple = async (req, res) => {
  const { ids } = req.query;

  const response = await db("tables")
    .where({ user_id: req.user.id })
    .whereIn("id", ids)
    .select();

  if (!response.length) {
    return res.json({ msg: "No tables found", data: [] });
  }

  return res.json({ msg: "Got tables", data: response });
};

const getAllInRoom = async (req, res) => {
  const { room_id } = req.params;
  const response = await db("tables")
    .where({ user_id: req.user.id, room_id: room_id })
    .select();

  if (!response.length) {
    return res.json({ msg: "No tables found", data: [] });
  }

  return res.json({ msg: "Got tables", data: response });
};

const post = async (req, res) => {
  const { title, room_id, capacity } = req.body;

  const response = await db("tables")
    .insert({
      title: title,
      room_id: room_id,
      capacity: capacity,
      user_id: req.user.id,
      date_created: new Date(),
    })
    .returning("id");

  const id = response[0]?.id;

  if (!id) {
    throw new Error("Could not create table");
  }

  return res.json({
    msg: "Created table",
    data: {
      id: id,
    },
  });
};

const put = async (req, res) => {
  const { id } = req.params;
  const { title, room_id, capacity } = req.body;

  const response = await db("tables")
    .where({ user_id: req.user.id, id: id })
    .update({
      title: title,
      room_id: room_id,
      capacity: capacity,
      date_updated: new Date(),
    })
    .returning("id");
  const response_id = response[0]?.id;

  if (!response_id) throw new Error("Could not update table");

  return res.json({
    msg: "Updated table",
    data: {
      id: response_id,
    },
  });
};

const putRoom = async (req, res) => {
  const { id } = req.params;
  const { room_id } = req.body;

  const response = await db("tables")
    .where({ user_id: req.user.id, id: id })
    .update({
      room_id: room_id,
      date_updated: new Date(),
    })
    .returning("id");
  const response_id = response[0]?.id;

  if (!response_id) throw new Error("Could not update table room");

  return res.json({
    msg: "Updated table room",
    data: {
      id: response_id,
    },
  });
};

const del = async (req, res) => {
  const { id } = req.params;

  await db("tables").where({ user_id: req.user.id, id: id }).del();

  res.json({ msg: "Deleted table" });
};

module.exports = {
  get,
  getAll,
  post,
  put,
  del,
  putRoom,
  getAllInRoom,
  getMultiple,
};
