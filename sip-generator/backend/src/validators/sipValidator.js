const Joi = require("joi");

// Schema based on ANS SIP Manual and XSD schemas
const sipSchema = Joi.object({
  // Dados da operadora
  cnpj: Joi.string()
    .pattern(/^[0-9]{14}$/)
    .required()
    .messages({
      'string.pattern.base': 'CNPJ deve conter exatamente 14 dígitos numéricos'
    }),
  registroANS: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      'string.pattern.base': 'Registro ANS deve conter exatamente 6 dígitos numéricos'
    }),
  nomeOperadora: Joi.string().max(100).required(),

  // Dados da transação
  sequencialTransacao: Joi.number().integer().min(1).max(999999999999).required(),
  trimestre: Joi.string().valid('01', '04', '07', '10').required(),
  ano: Joi.number().integer().min(2010).max(new Date().getFullYear()).required(),

  // Dados de atendimento
  individualFamiliar: Joi.object({
    ambulatorial: Joi.array().items(Joi.object({
      mes: Joi.string().valid('01', '04', '07', '10').required(),
      ano: Joi.number().integer().min(2002).required(),
      uf: Joi.string().valid(
        'NC', 'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO',
        'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ',
        'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'
      ).required(),
      consultasMedicas: Joi.object({
        eventos: Joi.number().integer().min(0).max(99999999).required(),
        beneficiarios: Joi.number().integer().min(0).max(9999999).required(),
        despesas: Joi.number().precision(2).min(0).max(99999999999.99).required()
      }).required()
    })),
    hospitalar: Joi.array().items(Joi.object({
      mes: Joi.string().valid('01', '04', '07', '10').required(),
      ano: Joi.number().integer().min(2002).required(),
      uf: Joi.string().valid(
        'NC', 'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO',
        'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ',
        'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'
      ).required(),
      internacoes: Joi.object({
        eventos: Joi.number().integer().min(0).max(99999999).required(),
        beneficiarios: Joi.number().integer().min(0).max(9999999).required(),
        despesas: Joi.number().precision(2).min(0).max(99999999999.99).required()
      }).required()
    }))
  }),

  coletivoEmpresarial: Joi.object().pattern(/.*/, Joi.object()),
  coletivoAdesao: Joi.object().pattern(/.*/, Joi.object())
});

const validate = (data) => {
  return sipSchema.validate(data, { abortEarly: false });
};

module.exports = {
  validate,
};
