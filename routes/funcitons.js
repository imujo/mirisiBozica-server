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

const postEvent = async (tableName, userId) => {
  try {
    let event_id = await addEvent();
    if (!event_id) {
      throw new Error("Could not create event");
    }

    const response = await db(tableName)
      .insert({
        event_id: event_id,
        user_id: userId,
        date_created: new Date(),
      })
      .returning("id");

    const table_id = response[0]?.id;

    if (!table_id) {
      throw new Error("Could not create event");
    }

    return { data: table_id, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
};

const get = async (tableName, where, select = "*") => {
  try {
    const response = await db(tableName).where(where).select(select);

    return { data: response, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
};

const put = async (tableName, where, insertBody) => {
  try {
    const response = await db(tableName)
      .where(where)
      .update(insertBody)
      .returning("id");

    const id = response[0]?.id;

    if (!id) throw new Error("Could not update resoraunt event");

    return { data: id, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
};

const getSelect = async (
  tableName,
  user_id,
  specificEventId,
  connectionTableName,
  select
) => {
  try {
    const event_id = await getEventId(tableName, specificEventId);

    if (!event_id) throw new Error("Could not get event id");

    const data = await db(connectionTableName)
      .where({ user_id: user_id, event_id: event_id })
      .select(select);

    const ids = data.map((el) => el[select]);

    return { data: ids, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
};

const putSelect = async (
  tableName,
  connectionTableName,
  user_id,
  specificEventId,
  ids,
  propertyName
) => {
  try {
    const event_id = await getEventId(tableName, specificEventId);

    await db(connectionTableName)
      .where({ event_id: event_id, user_id: user_id })
      .del();

    const tableData = ids.map((id) => {
      return {
        [propertyName]: id,
        user_id: user_id,
        event_id: event_id,
        date_updated: new Date(),
      };
    });

    await db(connectionTableName).insert(tableData);

    return { data: {}, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
};

module.exports = {
  put,
  get,
  postEvent,
  getSelect,
  putSelect,
};
