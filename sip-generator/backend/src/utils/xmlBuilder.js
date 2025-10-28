const { XMLBuilder } = require("fast-xml-parser");
const crypto = require("crypto");

const buildSipXML = (data) => {
  const builder = new XMLBuilder({
    format: true,
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    processEntities: false,
    suppressEmptyNode: true,
  });

  const dataHoraRegistro = new Date().toISOString();

  // Gera hash do conteúdo como epilogo
  const hashContent = crypto
    .createHash("sha256")
    .update(JSON.stringify(data))
    .digest("hex");

  const xmlObject = {
    "?xml": { "@_version": "1.0", "@_encoding": "ISO-8859-1" },
    mensagemSIP: {
      cabecalho: {
        identificacaoTransacao: {
          tipoTransacao: "ENVIO_SIP",
          sequencialTransacao: data.sequencialTransacao || "1",
          dataHoraRegistroTransacao: dataHoraRegistro,
        },
        origem: {
          registroANS: data.registroANS,
        },
        destino: {
          cnpj: "33883888000169", // CNPJ fixo da ANS
        },
        versaoPadrao: "1.02",
        identificacaoSoftwareGerador: {
          nomeAplicativo: "SIP Generator",
          versaoAplicativo: "1.0",
          fabricanteAplicativo: "Gerador SIP",
        },
      },
      mensagem: {
        operadoraParaANS: {
          sipOperadoraParaAns: {
            dataTrimestreReconhecimento: {
              dia: "01",
              mes: data.trimestre || "01",
              ano: data.ano || new Date().getFullYear(),
            },
            formaContratacao: {
              individualFamiliar: {
                segmentacao: buildSegmentacaoXML(data.individualFamiliar),
              },
              coletivoEmpresarial: {
                segmentacao: buildSegmentacaoXML(data.coletivoEmpresarial),
              },
              coletivoAdesao: {
                segmentacao: buildSegmentacaoXML(data.coletivoAdesao),
              },
            },
          },
        },
      },
      epilogo: {
        hash: hashContent,
      },
    },
  };

  return builder.build(xmlObject);
};

const buildSegmentacaoXML = (segmentacaoData) => {
  if (!segmentacaoData) return {};

  return {
    ambulatorial: buildQuadroAmbulatorial(segmentacaoData.ambulatorial),
    hospitalar: buildQuadroHospitalar(segmentacaoData.hospitalar),
    hospitalarObstetricia: buildQuadroHospitalarObstetricia(
      segmentacaoData.hospitalarObstetricia
    ),
    odontologico: buildQuadroOdontologico(segmentacaoData.odontologico),
  };
};

const buildQuadroAmbulatorial = (data) => {
  if (!data) return {};

  return {
    quadro: data.map((q) => ({
      dataTrimestreOcorrencia: {
        dia: "01",
        mes: q.mes,
        ano: q.ano,
      },
      uf: q.uf,
      itensConsultasMedicas: buildConsultasMedicas(q.consultasMedicas),
      itensOutrosAtendAmbu: buildOutrosAtendimentos(q.outrosAtendimentos),
      itensExames: buildExames(q.exames),
      itensTerapias: buildTerapias(q.terapias),
      itensDemDespMedHosp: buildDespesasMedHosp(q.despesasMedHosp),
    })),
  };
};

const buildQuadroHospitalar = (data) => {
  if (!data) return {};

  return {
    quadro: data.map((q) => ({
      dataTrimestreOcorrencia: {
        dia: "01",
        mes: q.mes,
        ano: q.ano,
      },
      uf: q.uf,
      ct_quadroHospInternacoes: buildInternacoes(q.internacoes),
      interObstetricas: buildInterObstetricas(q.interObstetricas),
      causaInterna: buildCausasInternas(q.causasInternas),
      demDespMedHosp: buildDespesasMedHosp(q.despesasMedHosp),
    })),
  };
};

