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

module.exports = router;
