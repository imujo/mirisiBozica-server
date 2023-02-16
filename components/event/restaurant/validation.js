const Joi = require("joi");

const schema = Joi.object({
  guest: Joi.string().max(30).required(),
  n_adults: Joi.number().required(),
  n_children: Joi.number().required(),
  date: Joi.date().required(),
  start_time: Joi.date().required(),
  end_time: Joi.date().min(Joi.ref("start_time")).required().messages({
    "date.min": "End time is greater than start time",
  }),
  price: Joi.number(),
  details: Joi.string(),
  date_updated: Joi.date(),
});

module.exports = schema;
