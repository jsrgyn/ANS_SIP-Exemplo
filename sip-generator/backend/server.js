const express = require("express");
const cors = require("cors");
const path = require("path");
const sipRoutes = require("./src/routes/sipRoutes");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", sipRoutes);

// Rota para servir a interface do SIP
app.get("/sip", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`Interface SIP disponível em http://localhost:${port}/sip`);
});
