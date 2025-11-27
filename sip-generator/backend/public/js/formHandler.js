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
        ? coletarDadosContratacao("individualFamiliar")
        : null,
      coletivoEmpresarial: document.getElementById(
        "habilitarColetivoEmpresarial"
      ).checked
        ? coletarDadosContratacao("coletivoEmpresarial")
        : null,
      coletivoAdesao: document.getElementById("habilitarColetivoAdesao").checked
        ? coletarDadosContratacao("coletivoAdesao")
        : null,
    },
  };

  // Validação básica
  if (!validarFormulario(formData)) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  fetch("/api/gerar-sip", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Falha ao gerar XML");
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
      alert("Erro ao gerar XML. Verifique os dados e tente novamente.");
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
    segmentacao: [],
  };

  const segmentacaoContainer = document.getElementById(
    `${tipoContratacao}Segmentacao`
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

    contratacaoData.segmentacao.push(segmentacao);
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
