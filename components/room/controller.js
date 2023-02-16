const db = require("../../config/database");

const get = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const response = await db("rooms")
    .where({ id: id, user_id: user.id })
    .select()
    .first();

  if (!response) {
    return res.json({ msg: "No room found", data: null });
  }

  return res.json({ msg: "Got room", data: response });
};

const getAll = async (req, res) => {
  const response = await db("rooms").where({ user_id: req.user.id }).select();

  if (!response.length) {
    return res.json({ msg: "No rooms found", data: [] });
  }

  return res.json({ msg: "Got rooms", data: response });
};

const post = async (req, res) => {
  const { title } = req.body;

  const response = await db("rooms")
    .insert({
      title: title,
      user_id: req.user.id,
      date_created: new Date(),
    })
    .returning("id");

  const id = response[0]?.id;

  if (!id) {
    throw new Error("Could not create room");
  }

  return res.json({
    msg: "Created room",
    data: {
      id: id,
    },
  });
};

const put = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const response = await db("rooms")
    .where({ user_id: req.user.id, id: id })
    .update({
      title: title,
      date_updated: new Date(),
    })
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

const del = async (req, res) => {
  const { id } = req.params;

  await db("rooms").where({ user_id: req.user.id, id: id }).del();

  res.json({ msg: "Deleted room" });
};

module.exports = {
  get,
  getAll,
  post,
  put,
  del,
};
