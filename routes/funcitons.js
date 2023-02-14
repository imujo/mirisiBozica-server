const db = require("../config/database");

const addEvent = async () => {
  try {
    const data = await db("events")
      .insert({
        date_created: new Date(),
      })
      .returning("id");

    const id = data[0]?.id;

    if (!id) {
      throw new Error("Could not add event");
    }

    return id;
  } catch (error) {
    console.error("ERROR - routes/functions - addEvent: \n", error);
    return undefined;
  }
};

const getEventId = async (tableName, id) => {
  try {
    const data = await db(tableName).where({ id: id }).select("event_id");

    const event_id = data[0]?.event_id;

    if (!event_id) {
      throw new Error("No event id found");
    }

    return event_id;
  } catch (error) {
    console.error("ERROR - routes/functions - addEvent: \n", error);
    return undefined;
  }
};

module.exports = { addEvent, getEventId };
