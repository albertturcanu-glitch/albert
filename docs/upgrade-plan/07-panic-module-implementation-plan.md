# 07 — Panic Module Implementation Plan

## Scop
Modulul de panică trebuie sa ofere interventie imediata in sevraj/craving intens, prin 3 niveluri progresive de actiune, fara ton punitiv si fara promisiuni medicale absolute.

Principiu central:
**Stabilizeaza -> Rupe automatismul -> Escaladeaza in siguranta**.

## Etapa 1 — Definitie produs si reguli de siguranta
### Obiectiv
Clarificam ce este si ce nu este modulul de panica.

### Livrabile
- Definirea celor 3 niveluri (rapid, mediu, radical).
- Reguli de copy: calm, clar, non-judicativ.
- Boundary medical explicit.

### Riscuri
- Mesaje prea agresive sau prea vagi.
- Escaladare insuficienta in cazuri severe.

### Criterii de acceptare
- Fiecare nivel are actiuni concrete, executabile imediat.
- Limbajul nu rușineaza utilizatorul.
- Exista recomandare de suport specializat la nivelul 3.

### Verificare
- Review editorial pe ton.
- Checklist de siguranta medicala.

## Etapa 2 — Structura de date si configurare
### Obiectiv
Separarea continutului de logica (modular).

### Livrabile
- Model de date in `content-data.js` pentru `panicModule`.
- Campuri minime: `title`, `subtitle`, `intro`, `levels[]`.

### Riscuri
- Structura neuniforma care complica randarea.
- Hardcodari in `app.js`.

### Criterii de acceptare
- `panicModule` este consumat exclusiv din content layer.
- Poate fi extins fara modificari mari in orchestrator.

### Verificare
- Validare chei minime in modulul UI.
- Smoke test static pe structura datelor.

## Etapa 3 — UI/UX si progresie pe 3 niveluri
### Obiectiv
Interfata simpla in care butoanele apar/deblocheaza pe rand.

### Livrabile
- Tab nou in nav.
- Sectiune dedicata cu card panic.
- 3 butoane: Nivel 1, Nivel 2, Nivel 3.
- Panou output sugestii.

### Riscuri
- UX confuz in momente cu atentie scazuta.
- Deblocare incorecta a nivelurilor.

### Criterii de acceptare
- La start doar Nivel 1 activ.
- Dupa click pe Nivel 1 devine activ Nivel 2.
- Dupa click pe Nivel 2 devine activ Nivel 3.
- Fiecare click afiseaza sugestia nivelului curent.

### Verificare
- Test manual desktop + mobil.
- Test focus/keyboard navigation.

## Etapa 4 — Integrare logica si persistenta minima
### Obiectiv
Integram modulul in orchestration fara sa afectam flow-ul existent.

### Livrabile
- Wiring in `app.js`.
- Optional: status panic in local state (`lastPanicLevel`, `lastPanicAt`) pentru analytics local viitor.

### Riscuri
- Regresii in flow-ul quiz/tracking/raport.
- Dependente circulare intre module.

### Criterii de acceptare
- Modul panic functioneaza independent.
- Nu strica streak, quiz, tracking, raport.

### Verificare
- Smoke flow global:
  - start -> panic -> check-in -> quiz -> raport.

## Etapa 5 — Hardening si iteratie
### Obiectiv
Crestem robustetea si claritatea in cazuri reale de sevraj.

### Livrabile
- Buton „Reset modul panică”.
- Varianta scurta „1-click rescue” pentru acces instant.
- Mesaje de fallback cand utilizatorul nu poate continua.

### Riscuri
- Supraîncărcare de optiuni in moment critic.
- Inconsistenta de ton intre module.

### Criterii de acceptare
- Timp pana la prima actiune utila sub 10 sec.
- Utilizatorul poate relua secventa fara frictiune.

### Verificare
- Test scenarii: sevraj moderat / sever / slip recent.
- Review de consistenta ton pe intregul app.

## Fisiere implicate
- `content-data.js` — continut niveluri panic.
- `ui-renderers.js` — render card panic + output.
- `app.js` — wiring progresie niveluri.
- `index.html` — tab + sectiune panic.
- `styles.css` — stiluri panic module.

## Criteriu final de done
Modulul de panică este considerat complet cand utilizatorul, in mai putin de 10 secunde de la intrare, poate face o actiune concreta de evitare, iar daca aceasta nu ajunge, este ghidat progresiv spre interventii mai puternice si suport adecvat, fara rusinare.
