const Joi = require("joi");

// Schema based on ANS SIP Manual and XSD schemas
const sipSchema = Joi.object({
  // Dados da operadora
  cabecalho: Joi.object({
    cnpj: Joi.string()
      .pattern(/^[0-9]{14}$/)
      .required()
      .messages({
        "string.pattern.base":
          "CNPJ deve conter exatamente 14 dígitos numéricos",
      }),
    registroANS: Joi.string()
      .pattern(/^[0-9]{6}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Registro ANS deve conter exatamente 6 dígitos numéricos",
      }),
    nomeOperadora: Joi.string().max(100).required(),
    sequencialTransacao: Joi.string().required(),
    dataHoraRegistro: Joi.date().iso().required(),
    versaoPadrao: Joi.string().valid("1.02").required(),
  }).required(),

  softwareGerador: Joi.object({
    nomeAplicativo: Joi.string().max(70).required(),
    versaoAplicativo: Joi.string().max(70).required(),
    fabricanteAplicativo: Joi.string().max(70).required(),
  }).required(),

  periodoReconhecimento: Joi.object({
    anoReconhecimento: Joi.number()
      .integer()
      .min(2010)
      .max(new Date().getFullYear())
      .required(),
    trimestreReconhecimento: Joi.string()
      .valid("01", "04", "07", "10")
      .required(),
  }).required(),

  formasContratacao: Joi.object({
    individualFamiliar: Joi.object({
      // Aceita tanto 'segmentacao' quanto 'segmentacoes'
      segmentacao: Joi.array().items(
        Joi.object({
          ambulatorial: Joi.object().optional(),
          hospitalar: Joi.object().optional(),
          hospitalarObstetricia: Joi.object().optional(),
          odontologico: Joi.object().optional(),
          camposPersonalizados: Joi.array()
            .items(
              Joi.object().pattern(
                Joi.string(),
                Joi.object().pattern(
                  Joi.string(),
                  Joi.alternatives(
                    Joi.string(),
                    Joi.number(),
                    Joi.boolean(),
                    Joi.object()
                  )
                )
              )
            )
            .optional(),
        })
      ).optional(),
      segmentacoes: Joi.array().items(
        Joi.object({
          ambulatorial: Joi.object().optional(),
          hospitalar: Joi.object().optional(),
          hospitalarObstetricia: Joi.object().optional(),
          odontologico: Joi.object().optional(),
          camposPersonalizados: Joi.array()
            .items(
              Joi.object().pattern(
                Joi.string(),
                Joi.object().pattern(
                  Joi.string(),
                  Joi.alternatives(
                    Joi.string(),
                    Joi.number(),
                    Joi.boolean(),
                    Joi.object()
                  )
                )
              )
            )
            .optional(),
        })
      ).optional(),
    }).optional(),

    coletivoEmpresarial: Joi.object({
      segmentacao: Joi.array().items(
        Joi.object({
          ambulatorial: Joi.object().optional(),
          hospitalar: Joi.object().optional(),
          hospitalarObstetricia: Joi.object().optional(),
          odontologico: Joi.object().optional(),
          camposPersonalizados: Joi.array()
            .items(
              Joi.object().pattern(
                Joi.string(),
                Joi.object().pattern(
                  Joi.string(),
                  Joi.alternatives(
                    Joi.string(),
                    Joi.number(),
                    Joi.boolean(),
                    Joi.object()
                  )
                )
              )
            )
            .optional(),
        })
      ).optional(),
      segmentacoes: Joi.array().items(
        Joi.object({
          ambulatorial: Joi.object().optional(),
          hospitalar: Joi.object().optional(),
          hospitalarObstetricia: Joi.object().optional(),
          odontologico: Joi.object().optional(),
          camposPersonalizados: Joi.array()
            .items(
              Joi.object().pattern(
                Joi.string(),
                Joi.object().pattern(
                  Joi.string(),
                  Joi.alternatives(
                    Joi.string(),
                    Joi.number(),
                    Joi.boolean(),
                    Joi.object()
                  )
                )
              )
            )
            .optional(),
        })
      ).optional(),
    }).optional(),

    coletivoAdesao: Joi.object({
      segmentacao: Joi.array().items(
        Joi.object({
          ambulatorial: Joi.object().optional(),
          hospitalar: Joi.object().optional(),
          hospitalarObstetricia: Joi.object().optional(),
          odontologico: Joi.object().optional(),
          camposPersonalizados: Joi.array()
            .items(
              Joi.object().pattern(
                Joi.string(),
                Joi.object().pattern(
                  Joi.string(),
                  Joi.alternatives(
                    Joi.string(),
                    Joi.number(),
                    Joi.boolean(),
                    Joi.object()
                  )
                )
              )
            )
            .optional(),
        })
      ).optional(),
      segmentacoes: Joi.array().items(
        Joi.object({
          ambulatorial: Joi.object().optional(),
          hospitalar: Joi.object().optional(),
          hospitalarObstetricia: Joi.object().optional(),
          odontologico: Joi.object().optional(),
          camposPersonalizados: Joi.array()
            .items(
              Joi.object().pattern(
                Joi.string(),
                Joi.object().pattern(
                  Joi.string(),
                  Joi.alternatives(
                    Joi.string(),
                    Joi.number(),
                    Joi.boolean(),
                    Joi.object()
                  )
                )
              )
            )
            .optional(),
        })
      ).optional(),
    }).optional(),
  }).required(),
});

const validate = (data) => {
  console.log("Iniciando validação de dados SIP");

  const { error, value } = sipSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true, // Remove propriedades desconhecidas
    convert: true, // Converte tipos quando possível
  });

  if (error) {
    console.error("Erro de validação:", JSON.stringify(error.details, null, 2));

    // Log detalhado dos erros de validação
    const errorMessages = error.details.map((detail) => ({
      type: detail.type,
      path: detail.path,
      message: detail.message,
      context: detail.context,
    }));

    console.warn(
      "Detalhes dos erros de validação:\n",
      JSON.stringify(errorMessages, null, 2)
    );
  } else {
    console.log("Dados validados com sucesso");
  }

  return { error, value };
};

// Função adicional para validação mais detalhada
const validateSipData = (data) => {
  console.log("Validação detalhada do SIP iniciada");

  const result = validate(data);

  // Validações customizadas adicionais podem ser incluídas aqui
  if (!result.error) {
    // Exemplo: Validação adicional específica
    if (
      result.value.formasContratacao &&
      !Object.keys(result.value.formasContratacao).length
    ) {
      result.error = {
        details: [
          {
            message: "Deve haver pelo menos uma forma de contratação",
            path: ["formasContratacao"],
          },
        ],
      };
    }
  }

  return result;
};

module.exports = {
  validate,
};
