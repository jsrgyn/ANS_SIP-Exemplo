const { XMLBuilder } = require("fast-xml-parser");

const buildSipXML = (data) => {
  const builder = new XMLBuilder({
    format: true,
    ignoreAttributes: false,
    suppressEmptyNode: true,
  });

  const xmlObject = {
    "?xml": { "@_version": "1.0", "@_encoding": "ISO-8859-1" },
    SIP: {
      "@_Versao": "1.02e",
      Cabecalho: {
        Identificacao: {
          CNPJ: data.cnpj,
          Nome: data.nomeOperadora,
          RegistroANS: data.registroANS,
        },
        // ... continue structure as per manual
      },
      // ... other main sections
    },
  };

  return builder.build(xmlObject);
};

module.exports = {
  buildSipXML,
};
