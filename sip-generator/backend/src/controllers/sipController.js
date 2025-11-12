const sipValidator = require("../validators/sipValidator");
const xmlBuilder = require("../utils/xmlBuilder");

const generateSip = (req, res) => {
  const { error, value } = sipValidator.validate(req.body);

  if (error) {
    const errorMessages = error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
    }));
    return res.status(400).json({
      message: "Validation failed",
      errors: errorMessages,
    });
  }

  try {
    const xml = xmlBuilder.buildSipXML(value);
    res.header("Content-Type", "application/xml");
    res.status(200).send(xml);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error generating XML", error: err.message });
  }
};

const validateSip = (req, res) => {
  const { error } = sipValidator.validate(req.body);

  if (error) {
    return res.status(400).json({ isValid: false, errors: error.details });
  }

  res.status(200).json({ isValid: true });
};

module.exports = {
  generateSip,
  validateSip,
};
