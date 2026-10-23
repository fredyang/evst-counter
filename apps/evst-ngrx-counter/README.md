# EVST NgRx Counter

A copy of the NgRx counter prepared for refactoring to EVST. The current
implementation retains the original NgRx state, effects, UI, and behavior.

## Running locally

From the repository root:

```sh
npm install
npm start --workspace evst-ngrx-counter
```

The development server uses `http://localhost:4202/` by default.

## Verifying changes

```sh
npm run build --workspace evst-ngrx-counter
npm test --workspace evst-ngrx-counter -- --watch=false
npm run lint --workspace evst-ngrx-counter
```
