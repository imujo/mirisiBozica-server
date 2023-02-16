const db = require("../../config/database");

const get = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const response = await db("activities")
    .where({ id: id, user_id: user.id })
    .select()
    .first();

  if (!response) {
    return res.json({ msg: "No activity found", data: null });
  }

  return res.json({ msg: "Got activity", data: response });
};

const getAll = async (req, res) => {
  const response = await db("activities")
    .where({ user_id: req.user.id })
    .select();

  if (!response.length) {
    return res.json({ msg: "No activities found", data: [] });
  }

  return res.json({ msg: "Got activities", data: response });
};

const post = async (req, res) => {
  const { title, restaurant_required } = req.body;

  const response = await db("activities")
    .insert({
      title: title,
      restaurant_required: restaurant_required,
      user_id: req.user.id,
      date_created: new Date(),
    })
    .returning("id");

  const id = response[0]?.id;

  if (!id) {
    throw new Error("Could not create activity");
  }

  return res.json({
    msg: "Created activity",
    data: {
      id: id,
    },
  });
};

const put = async (req, res) => {
  const { id } = req.params;
  const { title, restaurant_required } = req.body;

  const response = await db("activities")
    .where({ user_id: req.user.id, id: id })
    .update({
      title: title,
      restaurant_required: restaurant_required,
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

  await db("activities").where({ user_id: req.user.id, id: id }).del();

  res.json({ msg: "Deleted activity" });
};

module.exports = {
  get,
  getAll,
  post,
  put,
  del,
};