const buildQuadroHospitalarObstetricia = (data) => {
  if (!data) return {};

  return {
    quadro: data.map((q) => ({
      dataTrimestreOcorrencia: {
        dia: "01",
        mes: q.mes,
        ano: q.ano,
      },
      uf: q.uf,
      ct_quadroHospObstInternacoes: buildInternacoes(q.internacoes),
      interObstetricas: buildInterObstetricas(q.interObstetricas),
      parto: buildParto(q.parto),
      causaInterna: buildCausasInternas(q.causasInternas),
      nascidoVivo: buildNascidoVivo(q.nascidoVivo),
      demDespMedHosp: buildDespesasMedHosp(q.despesasMedHosp),
    })),
  };
};

const buildQuadroOdontologico = (data) => {
  if (!data) return {};

  return {
    quadro: data.map((q) => ({
      dataTrimestreOcorrencia: {
        dia: "01",
        mes: q.mes,
        ano: q.ano,
      },
      uf: q.uf,
      procOdonto: buildProcOdonto(q.procedimentosOdonto),
    })),
  };
};

// Funções auxiliares para construir cada seção específica
const buildConsultasMedicas = (data) => {
  if (!data) return {};
  return {
    consultasMedicas: {
      eventos: data.eventos || 0,
      beneficiarios: data.beneficiarios || 0,
      despesas: formatDespesa(data.despesas),
    },
  };
};

const buildOutrosAtendimentos = (data) => {
  if (!data) return {};
  return {
    outrosAtendAmb: {
      eventos: data.eventos || 0,
      beneficiarios: data.beneficiarios || 0,
      despesas: formatDespesa(data.despesas),
    },
  };
};

const buildExames = (data) => {
  if (!data) return {};
  return {
    exames: {
      eventos: data.eventos || 0,
      beneficiarios: data.beneficiarios || 0,
      despesas: formatDespesa(data.despesas),
    },
  };
};

const buildTerapias = (data) => {
  if (!data) return {};
  return {
    terapias: {
      eventos: data.eventos || 0,
      beneficiarios: data.beneficiarios || 0,
      despesas: formatDespesa(data.despesas),
    },
  };
};

const buildInternacoes = (data) => {
  if (!data) return {};
  return {
    tipoInternacao: {
      eventos: data.eventos || 0,
      beneficiarios: data.beneficiarios || 0,
      despesas: formatDespesa(data.despesas),
    },
  };
};

const buildInterObstetricas = (data) => {
  if (!data) return {};
  return {
    obstetrica: {
      eventos: data.eventos || 0,
    },
  };
};

const buildParto = (data) => {
  if (!data) return {};
  return {
    partoNormal: {
      eventos: data.partoNormal?.eventos || 0,
    },
    partoCesareo: {
      eventos: data.partoCesareo?.eventos || 0,
    },
  };
};

const buildCausasInternas = (data) => {
  if (!data) return {};
  return {
    neoplasias: {
      eventos: data.neoplasias?.eventos || 0,
    },
    diabetesMellitus: {
      eventos: data.diabetesMellitus?.eventos || 0,
    },
    doencasAparelhoCirc: {
      eventos: data.doencasAparelhoCirc?.eventos || 0,
    },
  };
};

const buildNascidoVivo = (data) => {
  if (!data) return {};
  return {
    eventos: data.eventos || 0,
  };
};

const buildProcOdonto = (data) => {
  if (!data) return {};
  return {
    procedimentosOdonto: {
      eventos: data.eventos || 0,
      beneficiarios: data.beneficiarios || 0,
      despesas: formatDespesa(data.despesas),
    },
  };
};

const buildDespesasMedHosp = (data) => {
  if (!data) return {};
  return {
    demaisDespMedHosp: {
      despesas: formatDespesa(data.despesas),
    },
  };
};

// Função para formatar valores monetários no padrão exigido
const formatDespesa = (value) => {
  if (!value) return "0,00";
  return value.toFixed(2).replace(".", ",");
};

module.exports = {
  buildSipXML,
};
