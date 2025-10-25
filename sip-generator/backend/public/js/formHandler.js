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
