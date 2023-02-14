const router = require("express").Router();
const db = require("../config/database");
const { addEvent, getEventId } = require("./funcitons");

// GET

router.put("/restaurant_event/id", async (req, res, next) => {
  try {
    const { user_id, restaurant_event_id } = req.query;

    const response = await db("restaurant_events")
      .where({ user_id: user_id, id: restaurant_event_id })
      .select();

    res.json({
      msg: "Successfuly updated restaurant event!",
      data: response[0],
    });
  } catch (error) {
    next(error);
  }
});

router.put("/restaurant_event/date", async (req, res, next) => {
  try {
    const { user_id, date } = req.query;

    const response = await db("restaurant_events")
      .where({ user_id: user_id, date: date })
      .select();

    res.json({
      msg: "Successfuly updated restaurant event!",
      data: response,
    });
  } catch (error) {
    next(error);
  }
});

// POST / UPDATE

router.post("/restaurant_event", async (req, res, next) => {
  try {
    const { user_id } = req.query;

    let event_id = await addEvent();
    if (!event_id) {
      throw new Error("Could not create event");
    }

    let restaurant_event_id = await db("restaurant_events")
      .insert({
        event_id: event_id,
        user_id: user_id,
        date_created: new Date(),
      })
      .returning("id");

    restaurant_event_id = restaurant_event_id[0]?.id;

    if (!restaurant_event_id) {
      throw new Error("Could not create restaurant event");
    }

    res.json({
      msg: "Successfuly created restaurant event!",
      data: { restaurant_event_id: restaurant_event_id },
    });
  } catch (error) {
    next(error);
  }
});

router.put("/restaurant_event", async (req, res, next) => {
  try {
    const {
      user_id,
      restaurant_event_id,
      guest,
      n_adults,
      n_children,
      start_time,
      end_time,
      date,
      details,
      price,
    } = req.query;

    const response = await db("restaurant_events")
      .where({ id: restaurant_event_id, user_id: user_id })
      .update({
        guest: guest,
        n_adults: n_adults,
        n_children: n_children,
        start_time: start_time,
        end_time: end_time,
        date: date,
        details: details,
        price: price,
        date_updated: new Date(),
      })
      .returning("id");

    const id = response[0]?.id;

    if (!id) throw new Error("Could not update resoraunt event");

    res.json({
      msg: "Successfuly updated restaurant event!",
      data: { id: id },
    });
  } catch (error) {
    next(error);
  }
});

// ROOM

router.put("/restaurant_event/room", async (req, res, next) => {
  try {
    const { user_id, restaurant_event_id, room_id } = req.query;

    let id = await db("restaurant_events")
      .where({ id: restaurant_event_id, user_id: user_id })
      .update({
        room_id: room_id,
        date_updated: new Date(),
      })
      .returning("id");

    id = id[0]?.id;

    if (!id) {
      throw new Error("Could not update restaurant room");
    }

    res.json({
      msg: "Successfuly updated restaurant room!",
      data: { restaurant_event_id: id },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/restaurant_event/room", async (req, res, next) => {
  try {
    const { user_id, restaurant_event_id } = req.query;

    let data = await db("restaurant_events")
      .where({ user_id: user_id, id: restaurant_event_id })
      .select("room_id");

    let room_id = data[0].room_id;

    res.json({
      msg: "Successfuly got restoraunt room id!",
      data: {
        room_id: room_id,
      },
    });
  } catch (error) {
    next(error);
  }
});

// TABLES

router.put("/restaurant_event/tables", async (req, res, next) => {
  try {
    const { user_id, restaurant_event_id, table_ids } = req.query;

    const event_id = await getEventId("restaurant_events", restaurant_event_id);

    await db("event_tables")
      .where({ event_id: event_id, user_id: user_id })
      .del();

    const tableData = table_ids.map((table_id) => {
      return {
        table_id: table_id,
        user_id: user_id,
        event_id: event_id,
        date_updated: new Date(),
      };
    });

    await db("event_tables").insert(tableData);

    res.json({
      msg: "Successfuly updated restaurant room!",
      data: {},
    });
  } catch (error) {
    next(error);
  }
});

router.get("/restaurant_event/tables", async (req, res, next) => {
  try {
    const { user_id, restaurant_event_id } = req.query;

    const event_id = await getEventId("restaurant_events", restaurant_event_id);
    console.log(event_id, user_id);

    if (!event_id) throw new Error("Could not get event id");

    const data = await db("event_tables")
      .where({ user_id: user_id, event_id: event_id })
      .select("table_id");

    const table_ids = data.map((el) => el.table_id);

    res.json({
      msg: "Successfuly got table ids!",
      data: {
        table_ids: table_ids,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
