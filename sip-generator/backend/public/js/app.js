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
