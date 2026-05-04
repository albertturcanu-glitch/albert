window.STOP_SMOKING_CONTENT = (() => {
  const dimensions = {
    physical: { label: "dependenta fizica" },
    contextual: { label: "triggeri contextuali" },
    emotional: { label: "reglare emotionala" },
    readiness: { label: "pregatire pentru schimbare" },
    relapseRisk: { label: "risc de recadere" },
    coping: { label: "strategii de coping" },
    support: { label: "suport social" },
    selfTrust: { label: "autoeficacitate" }
  };

  const knowledgeItems = [
    {
      title: "Nicotina si dopamina",
      short: "Nicotina activeaza rapid recompensa. Disconfortul poate fi temporar, nu permanent.",
      deep: "Craving-ul poate aparea ca un val. Nu este dovada ca nu poti, ci un semnal ca sistemul asteapta rutina veche.",
      today: "Cand apare pofta, amana 10 minute si observa cum se schimba intensitatea."
    },
    {
      title: "Trigger, obicei, emotie",
      short: "Nu orice pofta vine din acelasi loc: context, oboseala, stres sau automatism.",
      deep: "Habit loop: cue -> rutina -> recompensa perceputa. Daca schimbi raspunsul in primele 90 secunde, bucla slabeste.",
      today: "Scrie triggerul principal de azi si un raspuns if-then."
    },
    {
      title: "Slip vs recadere",
      short: "Un slip este un episod. Recaderea apare cand episodul devine poveste permanenta.",
      deep: "Diferenta practica: dupa slip, revii in aceeasi zi la plan minim si reduci riscul de repetare.",
      today: "Foloseste formula: am avut un slip, dar aleg urmatoarea actiune utila."
    },
    {
      title: "Urge surfing",
      short: "Pofta se poate traversa in valuri scurte, fara negociere lunga.",
      deep: "Protocol 90 sec: opreste, respira lent, muta atentia si corpul, apoi reevalueaza la 10 minute.",
      today: "Alege un raspuns de 90 secunde pentru urmatorul craving."
    }
  ];

  const protocolItems = [
    {
      title: "Craving intens",
      text: "Stop 90 secunde, apa, respiratie, scoate accesul imediat si amana 10 minute."
    },
    {
      title: "Dimineata",
      text: "Ritual de 3 minute fara tigara: hidratare, aer, intentie pentru prima pauza."
    },
    {
      title: "Stres",
      text: "Separi problema reala de impuls. Alege coping scurt: mers, apa, respiratie."
    },
    {
      title: "Plictiseala",
      text: "Task de 3 minute + miscarea corpului + maini ocupate."
    },
    {
      title: "Cafea / alcool / social",
      text: "Schimba rutina, foloseste script scurt si pregateste o iesire tactica 2 minute."
    },
    {
      title: "Revenire dupa slip",
      text: "Slip != colaps. Noteaza contextul, reporneste azi, pastreaza invatarea."
    }
  ];

  const quizBanks = {
    quick: [
      {
        id: "q1",
        question: "Cand apare pofta, ce te trage cel mai des inapoi?",
        options: [
          ["Disconfort fizic", "physical", "Normal sa apara disconfort. Un raspuns scurt te ajuta sa treci valul."],
          ["Contextul (cafea/social)", "contextual", "Triggerii contextuali devin mai usor de gestionat cu plan if-then."],
          ["Stresul emotional", "emotional", "Reglarea emotionala invatata reduce nevoia de automatism."]
        ]
      },
      {
        id: "q2",
        question: "Cat de pregatit te simti sa continui azi?",
        options: [
          ["Foarte pregatit", "readiness", "Bun. Foloseste energia pentru un pas concret in urmatoarele ore."],
          ["Oscilez", "relapseRisk", "Oscilatia este comuna. Alege un protocol minim, nu un plan perfect."],
          ["Aproape blocat", "support", "Cand e greu, suportul extern poate reduce riscul de repetare."]
        ]
      },
      {
        id: "q3",
        question: "Ce te-ar ajuta cel mai mult acum?",
        options: [
          ["Un plan scurt", "coping", "Planul scurt este mai usor de executat la energie scazuta."],
          ["Confirmare ca pot reveni", "selfTrust", "Autoeficacitatea creste cand vezi dovezi mici de reusita."],
          ["Sa schimb mediul", "contextual", "Mediul poate face urmatoarea tigara mai greu de repetat."]
        ]
      }
    ],
    standard: [],
    deep: []
  };

  quizBanks.standard = [
    ...quizBanks.quick,
    {
      id: "q4",
      question: "Ce se intampla dupa un slip?",
      options: [
        ["Intru in rusine", "relapseRisk", "Rusinea prelungeste bucla. Inlocuieste-o cu inventar concret."],
        ["Revin repede", "selfTrust", "Revenirea rapida e semn de progres practic."],
        ["Aman pana maine", "readiness", "Amanarea creste costul revenirii. Un pas minim azi ajuta."]
      ]
    },
    {
      id: "q5",
      question: "Ai suport daca apare un moment greu?",
      options: [
        ["Da, clar", "support", "Suportul pregatit reduce impulsul in momente critice."],
        ["Partial", "support", "Defineste o persoana si un mesaj scurt de contact."],
        ["Nu", "support", "Fara suport creste riscul. Pregateste o optiune minima azi."]
      ]
    }
  ];

  quizBanks.deep = [
    ...quizBanks.standard,
    {
      id: "q6",
      question: "Care e zona ta vulnerabila dominanta?",
      options: [
        ["Fizic", "physical", "Pentru zona fizica, planul pe intervale scurte functioneaza mai bine."],
        ["Emotional", "emotional", "Emotiile intense cer raspunsuri scurte de reglare, nu autocritica."],
        ["Contextual", "contextual", "Schimbarile de mediu reduc repetarea automata."]
      ]
    },
    {
      id: "q7",
      question: "Ce strategie folosesti la primul semnal?",
      options: [
        ["Respiratie/miscare", "coping", "Foarte bine. Continua cu 90 secunde clare."],
        ["Negociere cu pofta", "relapseRisk", "Negocierea lunga oboseste. Scurteaza decizia prin protocol."],
        ["Nimic inca", "readiness", "Incepe cu o singura strategie simpla pentru urmatorul trigger."]
      ]
    }
  ];

  const panicModule = {
    title: "Modul panica",
    subtitle: "Pentru momentul in care sevrajul pare prea intens.",
    intro:
      "Apasa pe nivelul potrivit acum. Fiecare nivel adauga o interventie mai puternica. Nu trebuie sa treci prin toate daca primul te stabilizeaza.",
    rescueLabel: "1-click rescue",
    rescueSuggestion:
      "Stop acum 60 secunde. Respira lent, bea apa, iesi din context 2 minute si repeta: \"nu iau decizia asta in varful valului\".",
    resetLabel: "Reseteaza modul panica",
    fallbackMessage:
      "Daca pofta ramane foarte intensa, nu ramane singur cu ea. Cere sprijin medical sau de consiliere cat mai curand.",
    levels: [
      {
        id: "level1",
        label: "Nivel 1 - Oprire rapida",
        suggestion:
          "Respira 4 cicluri lent, bea apa rece, spune: \"e val, nu ordin\" si amana 10 minute."
      },
      {
        id: "level2",
        label: "Nivel 2 - Schimb context",
        suggestion:
          "Iesi fizic din locul triggerului, mergi 5 minute, tine mainile ocupate si trimite un mesaj scurt unei persoane de suport."
      },
      {
        id: "level3",
        label: "Nivel 3 - Interventie radicala",
        suggestion:
          "Rupe complet accesul imediat (arunca/muta sursa), activeaza protocolul de urgenta 20 minute si cere suport specializat daca intensitatea ramane foarte mare."
      }
    ]
  };

  return {
    dimensions,
    knowledgeItems,
    protocolItems,
    quizBanks,
    panicModule
  };
})();
