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
          sequencialTransacao: data.cabecalho.sequencialTransacao,
          dataHoraRegistroTransacao: data.cabecalho.dataHoraRegistro,
        },
        origem: {
          registroANS: data.cabecalho.registroANS,
          cnpj: data.cabecalho.cnpj,
          nomeOperadora: data.cabecalho.nomeOperadora,
        },
        destino: {
          registroANS: "253390", // ANS
        },
        versaoPadrao: data.cabecalho.versaoPadrao,
        identificacaoSoftwareGerador: {
          nomeAplicativo: data.softwareGerador.nomeAplicativo,
          versaoAplicativo: data.softwareGerador.versaoAplicativo,
          fabricanteAplicativo: data.softwareGerador.fabricanteAplicativo,
        },
      },
      mensagem: {
        operadoraParaANS: {
          sipOperadoraParaAns: {
            dataTrimestreReconhecimento: {
              dia: "01",
              mes: data.periodoReconhecimento.trimestreReconhecimento,
              ano: data.periodoReconhecimento.anoReconhecimento,
            },
            formaContratacao: {
              individualFamiliar: buildContratacaoXML(
                data.formasContratacao.individualFamiliar
              ),
              coletivoEmpresarial: buildContratacaoXML(
                data.formasContratacao.coletivoEmpresarial
              ),
              coletivoAdesao: buildContratacaoXML(
                data.formasContratacao.coletivoAdesao
              ),
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

const buildContratacaoXML = (contratacao) => {
  if (!contratacao) return {};

  const segmentacoes = contratacao.segmentacao.map((seg) => {
    const segXML = {};
    const tiposSegmentacao = [
      "ambulatorial",
      "hospitalar",
      "hospitalarObstetricia",
      "odontologico",
    ];

    tiposSegmentacao.forEach((tipo) => {
      if (seg[tipo]) {
        segXML[tipo] = buildSegmentacaoEspecificaXML(seg[tipo], tipo);
      }
    });

    if (seg.camposPersonalizados) {
      segXML.camposPersonalizados = seg.camposPersonalizados;
    }

    return segXML;
  });

  return { segmentacao: segmentacoes };
};

const buildSegmentacaoEspecificaXML = (segmentacao, tipo) => {
  if (!segmentacao) return {};

  const processarCamposPersonalizados = (camposPersonalizados) => {
    if (!camposPersonalizados || !Array.isArray(camposPersonalizados))
      return [];

    return camposPersonalizados.map((grupo) => {
      const grupoXML = {};

      for (const [nomeGrupo, valores] of Object.entries(grupo)) {
        const grupoElemento = {
          nome: nomeGrupo,
        };

        for (const [chave, valor] of Object.entries(valores)) {
          if (typeof valor === "number") {
            grupoElemento[chave] = valor.toString().replace(".", ",");
          } else {
            grupoElemento[chave] = valor;
          }
        }

        grupoXML[nomeGrupo] = grupoElemento;
      }

      return grupoXML;
    });
  };

  const quadros = segmentacao.quadro
    ? segmentacao.quadro.map((quadro) => {
        const quadroXML = {
          dataTrimestreOcorrencia: quadro.dataTrimestreOcorrencia,
          uf: quadro.uf,
        };

        // Adicionar campos específicos de cada tipo de segmentação
        switch (tipo) {
          case "ambulatorial":
            quadroXML.itensConsultasMedicas = buildConsultasMedicas(
              quadro.consultasMedicas
            );
            quadroXML.itensOutrosAtendAmbu = buildOutrosAtendimentos(
              quadro.outrosAtendimentos
            );
            quadroXML.itensExames = buildExames(quadro.exames);
            quadroXML.itensTerapias = buildTerapias(quadro.terapias);
            quadroXML.itensDemDespMedHosp = buildDespesasMedHosp(
              quadro.despesasMedHosp
            );
            break;
          case "hospitalar":
            quadroXML.ct_quadroHospInternacoes = buildInternacoes(
              quadro.internacoes
            );
            quadroXML.interObstetricas = buildInterObstetricas(
              quadro.interObstetricas
            );
            quadroXML.causaInterna = buildCausasInternas(quadro.causasInternas);
            quadroXML.demDespMedHosp = buildDespesasMedHosp(
              quadro.despesasMedHosp
            );
            break;
          case "hospitalarObstetricia":
            quadroXML.ct_quadroHospObstInternacoes = buildInternacoes(
              quadro.internacoes
            );
            quadroXML.interObstetricas = buildInterObstetricas(
              quadro.interObstetricas
            );
            quadroXML.parto = buildParto(quadro.parto);
            quadroXML.causaInterna = buildCausasInternas(quadro.causasInternas);
            quadroXML.nascidoVivo = buildNascidoVivo(quadro.nascidoVivo);
            quadroXML.demDespMedHosp = buildDespesasMedHosp(
              quadro.despesasMedHosp
            );
            break;
          case "odontologico":
            quadroXML.procOdonto = buildProcOdonto(quadro.procedimentosOdonto);
            break;
        }

        // Adicionar campos personalizados
        if (quadro.camposPersonalizados) {
          quadroXML.camposPersonalizados = processarCamposPersonalizados(
            quadro.camposPersonalizados
          );
        }

        return quadroXML;
      })
    : [];

  return { quadro: quadros };
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

// Funções auxiliares para construção de elementos XML

const buildConsultasMedicas = (consultasMedicas) => {
  if (!consultasMedicas) return [];
  return consultasMedicas.map((consulta) => ({
    consulta: {
      tipoConsulta: consulta.tipoConsulta,
      quantidade: consulta.quantidade.toString().replace(".", ","),
      valorTotal: consulta.valorTotal.toString().replace(".", ","),
    },
  }));
};

const buildOutrosAtendimentos = (outrosAtendimentos) => {
  if (!outrosAtendimentos) return [];
  return outrosAtendimentos.map((atendimento) => ({
    itemOutroAtendAmbu: {
      tipoAtendimento: atendimento.tipoAtendimento,
      quantidade: atendimento.quantidade.toString().replace(".", ","),
      valorTotal: atendimento.valorTotal.toString().replace(".", ","),
    },
  }));
};

const buildExames = (exames) => {
  if (!exames) return [];
  return exames.map((exame) => ({
    itemExame: {
      tipoExame: exame.tipoExame,
      quantidade: exame.quantidade.toString().replace(".", ","),
      valorTotal: exame.valorTotal.toString().replace(".", ","),
    },
  }));
};

const buildTerapias = (terapias) => {
  if (!terapias) return [];
  return terapias.map((terapia) => ({
    itemTerapia: {
      tipoTerapia: terapia.tipoTerapia,
      quantidade: terapia.quantidade.toString().replace(".", ","),
      valorTotal: terapia.valorTotal.toString().replace(".", ","),
    },
  }));
};

const buildDespesasMedHosp = (despesas) => {
  if (!despesas) return [];
  return despesas.map((despesa) => ({
    itemDespMedHosp: {
      tipoDespesa: despesa.tipoDespesa,
      quantidade: despesa.quantidade.toString().replace(".", ","),
      valorTotal: despesa.valorTotal.toString().replace(".", ","),
    },
  }));
};

const buildInternacoes = (internacoes) => {
  if (!internacoes) return [];
  return internacoes.map((internacao) => ({
    ct_internacao: {
      tipoInternacao: internacao.tipoInternacao,
      quantidade: internacao.quantidade.toString().replace(".", ","),
      valorTotal: internacao.valorTotal.toString().replace(".", ","),
    },
  }));
};

const buildInterObstetricas = (interObstetricas) => {
  if (!interObstetricas) return [];
  return interObstetricas.map((interObs) => ({
    interObs: {
      tipoInterObs: interObs.tipoInterObs,
      quantidade: interObs.quantidade.toString().replace(".", ","),
      valorTotal: interObs.valorTotal.toString().replace(".", ","),
    },
  }));
};

const buildCausasInternas = (causas) => {
  if (!causas) return [];
  return causas.map((causa) => ({
    ct_causaInterna: {
      tipoCausa: causa.tipoCausa,
      quantidade: causa.quantidade.toString().replace(".", ","),
      valorTotal: causa.valorTotal.toString().replace(".", ","),
    },
  }));
};

const buildParto = (partos) => {
  if (!partos) return [];
  return partos.map((parto) => ({
    ct_parto: {
      tipoParto: parto.tipoParto,
      quantidade: parto.quantidade.toString().replace(".", ","),
      valorTotal: parto.valorTotal.toString().replace(".", ","),
    },
  }));
};

const buildNascidoVivo = (nascidosVivos) => {
  if (!nascidosVivos) return [];
  return nascidosVivos.map((nascido) => ({
    nascidoVivo: {
      pesoNascimento: nascido.pesoNascimento.toString().replace(".", ","),
      quantidade: nascido.quantidade.toString().replace(".", ","),
    },
  }));
};

const buildProcOdonto = (procedimentosOdonto) => {
  if (!procedimentosOdonto) return [];
  return procedimentosOdonto.map((proc) => ({
    procedimentoOdonto: {
      tipoProcedimento: proc.tipoProcedimento,
      quantidade: proc.quantidade.toString().replace(".", ","),
      valorTotal: proc.valorTotal.toString().replace(".", ","),
    },
  }));
};

module.exports = {
  buildSipXML,
};
