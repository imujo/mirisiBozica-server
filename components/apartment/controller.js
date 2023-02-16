const db = require("../../config/database");

const get = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const response = await db("apartments")
    .where({ id: id, user_id: user.id })
    .select()
    .first();

  if (!response) {
    return res.json({ msg: "No apartment found", data: null });
  }

  return res.json({ msg: "Got apartment", data: response });
};

const getAll = async (req, res) => {
  const response = await db("apartments")
    .where({ user_id: req.user.id })
    .select();

  if (!response.length) {
    return res.json({ msg: "No apartments found", data: [] });
  }

  return res.json({ msg: "Got apartments", data: response });
};

const post = async (req, res) => {
  const { title, capacity } = req.body;

  const response = await db("apartments")
    .insert({
      title: title,
      capacity: capacity,
      user_id: req.user.id,
      date_created: new Date(),
    })
    .returning("id");

  const id = response[0]?.id;

  if (!id) {
    throw new Error("Could not create apartment");
  }

  return res.json({
    msg: "Created apartment",
    data: {
      id: id,
    },
  });
};

const put = async (req, res) => {
  const { id } = req.params;
  const { title, capacity } = req.body;

  const response = await db("apartments")
    .where({ user_id: req.user.id, id: id })
    .update({
      title: title,
      capacity: capacity,
      date_updated: new Date(),
    })
    .returning("id");
  const response_id = response[0]?.id;

  if (!response_id) throw new Error("Could not update apartment");

  return res.json({
    msg: "Updated apartment",
    data: {
      id: response_id,
    },
  });
};

const del = async (req, res) => {
  const { id } = req.params;

  await db("apartments").where({ user_id: req.user.id, id: id }).del();

  res.json({ msg: "Deleted apartment" });
};

module.exports = {
  get,
  getAll,
  post,
  put,
  del,
};
