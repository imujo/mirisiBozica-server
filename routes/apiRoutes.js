const { DatabaseError } = require("pg");
const db = require("../config/database");
const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// multer - image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "layout_images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// middleware

const errorHandler = (error, request, response, next) => {
  console.error(`ERROR - ${error.message}`);
  const status = error.status || 400;
  response.status(status).json({ msg: error.message });
};

// EVENT

router.get("/", (req, res) => {
  res.send(
    `<h1>Upload Image</h1><form method="POST" action="/room" enctype="multipart/form-data"><input type="file"name="layout_image"> <input type="submit"></form>`
  );
});

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

// ROOM

router.get("/room/id", async (req, res, next) => {
  try {
    const { room_id, user_id } = req.query;

    const data = await db("rooms").where({ id: room_id }).select();

    if (!data.length) {
      throw new Error("No room found");
    }

    res.json({ msg: "Successfuly got room!", data: data });
  } catch (error) {
    next(error);
  }
});

router.post("/room", upload.single("layout_image"), async (req, res, next) => {
  // name in html layout_image
  try {
    const { title, user_id } = req.body;
    let file = req.file;

    if (!file) {
      // throw new Error("No image uploaded!");
      file = { path: "TEMP VALUE" };
    }

    let id = await db("rooms")
      .insert({
        user_id: user_id,
        title: title,
        layout_image_url: file.path,
        date_created: new Date(),
      })
      .returning("id");

    id = id[0].id;

    res.json({ msg: "Successfully created room!", data: { id: id } });
  } catch (error) {
    if (error instanceof DatabaseError) {
      next(new Error("Database Error - not-null constraint violated"));
    } else {
      next(error);
    }
  }
});

router.put("/room", upload.single("layout_image"), async (req, res, next) => {
  try {
    const { title, user_id, room_id } = req.body;
    let file = req.file;

    if (!file) {
      // throw new Error("No image uploaded!");
      file = { path: "TEMP_VALUE" };
    }

    let oldImagePath = await db("rooms")
      .where({ id: room_id })
      .select("layout_image_url");

    let deleteSuccess = await db("rooms")
      .where({ id: room_id })
      .update({ layout_image_url: null });

    if (oldImagePath.length) {
      oldImagePath = oldImagePath[0].layout_image_url;

      // fs.unlink(oldImagePath, (err) => {
      //   if (err) console.log(err);
      // }); // TODO catch error
    }

    let id = await db("rooms")
      .where({ id: room_id })
      .update({
        title: title + " 1111",
        layout_image_url: file.path,
        date_updated: new Date(),
      })
      .returning("id");

    id = id[0].id;

    res.json({ msg: "Successfully updated room!", data: { id: id } });
  } catch (error) {
    console.log(error);
    if (error instanceof DatabaseError) {
      next(new Error("Database Error - not-null constraint violated"));
    } else {
      next(error);
    }
  }
});

router.delete("/room/id", async (req, res, next) => {
  try {
    const { room_id, user_id } = req.query;

    const success = await db("rooms")
      .where({ id: room_id, user_id: user_id })
      .del();

    if (!success) {
      throw new Error("Couldn't delete room");
    }

    res.json({ msg: "Successfuly deleted room!" });
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

module.exports = router;
