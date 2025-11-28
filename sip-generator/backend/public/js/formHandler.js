// Utility to get form data as a nested object
function getFormData() {
  const form = document.getElementById("sip-form");
  const formData = new FormData(form);
  const data = {};

  for (const [key, value] of formData.entries()) {
    // Basic nesting for keys like 'produto.codigo'
    if (key.includes(".")) {
      const [parent, child] = key.split(".");
      if (!data[parent]) {
        data[parent] = {};
      }
      data[parent][child] = value;
    } else {
      data[key] = value;
    }
  }
  return data;
}

const formData = {
  // ... outros campos do formulário
};

formData.coletivoEmpresarial = coletarDadosContratacao("coletivoEmpresarial");
formData.coletivoAdesao = coletarDadosContratacao("coletivoAdesao");

function gerarXML() {
  // Coletar dados personalizados de todas as segmentações
  function coletarCamposPersonalizados(tipoContratacao, segmentacaoTipo) {
    const camposPersonalizados = [];
    const segmentacoesContainer = document.getElementById(
      `${tipoContratacao}Segmentacoes`
    );

    for (let i = 0; i < segmentacoesContainer.children.length; i++) {
      const camposContainer = document.getElementById(
        `${tipoContratacao}_${i}_${segmentacaoTipo}_campos`
      );

      if (camposContainer) {
        const grupos = camposContainer.querySelectorAll("fieldset");
        const gruposDados = {};

        grupos.forEach((grupo) => {
          const grupoNome = grupo.querySelector("legend").textContent;
          const grupoValores = {};

          grupo
            .querySelectorAll('input[type="number"], input[type="text"]')
            .forEach((input) => {
              const valorInput = input.value;
              if (valorInput) {
                const chave = input.name.split("_").pop();
                // Converter para número se for um campo numérico
                grupoValores[chave] =
                  input.type === "number"
                    ? parseFloat(valorInput.replace(",", "."))
                    : valorInput;
              }
            });

          if (Object.keys(grupoValores).length > 0) {
            gruposDados[grupoNome] = grupoValores;
          }
        });

        camposPersonalizados.push(gruposDados);
      }
    }

    return camposPersonalizados;
  }

  // Função para padronizar campos numéricos
  function normalizarNumero(valor) {
    // Converte vírgula para ponto e parseia como float
    return valor ? parseFloat(valor.toString().replace(",", ".")) : null;
  }

  const formData = {
    cabecalho: {
      cnpj: document.getElementById("cnpj").value,
      nomeOperadora: document.getElementById("nomeOperadora").value,
      registroANS: document.getElementById("registroANS").value,
      sequencialTransacao: document.getElementById("sequencialTransacao").value,
      dataHoraRegistro: document.getElementById("dataHoraRegistro").value,
      versaoPadrao: document.getElementById("versaoPadrao").value,
    },
    softwareGerador: {
      nomeAplicativo: document.getElementById("nomeAplicativo").value,
      versaoAplicativo: document.getElementById("versaoAplicativo").value,
      fabricanteAplicativo: document.getElementById("fabricanteAplicativo")
        .value,
    },
    periodoReconhecimento: {
      anoReconhecimento: document.getElementById("anoReconhecimento").value,
      trimestreReconhecimento: document.getElementById(
        "trimestreReconhecimento"
      ).value,
    },
    formasContratacao: {
      individualFamiliar: document.getElementById("habilitarIndividualFamiliar")
        .checked
        ? {
            segmentacoes:
              coletarDadosContratacao("individualFamiliar").segmentacoes,
            camposPersonalizados: {
              ambulatorial: coletarCamposPersonalizados(
                "individualFamiliar",
                "ambulatorial"
              ),
              hospitalar: coletarCamposPersonalizados(
                "individualFamiliar",
                "hospitalar"
              ),
              hospitalarObstetricia: coletarCamposPersonalizados(
                "individualFamiliar",
                "hospitalarObstetricia"
              ),
              odontologico: coletarCamposPersonalizados(
                "individualFamiliar",
                "odontologico"
              ),
            },
          }
        : null,
      coletivoEmpresarial: document.getElementById(
        "habilitarColetivoEmpresarial"
      ).checked
        ? {
            segmentacoes: coletarDadosContratacao("coletivoEmpresarial")
              .segmentacoes,
            camposPersonalizados: {
              ambulatorial: coletarCamposPersonalizados(
                "coletivoEmpresarial",
                "ambulatorial"
              ),
              hospitalar: coletarCamposPersonalizados(
                "coletivoEmpresarial",
                "hospitalar"
              ),
              hospitalarObstetricia: coletarCamposPersonalizados(
                "coletivoEmpresarial",
                "hospitalarObstetricia"
              ),
              odontologico: coletarCamposPersonalizados(
                "coletivoEmpresarial",
                "odontologico"
              ),
            },
          }
        : null,
      coletivoAdesao: document.getElementById("habilitarColetivoAdesao").checked
        ? {
            segmentacoes:
              coletarDadosContratacao("coletivoAdesao").segmentacoes,
            camposPersonalizados: {
              ambulatorial: coletarCamposPersonalizados(
                "coletivoAdesao",
                "ambulatorial"
              ),
              hospitalar: coletarCamposPersonalizados(
                "coletivoAdesao",
                "hospitalar"
              ),
              hospitalarObstetricia: coletarCamposPersonalizados(
                "coletivoAdesao",
                "hospitalarObstetricia"
              ),
              odontologico: coletarCamposPersonalizados(
                "coletivoAdesao",
                "odontologico"
              ),
            },
          }
        : null,
    },
  };

  // Validação básica
  if (!validarFormulario(formData)) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  console.log("Dados enviados:", JSON.stringify(formData, null, 2));
  fetch("/api/generate-sip", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      console.log("Resposta recebida:", response.status, response.statusText);
      if (!response.ok) {
        return response.text().then((errorText) => {
          console.error("Detalhes do erro:", errorText);
          throw new Error("Falha ao gerar XML: " + errorText);
        });
      }
      return response.text();
    })
    .then((xmlContent) => {
      // Criar e baixar arquivo XML
      const blob = new Blob([xmlContent], { type: "application/xml" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;

      // Nome do arquivo baseado nos dados do formulário
      const nomeArquivo = `SIP_${formData.cabecalho.cnpj}_${formData.periodoReconhecimento.anoReconhecimento}_${formData.periodoReconhecimento.trimestreReconhecimento}.xml`;
      a.download = nomeArquivo;

      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      a.remove();

      // Opcional: Mostrar preview do XML
      const previewModal = document.getElementById("xmlPreviewModal");
      const previewContent = document.getElementById("xmlPreviewContent");
      if (previewModal && previewContent) {
        previewContent.textContent = xmlContent;
        previewModal.style.display = "block";
      }
    })
    .catch((error) => {
      console.error("Erro ao gerar XML:", error);
      alert(
        "Erro ao gerar XML. Verifique os dados e tente novamente. Detalhes no console."
      );
    });
}

function validarFormulario(formData) {
  // Validações básicas
  if (
    !formData.cabecalho.cnpj ||
    !formData.cabecalho.nomeOperadora ||
    !formData.cabecalho.registroANS
  ) {
    return false;
  }
  return true;
}

function coletarDadosContratacao(tipoContratacao) {
  const contratacaoData = {
    segmentacoes: [],
  };

  const segmentacaoContainer = document.getElementById(
    `${tipoContratacao}Segmentacoes`
  );
  for (let i = 0; i < segmentacaoContainer.children.length; i++) {
    const segmentacaoDiv = segmentacaoContainer.children[i];
    const segmentacao = {};

    if (
      document.getElementById(
        `${tipoContratacao}_segmentacao_${i}_ambulatorial`
      ).checked
    ) {
      segmentacao.ambulatorial = {
        quadro: coletarQuadros(tipoContratacao, i, "ambulatorial"),
      };
    }
    if (
      document.getElementById(`${tipoContratacao}_segmentacao_${i}_hospitalar`)
        .checked
    ) {
      segmentacao.hospitalar = {
        quadro: coletarQuadros(tipoContratacao, i, "hospitalar"),
      };
    }
    if (
      document.getElementById(
        `${tipoContratacao}_segmentacao_${i}_hospitalarObstetricia`
      ).checked
    ) {
      segmentacao.hospitalarObstetricia = {
        quadro: coletarQuadros(tipoContratacao, i, "hospitalarObstetricia"),
      };
    }
    if (
      document.getElementById(
        `${tipoContratacao}_segmentacao_${i}_odontologico`
      ).checked
    ) {
      segmentacao.odontologico = {
        quadro: coletarQuadros(tipoContratacao, i, "odontologico"),
      };
    }

    contratacaoData.segmentacoes.push(segmentacao);
  }

  return contratacaoData;
}

function coletarQuadros(tipoContratacao, segmentacaoIndex, tipoQuadro) {
  const quadros = [];
  const quadrosContainer = document.getElementById(
    `${tipoContratacao}_${segmentacaoIndex}_${tipoQuadro}_quadros`
  );

  for (let i = 0; i < quadrosContainer.children.length; i++) {
    const quadroDiv = quadrosContainer.children[i];
    const quadro = {
      uf: document.getElementById(
        `${tipoContratacao}_${segmentacaoIndex}_${tipoQuadro}_${i}_uf`
      ).value,
      dataTrimestreOcorrencia: document.getElementById(
        `${tipoContratacao}_${segmentacaoIndex}_${tipoQuadro}_${i}_dataTrimestreOcorrencia`
      ).value,
      // Coletar outros campos do quadro
    };
    quadros.push(quadro);
  }

  return quadros;
}
