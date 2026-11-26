# EVST Counter

An Angular workspace containing three implementations of the same counter. The
applications share a UI and persistence layer, making their state-management
approaches easy to compare.

| Application | State management | Development URL |
| --- | --- | --- |
| `svc-counter` | Angular signals in a service | `http://localhost:4200/` |
| `ngrx-counter` | NgRx Store and Effects | `http://localhost:4201/` |
| `evst-ngrx-counter` | EVST with NgRx | `http://localhost:4202/` |

Each application supports incrementing, decrementing, backing up, and restoring
the counter. The saved value uses browser local storage, and values outside the
range -9 to 9 cannot be backed up.

## Getting started

The workspace requires Node.js and npm. Dependencies are installed from the
repository root:

```sh
npm install
```

An application can then be started with its root script:

```sh
npm run svc-counter
npm run ngrx-counter
npm run evst-ngrx-counter
```

The applications use separate ports and can run at the same time. Browser local
storage is scoped by origin, so each port maintains its own saved counter value.

## Verifying changes

Builds, tests, and lint checks run through npm workspaces. Replace
`<application>` with `svc-counter`, `ngrx-counter`, or `evst-ngrx-counter`.

```sh
npm run build --workspace <application>
npm test --workspace <application> -- --watch=false
npm run lint --workspace <application>
```

## Workspace layout

```text
apps/
  ng-shared/          Shared persistence and analytics services
  svc-counter/        Service and signals implementation
  ngrx-counter/       NgRx Store and Effects implementation
  evst-ngrx-counter/  EVST implementation backed by NgRx
```

Application-specific details are available in each application's README.
