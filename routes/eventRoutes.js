const { DatabaseError } = require("pg");
const db = require("../config/database");
const router = require("express").Router();

// EVENT

router.get("/event/id", async (req, res, next) => {
  try {
    const { event_id, user_id } = req.query;

    const data = await db("events")
      .where({ id: event_id, user_id: user_id })
      .select();

    if (!data.length) {
      throw new Error("No event found");
    }

    res.json({ msg: "Successfuly got event!", data: data });
  } catch (error) {
    next(error);
  }
});

router.get("/event/date", async (req, res, next) => {
  try {
    const { date, user_id } = req.query;

    const data = await db("events")
      .where({ date: date, user_id: user_id })
      .select();

    if (!data.length) {
      throw new Error("No event found");
    }

    res.json({ msg: "Successfuly got event!", data: data });
  } catch (error) {
    next(error);
  }
});

router.post("/event", async (req, res, next) => {
  try {
    const {
      last_name,
      n_adults,
      n_children,
      room_id,
      table_id,
      phone_number,
      start_time,
      end_time,
      date,
      details,
      user_id,
    } = req.body;

    let id = await db("events")
      .insert({
        user_id: user_id,
        last_name: last_name,
        n_adults: n_adults,
        n_children: n_children ? n_children : 0,
        room_id: room_id,
        table_id: table_id,
        phone_number: phone_number,
        start_time: start_time,
        end_time: end_time,
        date: date,
        details: details,
        date_created: new Date(),
      })
      .returning("id");

    id = id[0].id;

    res.json({ msg: "Successfully created event!", data: { id: id } });
  } catch (error) {
    if (error instanceof DatabaseError) {
      next(new Error("Database Error - not-null constraint violated"));
    } else {
      next(error);
    }
  }
});

router.put("/event", async (req, res, next) => {
  try {
    const {
      event_id,
      last_name,
      n_adults,
      n_children,
      room_id,
      table_id,
      phone_number,
      start_time,
      end_time,
      date,
      details,
      user_id,
    } = req.body;

    let id = await db("events")
      .where({ id: event_id })
      .update({
        user_id: user_id,
        last_name: last_name,
        n_adults: n_adults,
        n_children: n_children,
        room_id: room_id,
        table_id: table_id,
        phone_number: phone_number,
        start_time: start_time,
        end_time: end_time,
        date: date,
        details: details,
        date_updated: new Date(),
      })
      .returning("id");

    id = id[0].id;

    res.json({ msg: "Successfully updated event!", data: { id: id } });
  } catch (error) {
    if (error instanceof DatabaseError) {
      next(new Error("Database Error - not-null constraint violated"));
    } else {
      next(error);
    }
  }
});

router.delete("/event/id", async (req, res, next) => {
  try {
    const { event_id, user_id } = req.query;

    const success = await db("events")
      .where({ id: event_id, user_id: user_id })
      .del();

    if (!success) {
      throw new Error("Couldn't delete event");
    }

    res.json({ msg: "Successfuly deleted event!" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
