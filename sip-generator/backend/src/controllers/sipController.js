const sipValidator = require("../validators/sipValidator");
const xmlBuilder = require("../utils/xmlBuilder");
const xmlValidator = require("xml-validator");
const fs = require("fs");
const path = require("path");

const validateXMLSchema = (xmlContent) => {
  const schemaPath = path.resolve(__dirname, "../../schemas/sipV1_02.xsd");

  try {
    const xsdContent = fs.readFileSync(schemaPath, "utf8");
    const validationResult = xmlValidator.validate(xmlContent, xsdContent);

    return {
      isValid: validationResult.valid,
      errors: validationResult.valid ? [] : validationResult.errors,
    };
  } catch (error) {
    return {
      isValid: false,
      errors: [error.message],
    };
  }
};

const generateSip = (req, res) => {
  console.log(
    "Início da geração do SIP. Dados recebidos:\n",
    JSON.stringify(req.body, null, 2)
  );

  // Adicionando log para verificar a estrutura das formas de contratação
  if (req.body.formasContratacao) {
    console.log(
      "Estrutura das formas de contratação:",
      Object.keys(req.body.formasContratacao)
    );
  }

  const { error, value } = sipValidator.validate(req.body);

  if (error) {
    console.error("Erro de validação completo:", JSON.stringify(error, null, 2));
    const errorMessages = error.details.map((detail) => ({
      field: detail.path ? detail.path.join(".") : "Sem campo específico",
      message: detail.message,
      type: detail.type || "Erro desconhecido",
      context: detail.context,
    }));
    console.warn("Detalhes dos erros de validação:\n", 
      JSON.stringify(errorMessages, null, 2)
    );
    return res.status(400).json({
      message: "Falha na validação dos dados",
      errors: errorMessages,
    });
  }

  try {
    console.log("Dados validados com sucesso. Gerando XML...");
    console.log("Dados após validação:\n", JSON.stringify(value, null, 2));

    const xml = xmlBuilder.buildSipXML(value);
    console.log("XML gerado. Tamanho:", xml.length, "caracteres");

    // Validar XML contra XSD
    const schemaValidation = validateXMLSchema(xml);

    if (!schemaValidation.isValid) {
      console.error(
        "Falha na validação do esquema XML:\n",
        JSON.stringify(schemaValidation.errors, null, 2)
      );
      return res.status(400).json({
        message: "Falha na validação do esquema XML",
        errors: schemaValidation.errors.map((err) => ({
          message: err.message,
          location: err.location,
        })),
      });
    }

    console.log("XML validado com sucesso. Enviando resposta...");
    res.header("Content-Type", "application/xml");
    res.status(200).send(xml);
  } catch (err) {
    console.error("Erro crítico na geração do XML:\n", err);
    console.error("Detalhes do erro:", {
      message: err.message,
      stack: err.stack,
      name: err.name,
    });
    res.status(500).json({
      message: "Erro interno ao gerar XML",
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};

const validateSip = (req, res) => {
  const { error } = sipValidator.validate(req.body);

  if (error) {
    return res.status(400).json({ isValid: false, errors: error.details });
  }

  try {
    const xml = xmlBuilder.buildSipXML(req.body);
    const schemaValidation = validateXMLSchema(xml);

    res.status(200).json({
      isValid: schemaValidation.isValid,
      errors: schemaValidation.errors,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error validating SIP", error: err.message });
  }
};

module.exports = {
  generateSip,
  validateSip,
};
