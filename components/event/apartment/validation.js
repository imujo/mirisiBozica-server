const Joi = require("joi");

const schema = Joi.object({
  guest: Joi.string().max(30).required(),
  n_adults: Joi.number().required().min(1),
  n_children: Joi.number(),
  date_in: Joi.date().required(),
  date_out: Joi.date().min(Joi.ref("date_in")).required().messages({
    "date.min": "End date is greater than start date",
  }),
  bed_and_breakfast: Joi.bool(),
  price: Joi.number().min(0),
  details: Joi.string().allow(""),
  date_updated: Joi.date(),
}).options({ abortEarly: false });

module.exports = schema;
