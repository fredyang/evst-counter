# Service Counter

An Angular counter using a shared `CounterService` with signals for state and
computed range warnings. The interface and styling match the counter template.

The service restores the saved count once when first injected. Increment and
decrement update the shared count; values outside -9 to 9 display a warning.
Backup saves the current count to localStorage and reports success or failure.
Both Restore buttons load the saved value. Restore failures reset the count to
zero. User interactions are tracked through `AnalyticsService`.

`ApiService` uses the localStorage key `counter`, shared by applications running
on the same origin.

## Running locally

From the repository root:

```sh
npm install
npm start --workspace svc-counter
```

The default development URL is `http://localhost:4201/`, allowing both counter
applications to run simultaneously.

## Verifying changes

```sh
npm run build --workspace svc-counter
npm test --workspace svc-counter -- --watch=false
npm run lint --workspace svc-counter
```
