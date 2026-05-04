# Implementation Briefs (Strategic, Fără Modificări Acum)

## Reguli globale de siguranță
- Nu promite vindecare garantată.
- Menține boundary medical explicit.
- Evită limbaj moralizator.
- Nu rupe compatibilitatea localStorage fără plan de migrare.

## FAZA 1 — Brief
- Scop: claritate UI/UX și flow de intrare.
- Fișiere permise (în implementare viitoare): `index.html`, `styles.css`, `app.js`.
- Fișiere interzise: pachete/config fără necesitate explicită.
- Acceptare:
  - onboarding clar;
  - terminologie română coerentă;
  - fără regresii funcționale.
- Prompt recomandat Codex:
  - “Optimizează flow-ul de onboarding și navigarea în aplicație, păstrând funcționalitatea actuală și tonul non-judicativ.”

## FAZA 2 — Brief
- Scop: extindere knowledge base.
- Permise: fișiere conținut noi + integrare render.
- Interzise: schimbări de scoring fără specificație.
- Acceptare:
  - secțiuni ‘Pe scurt / Aprofundează’ pentru conceptele-cheie.
- Prompt:
  - “Adaugă structură educațională modulară despre dependență, triggeri și coping, în română clară.”

## FAZA 3 — Brief
- Scop: protocoale craving/relapse complete.
- Permise: conținut protocol + logică recomandări.
- Interzise: ton alarmist, promisiuni medicale.
- Acceptare:
  - protocoale pentru scenarii majore + fallback.
- Prompt:
  - “Implementează protocoale acționabile pentru craving intens, dimineață, stres, social și revenire după slip.”

## FAZA 4 — Brief
- Scop: tracking + jurnal + weekly review.
- Permise: model date local + UI check-in/log/review.
- Interzise: colectare inutilă de date.
- Acceptare:
  - daily check-in rapid;
  - craving log util;
  - recomandări bazate pe pattern.
- Prompt:
  - “Adaugă tracking minim-suficient și jurnal scurt, conectate la recomandări.”

## FAZA 5 — Brief
- Scop: quiz educațional multi-mod.
- Permise: extindere banc itemi + scoring dimensional.
- Interzise: quiz excesiv de lung în modul Quick.
- Acceptare:
  - moduri Quick/Standard/Deep;
  - feedback per item.
- Prompt:
  - “Refă quiz-ul pe dimensiuni comportamentale și adaugă feedback educațional după fiecare răspuns.”

## FAZA 6 — Brief
- Scop: motor raport final personalizat.
- Permise: logică raport + template-uri recomandări.
- Interzise: verdicte patologizante.
- Acceptare:
  - puncte forte/vulnerabilități;
  - focus 24–72h + 7 zile;
  - decizie finală de acțiune.
- Prompt:
  - “Construiește raport final empatic, bazat pe quiz + tracking + jurnal.”

## FAZA 7 — Brief
- Scop: mentenanță și separare logică/conținut/UI.
- Permise: modularizare JS, mutare conținut în fișiere dedicate.
- Interzise: schimbare comportament fără teste de regresie.
- Acceptare:
  - reducere monolit;
  - extensibilitate ridicată.
- Prompt:
  - “Refactorizează aplicația în module clare (content/state/scoring/ui), fără schimbare de comportament.”

## Matrice risc pe faze
- Faza 1: dificultate medie, risc mediu, risc UX/regresii responsive.
- Faza 2: dificultate medie, risc mediu, risc ton/claritate.
- Faza 3: dificultate medie-ridicată, risc ridicat, risc recomandări nepotrivite.
- Faza 4: dificultate ridicată, risc ridicat, risc localStorage și complexitate.
- Faza 5: dificultate ridicată, risc ridicat, risc scoring și abandon.
- Faza 6: dificultate ridicată, risc ridicat, risc calitate feedback.
- Faza 7: dificultate ridicată, risc mediu-ridicat, risc regresii structurale.

## Pași de verificare recomandați (pentru toate fazele)
- Smoke test end-to-end (decizie -> quiz -> raport -> persist).
- Test localStorage (date noi, date vechi, date corupte).
- Review editorial română + ton.
- Review boundary medical.
- Test responsive mobile.

## Prompt de diagnostic în caz de eroare
- “Analizează regresia apărută după [faza], identifică cauza minimă (UI/state/scoring/storage), propune patch incremental fără refactor major și verifică explicit că tonul și boundary-ul medical au rămas conforme.”
