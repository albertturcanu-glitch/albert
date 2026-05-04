# Roadmap Upgrade — Stop Smoking

## Presupuneri declarate
- Presupunere: evoluția se face incremental, fără backend în primele faze.
- Presupunere: păstrăm poziționarea non-judicativă, non-clinică, cu limite medicale clare.

## FAZA 1 — Curățare sigură și polish UI/UX
- Obiectiv: claritate navigare, flow ghidat, coerență de limbaj română, reducere încărcare cognitivă.
- Dificultate: medie.
- Risc: mediu.
- Fișiere probabil afectate: `index.html`, `styles.css`, `app.js`.
- Ce nu trebuie stricat: localStorage existent, funcționalitate streak/quiz/raport.
- Criterii succes:
  - utilizatorul știe primii 2 pași în <30 sec;
  - consistență terminologică română;
  - fără regresii responsive.
- Verificare:
  - test manual desktop/mobile;
  - verificare contrast și focus states;
  - smoke test flow complet.

## FAZA 2 — Upgrade teorie / knowledge base
- Obiectiv: structură educațională clară “Pe scurt / Aprofundează”.
- Dificultate: medie.
- Risc: mediu.
- Fișiere probabil afectate: fișiere conținut noi + eventual `app.js`/`index.html` pentru render.
- Ce nu trebuie stricat: tonul empatic, boundary medical.
- Criterii succes:
  - conceptele-cheie explicate clar și practic;
  - separare între informație rapidă și profunzime.
- Verificare:
  - review editorial;
  - review de consistență terminologică.

## FAZA 3 — Upgrade protocol renunțare, craving, relapse
- Obiectiv: protocoale acționabile pe scenarii reale, inclusiv protocol de urgență.
- Dificultate: medie-ridicată.
- Risc: ridicat (impact pe logică de recomandare).
- Fișiere probabil afectate: conținut protocol + logică raport/recomandări.
- Ce nu trebuie stricat: simplitatea operațională (nu supraîncărca utilizatorul).
- Criterii succes:
  - protocoale clare pentru 24h/7 zile + trigger scenarios;
  - fallback explicit “do less, stay in the game”.
- Verificare:
  - walkthrough pe 5 scenarii de risc;
  - verificare ton non-rușinare.

## FAZA 4 — Upgrade tracking, jurnal, review săptămânal
- Obiectiv: colectare minim suficientă pentru pattern-uri și recomandări utile.
- Dificultate: ridicată.
- Risc: ridicat (model date + localStorage).
- Fișiere probabil afectate: logică state, UI formulare, raport.
- Ce nu trebuie stricat: performanță, simplitate input, confidențialitate locală.
- Criterii succes:
  - daily check-in <2 minute;
  - craving log util;
  - weekly review cu concluzii.
- Verificare:
  - test migrare date localStorage;
  - test edge cases (date corupte/empty).

## FAZA 5 — Upgrade quiz/autoevaluare
- Obiectiv: quiz educațional cu feedback per item și profil multi-dimensiune.
- Dificultate: ridicată.
- Risc: ridicat.
- Fișiere probabil afectate: banc întrebări, scoring, UI quiz, raport.
- Ce nu trebuie stricat: claritatea și durata rezonabilă a completării.
- Criterii succes:
  - moduri Quick/Standard/Deep;
  - explicații pentru răspunsuri greșite;
  - profil utilizabil în recomandări.
- Verificare:
  - test logic scoruri;
  - test persistență progres.

## FAZA 6 — Raport final / motor feedback
- Obiectiv: raport personalizat, empatic, cu focus 24–72h și 7 zile.
- Dificultate: ridicată.
- Risc: ridicat.
- Fișiere probabil afectate: logică raport, template output, integrare date tracking+quiz.
- Ce nu trebuie stricat: tonul de siguranță și evitarea supra-promisiunilor medicale.
- Criterii succes:
  - secțiuni: puncte forte, vulnerabilități, focus, plan fallback, escaladare suport.
- Verificare:
  - test pe profiluri sintetice diferite;
  - review de limbaj responsabil.

## FAZA 7 — Organizare cod și mentenanță
- Obiectiv: separare conținut/UI/logică/state pentru extensibilitate.
- Dificultate: ridicată.
- Risc: mediu-ridicat.
- Fișiere probabil afectate: structură proiect (module JS, content files).
- Ce nu trebuie stricat: comportamentul existent, cheile de storage, UX fluent.
- Criterii succes:
  - reducere monolit;
  - posibilitate de adăugare conținut fără schimbări masive de logică.
- Verificare:
  - regresie funcțională end-to-end;
  - checklist de mentenanță.

## Ce nu trebuie stricat în tot programul
- Mesajul non-judicativ.
- Boundary medical explicit.
- Funcțiile de bază deja utile (streak, self-check, raport scurt).
- Stabilitatea persistenței locale.
