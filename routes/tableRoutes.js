const { DatabaseError } = require("pg");
const db = require("../config/database");
const router = require("express").Router();

router.get("/table/id", async (req, res, next) => {
  try {
    const { table_id, user_id } = req.query;

    const data = await db("tables").where({ id: table_id }).select();

    if (!data.length) {
      throw new Error("No table found");
    }

    res.json({ msg: "Successfuly got table!", data: data });
  } catch (error) {
    next(error);
  }
});

router.post("/table", async (req, res, next) => {
  try {
    const { title, user_id, room_id, n_mjesta, posx, posy } = req.body;

    let id = await db("tables")
      .insert({
        user_id: user_id,
        title: title,
        room_id: room_id,
        n_mjesta: n_mjesta,
        posx: posx,
        posy: posy,
        date_created: new Date(),
      })
      .returning("id");

    id = id[0].id;

    res.json({ msg: "Successfully created table!", data: { id: id } });
  } catch (error) {
    console.log(error);
    if (error instanceof DatabaseError) {
      next(new Error("Database Error - not-null constraint violated"));
    } else {
      next(error);
    }
  }
});

router.put("/table", async (req, res, next) => {
  try {
    const { table_id, title, user_id, room_id, n_mjesta, posx, posy } =
      req.body;

    let id = await db("tables")
      .where({ id: table_id, user_id: user_id })
      .update({
        title: title,
        room_id: room_id,
        n_mjesta: n_mjesta,
        posx: posx,
        posy: posy,
        date_updated: new Date(),
      })
      .returning("id");

    id = id[0].id;

    res.json({ msg: "Successfully updated table!", data: { id: id } });
  } catch (error) {
    console.log(error);
    if (error instanceof DatabaseError) {
      next(new Error("Database Error - not-null constraint violated"));
    } else {
      next(error);
    }
  }
});

router.delete("/table/id", async (req, res, next) => {
  try {
    const { table_id, user_id } = req.query;

    const success = await db("tables")
      .where({ id: table_id, user_id: user_id })
      .del();

    if (!success) {
      throw new Error("Couldn't delete table");
    }

    res.json({ msg: "Successfuly deleted table!" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
