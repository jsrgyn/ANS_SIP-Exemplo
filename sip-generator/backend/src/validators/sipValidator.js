const Joi = require("joi");

// Schema based on ANS SIP Manual (pages 15-45)
const sipSchema = Joi.object({
  cnpj: Joi.string()
    .pattern(/^[0-9]{14}$/)
    .required(),
  registroANS: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required(),
  nomeOperadora: Joi.string().max(100).required(),
  // Add other fields from the manual here
  // Example for product data:
  produto: Joi.object({
    codigo: Joi.string().max(20).required(),
    nomeComercial: Joi.string().max(100).required(),
    dataRegistro: Joi.date().iso().required(),
    // ... other product fields
  }).required(),
});

const validate = (data) => {
  return sipSchema.validate(data, { abortEarly: false });
};

module.exports = {
  validate,
};
