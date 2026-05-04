# Launch Prep

## Current Launch State

Smoke-Free Return is ready for a local share test, not a public launch claim.

It is a static app:
- `index.html`;
- `styles.css`;
- `app.js`;
- localStorage for streak and report state.

No account, backend, analytics, deploy, or public repository has been configured yet.

## First Share Goal

Find out whether a user understands the product quickly and whether the restart loop feels useful after relapse.

Primary feedback signal:
- clear in 10 seconds;
- emotionally safe;
- useful enough to try for 7 days;
- streak feels motivating, not punishing;
- report gives a next action.

## Manual Local Test

1. Open `index.html` in a browser.
2. Set a decision date.
3. Confirm the streak, level, progress bar, and badges render.
4. Complete the self-check.
5. Confirm the report appears and stays separate from the streak.
6. Use both copy buttons:
   - short plan;
   - feedback questions.
7. Resize the browser to phone width and check for overlap.

## Share Test Script

Give the tester this instruction:

Open the app, spend three minutes with it, and answer the five feedback questions at the bottom. Be honest about what felt clear, heavy, useful, vague, or worth returning to.

## Vercel Path When Approved

If the project becomes a Vite app later:
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

For the current static version, a public host only needs to serve:
- `index.html`;
- `styles.css`;
- `app.js`.

## Do Not Launch With These Claims

Avoid:
- cure claims;
- guaranteed success;
- medical advice positioning;
- "Allen Carr official" language;
- shame-based streak messaging.

Safe positioning:
- relapse reflection;
- restart planning;
- streak and micro-actions;
- self-guided support with medical boundary.

