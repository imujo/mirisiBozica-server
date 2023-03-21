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
    return new Error(error);
  }
};

const getEventId = async (tableName, id) => {
  try {
    const event_id = await db(tableName)
      .where({ id: id })
      .select("event_id")
      .first();

    return event_id?.event_id;
  } catch (error) {
    return new Error(error);
  }
};

const dateToFormatedDate = (date) => {
  return date.slice(0, 10);
};

module.exports = { addEvent, getEventId, dateToFormatedDate };
