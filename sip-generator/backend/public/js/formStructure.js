// Este arquivo define a estrutura hierárquica dos formulários
// com base nos schemas XSD (sipcomplextypev1_02.xsd).
// A estrutura é usada para gerar dinamicamente os campos no HTML.

// Tipos de campo:
// Eve: Apenas eventos
// EveBen: Eventos e Beneficiários
// EveDes: Eventos e Despesas
// EveBenDes: Eventos, Beneficiários e Despesas
// Des: Apenas Despesas

const formStructure = {
  ambulatorial: {
    "A. Consultas Médicas": {
      prefix: "consultasMedicas",
      type: "EveBenDes",
      children: {
        "1. Consultas médicas ambulatoriais": {
          prefix: "consultasMedicasAmb",
          type: "EveBenDes",
          children: {
            "1.1 Alergia e Imunologia": {
              prefix: "alergiaImunologia",
              type: "Eve",
            },
            "1.2 Angiologia": { prefix: "angiologia", type: "Eve" },
            "1.3 Cardiologia": { prefix: "cardiologia", type: "Eve" },
            "1.4 Cirurgia geral": { prefix: "cirurgiaGeral", type: "Eve" },
            "1.5 Clínica médica": { prefix: "clinicaMedica", type: "Eve" },
            "1.6 Dermatologia": { prefix: "dermatologia", type: "Eve" },
            "1.7 Endocrinologia": { prefix: "endocrinologia", type: "Eve" },
            "1.8 Gastroenterologia": {
              prefix: "gastroenterologia",
              type: "Eve",
            },
            "1.9 Geriatria": { prefix: "geriatria", type: "Eve" },
            "1.10 Ginecologia e Obstetrícia": {
              prefix: "ginecologiaObstetricia",
              type: "Eve",
            },
            "1.11 Hematologia": { prefix: "hematologia", type: "Eve" },
            "1.12 Mastologia": { prefix: "mastologia", type: "Eve" },
            "1.13 Nefrologia": { prefix: "nefrologia", type: "Eve" },
            "1.14 Neurocirurgia": { prefix: "neurocirurgia", type: "Eve" },
            "1.15 Neurologia": { prefix: "neurologia", type: "Eve" },
            "1.16 Oftalmologia": { prefix: "oftalmologia", type: "Eve" },
            "1.17 Oncologia": { prefix: "oncologia", type: "Eve" },
            "1.18 Otorrinolaringologia": {
              prefix: "otorrinolaringologia",
              type: "Eve",
            },
            "1.19 Pediatria": { prefix: "pediatria", type: "Eve" },
            "1.20 Proctologia": { prefix: "proctologia", type: "Eve" },
            "1.21 Psiquiatria": { prefix: "psiquiatria", type: "Eve" },
            "1.22 Reumatologia": { prefix: "reumatologia", type: "Eve" },
            "1.23 Tisiopneumologia": {
              prefix: "tisiopneumologia",
              type: "Eve",
            },
            "1.24 Traumatologia-ortopedia": {
              prefix: "traumatologiaOrtopedica",
              type: "Eve",
            },
            "1.25 Urologia": { prefix: "urologia", type: "Eve" },
          },
        },
        "2. Consultas médicas em Pronto Socorro": {
          prefix: "consultaMedProntSoc",
          type: "EveBenDes",
        },
      },
    },
    "B. Outros Atendimentos Ambulatoriais": {
      prefix: "outrosAtendAmb",
      type: "EveBenDes",
      children: {
        "1. Consultas/sessões com Fisioterapeuta": {
          prefix: "consultaSessaoFisio",
          type: "Eve",
        },
        "2. Consultas/sessões com Fonoaudiólogo": {
          prefix: "consultaSessaoFono",
          type: "Eve",
        },
        "3. Consultas/sessões com Nutricionista": {
          prefix: "consultaSessaoNutri",
          type: "Eve",
        },
        "4. Consultas/sessões com Terapeuta Ocupacional": {
          prefix: "consultaSessaoTerap",
          type: "Eve",
        },
        "5. Consultas/sessões com Psicólogo": {
          prefix: "consultaSessaoPsico",
          type: "Eve",
        },
      },
    },
    "C. Exames": {
      prefix: "exames",
      type: "EveBenDes",
      children: {
        "1. Ressonância magnética": {
          prefix: "ressonanciaMagnet",
          type: "Eve",
        },
        "2. Tomografia computadorizada": {
          prefix: "tomografiaComputa",
          type: "Eve",
        },
        "3. Procedimento diagn. em citopatologia cérvico-vaginal oncótica (25-59 anos)":
          { prefix: "procedDiagnCitopat", type: "EveBen" },
        "4. Densitometria óssea": { prefix: "densitometriaOssea", type: "Eve" },
        "5. Ecodopplercardiograma transtorácico": {
          prefix: "ecodopplerTranstora",
          type: "Eve",
        },
        "6. Broncoscopia com ou sem biopsia": {
          prefix: "broncoscopiabiopsia",
          type: "Eve",
        },
        "7. Endoscopia digestiva alta": {
          prefix: "endoscopiaDigestiva",
          type: "Eve",
        },
        "8. Colonoscopia": { prefix: "colonoscopia", type: "Eve" },
        "9. Holter de 24 horas": { prefix: "holter24h", type: "Eve" },
        "10. Mamografia convencional e digital": {
          prefix: "mamografiaConvDig",
          type: "Eve",
          children: {
            "10.1 Mamografia em mulheres de 50 a 69 anos": {
              prefix: "mamografia50a69",
              type: "EveBen",
            },
          },
        },
        "11. Cintilografia miocárdica": {
          prefix: "cintilografiaMiocard",
          type: "Eve",
        },
        "12. Cintilografia renal dinâmica": {
          prefix: "cintilografiaRenal",
          type: "Eve",
        },
        "13. Hemoglobina glicada": {
          prefix: "hemoglobinaGlicada",
          type: "Eve",
        },
        "14. Pesquisa de sangue oculto nas fezes (50-69 anos)": {
          prefix: "pesqSangueOculto",
          type: "EveBen",
        },
        "15. Radiografia": { prefix: "radiografia", type: "Eve" },
        "16. Teste ergométrico": { prefix: "testeErgometrico", type: "Eve" },
        "17. Ultra-sonografia de abdome total": {
          prefix: "ultraSonAbdoTotal",
          type: "Eve",
        },
        "18. Ultra-sonografia de abdome inferior": {
          prefix: "ultraSonAbdoInfer",
          type: "Eve",
        },
        "19. Ultra-sonografia de abdome superior": {
          prefix: "ultraSonAbdoSuper",
          type: "Eve",
        },
        "20. Ultra-sonografia obstétrica morfológica": {
          prefix: "ultraSonObstMorfo",
          type: "Eve",
        },
      },
    },
    "D. Terapias": {
      prefix: "terapias",
      type: "EveBenDes",
      children: {
        "1. Transfusão ambulatorial": {
          prefix: "transfusaoAmbulatorial",
          type: "Eve",
        },
        "2. Quimioterapia sistêmica": {
          prefix: "quimioSistemica",
          type: "Eve",
        },
        "3. Radioterapia megavoltagem": {
          prefix: "radioterapiaMegavolt",
          type: "Eve",
        },
        "4. Hemodiálise aguda": { prefix: "hemodialiseAguda", type: "Eve" },
        "5. Hemodiálise crônica": { prefix: "hemodialiseCronica", type: "Eve" },
        "6. Implante de dispositivo intrauterino - DIU": {
          prefix: "implanteDispIntrauterino",
          type: "Eve",
        },
      },
    },
    "H. Demais Despesas Médico-Hospitalares": {
      prefix: "demaisDespMedHosp",
      type: "Des",
    },
  },
  // TODO: Adicionar estruturas para 'hospitalar', 'hospitalarObstetricia', e 'odontologico'
};
