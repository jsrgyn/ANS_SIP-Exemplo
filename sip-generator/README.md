# Gerador de SIP XML para ANS

Este projeto contém um backend Node.js/Express e um frontend em HTML/CSS/JS para gerar arquivos SIP XML em conformidade com as especificações da ANS (Agência Nacional de Saúde Suplementar), conforme o Manual SIP v1.02e (RN551).

## Estrutura do Projeto

```
sip-generator/
├── backend/
│   ├── src/
│   │   ├── controllers/sipController.js
│   │   ├── models/sipModel.js
│   │   ├── routes/sipRoutes.js
│   │   ├── validators/sipValidator.js
│   │   └── utils/xmlBuilder.js
│   ├── public/
│   │   ├── index.html
│   │   ├── css/style.css
│   │   └── js/
│   │       ├── app.js
│   │       └── formHandler.js
│   ├── package.json
│   └── server.js
└── README.md
```

## Como Executar

1. Navegue até a pasta `backend`:

   ```bash
   cd sip-generator/backend
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

4. Acesse a aplicação em seu navegador:
   - Interface do SIP: `http://localhost:3000/sip`
   - API: `http://localhost:3000/api`

## Funcionalidades

- **Geração de XML:** A rota `POST /api/generate-sip` recebe um JSON com os dados do formulário e retorna um arquivo XML.
- **Validação de Dados:** A rota `POST /api/validate-sip` valida os dados de entrada em relação ao schema definido e retorna se os dados são válidos ou não.
- **Interface Simples:** Um formulário web para inserir os dados necessários para a geração do SIP.
- **Preview e Download:** A interface exibe uma prévia do XML gerado e permite o download do arquivo `.xml`.
