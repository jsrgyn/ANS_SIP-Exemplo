document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("sip-form");
  const validateBtn = document.getElementById("validate-btn");
  const downloadBtn = document.getElementById("download-btn");
  const xmlOutput = document.getElementById("xml-output");

  let generatedXml = "";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = getFormData();

    try {
      const response = await fetch("http://localhost:3000/api/generate-sip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Validation failed");
      }

      generatedXml = await response.text();
      xmlOutput.textContent = generatedXml;
      downloadBtn.disabled = false;
    } catch (error) {
      alert(`Error: ${error.message}`);
      xmlOutput.textContent = "";
      downloadBtn.disabled = true;
    }
  });

  validateBtn.addEventListener("click", async () => {
    const formData = getFormData();

    try {
      const response = await fetch("http://localhost:3000/api/validate-sip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.isValid) {
        alert("Data is valid!");
      } else {
        const errorMessages = result.errors.map((e) => e.message).join("\n");
        alert(`Validation Errors:\n${errorMessages}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  });

  downloadBtn.addEventListener("click", () => {
    if (generatedXml) {
      const blob = new Blob([generatedXml], { type: "application/xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sip.xml";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  });
});

function adicionarSegmentacao(tipoContratacao) {
  const segmentacaoContainer = document.getElementById(
    `${tipoContratacao}Segmentacao`
  );
  const segmentacaoIndex = segmentacaoContainer.children.length;

  const segmentacaoDiv = document.createElement("div");
  segmentacaoDiv.classList.add("segmentacao");
  segmentacaoDiv.innerHTML = `
        <h4>Segmentação ${segmentacaoIndex + 1}</h4>
        <label for="${tipoContratacao}_segmentacao_${segmentacaoIndex}_ambulatorial">Ambulatorial:</label>
        <input type="checkbox" id="${tipoContratacao}_segmentacao_${segmentacaoIndex}_ambulatorial" onchange="toggleQuadro('${tipoContratacao}', ${segmentacaoIndex}, 'ambulatorial')">
        <div id="${tipoContratacao}_${segmentacaoIndex}_ambulatorial_quadro" style="display:none;">
            <h5>Quadro Ambulatorial</h5>
            <button type="button" onclick="adicionarQuadro('${tipoContratacao}', ${segmentacaoIndex}, 'ambulatorial')">Adicionar Quadro</button>
            <div id="${tipoContratacao}_${segmentacaoIndex}_ambulatorial_quadros"></div>
        </div>

        <label for="${tipoContratacao}_segmentacao_${segmentacaoIndex}_hospitalar">Hospitalar:</label>
        <input type="checkbox" id="${tipoContratacao}_segmentacao_${segmentacaoIndex}_hospitalar" onchange="toggleQuadro('${tipoContratacao}', ${segmentacaoIndex}, 'hospitalar')">
        <div id="${tipoContratacao}_${segmentacaoIndex}_hospitalar_quadro" style="display:none;">
            <h5>Quadro Hospitalar</h5>
            <button type="button" onclick="adicionarQuadro('${tipoContratacao}', ${segmentacaoIndex}, 'hospitalar')">Adicionar Quadro</button>
            <div id="${tipoContratacao}_${segmentacaoIndex}_hospitalar_quadros"></div>
        </div>

        <label for="${tipoContratacao}_segmentacao_${segmentacaoIndex}_hospitalarObstetricia">Hospitalar com Obstetrícia:</label>
        <input type="checkbox" id="${tipoContratacao}_segmentacao_${segmentacaoIndex}_hospitalarObstetricia" onchange="toggleQuadro('${tipoContratacao}', ${segmentacaoIndex}, 'hospitalarObstetricia')">
        <div id="${tipoContratacao}_${segmentacaoIndex}_hospitalarObstetricia_quadro" style="display:none;">
            <h5>Quadro Hospitalar com Obstetrícia</h5>
            <button type="button" onclick="adicionarQuadro('${tipoContratacao}', ${segmentacaoIndex}, 'hospitalarObstetricia')">Adicionar Quadro</button>
            <div id="${tipoContratacao}_${segmentacaoIndex}_hospitalarObstetricia_quadros"></div>
        </div>

        <label for="${tipoContratacao}_segmentacao_${segmentacaoIndex}_odontologico">Odontológico:</label>
        <input type="checkbox" id="${tipoContratacao}_segmentacao_${segmentacaoIndex}_odontologico" onchange="toggleQuadro('${tipoContratacao}', ${segmentacaoIndex}, 'odontologico')">
        <div id="${tipoContratacao}_${segmentacaoIndex}_odontologico_quadro" style="display:none;">
            <h5>Quadro Odontológico</h5>
            <button type="button" onclick="adicionarQuadro('${tipoContratacao}', ${segmentacaoIndex}, 'odontologico')">Adicionar Quadro</button>
            <div id="${tipoContratacao}_${segmentacaoIndex}_odontologico_quadros"></div>
        </div>
    `;
  segmentacaoContainer.appendChild(segmentacaoDiv);
}

function toggleQuadro(tipoContratacao, segmentacaoIndex, tipoQuadro) {
  const quadroDiv = document.getElementById(
    `${tipoContratacao}_${segmentacaoIndex}_${tipoQuadro}_quadro`
  );
  const checkbox = document.getElementById(
    `${tipoContratacao}_segmentacao_${segmentacaoIndex}_${tipoQuadro}`
  );
  quadroDiv.style.display = checkbox.checked ? "block" : "none";
}

function adicionarQuadro(tipoContratacao, segmentacaoIndex, tipoQuadro) {
  const quadrosContainer = document.getElementById(
    `${tipoContratacao}_${segmentacaoIndex}_${tipoQuadro}_quadros`
  );
  const quadroIndex = quadrosContainer.children.length;

  const quadroDiv = document.createElement("div");
  quadroDiv.classList.add("quadro");
  quadroDiv.innerHTML = `
        <h5>Quadro ${quadroIndex + 1}</h5>
        <label for="${tipoContratacao}_${segmentacaoIndex}_${tipoQuadro}_${quadroIndex}_uf">UF:</label>
        <input type="text" id="${tipoContratacao}_${segmentacaoIndex}_${tipoQuadro}_${quadroIndex}_uf" required>
        <label for="${tipoContratacao}_${segmentacaoIndex}_${tipoQuadro}_${quadroIndex}_dataTrimestreOcorrencia">Data Trimestre Ocorrência:</label>
        <input type="date" id="${tipoContratacao}_${segmentacaoIndex}_${tipoQuadro}_${quadroIndex}_dataTrimestreOcorrencia" required>
        <!-- Adicionar outros campos do quadro conforme necessário -->
    `;
  quadrosContainer.appendChild(quadroDiv);
}
