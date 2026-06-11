# StockPilot — Playwright UI Automation Suite

End-to-end UI automation for the [`../inventory-app`](../inventory-app) demo,
written in **TypeScript** with **Playwright Test** and structured around the
**Page Object Model (POM)** plus custom fixtures and utilities.

## Highlights / best practices used

- **Page Object Model** — every screen has a class under `pages/` that owns its
  selectors and actions. Specs read like behaviour, not DOM plumbing.
- **Custom fixtures** (`fixtures/`) inject ready-to-use page objects into tests.
- **Authenticated state reuse** — `global-setup.ts` logs in once and saves the
  storage state, so most specs start already logged in (faster, less flaky).
- **`data-testid` selectors** via `getByTestId` — resilient to copy/layout changes.
- **Web-first assertions & auto-waiting** — `expect(locator).toBeVisible()`,
  `expect.poll(...)`, no manual sleeps.
- **Test data factory** (`utils/dataFactory.ts`) keeps tests independent.
- **Tagging** — `@smoke` and `@regression` let you slice the suite.
- **Multi-browser** projects: Chromium, Firefox, WebKit.
- **Rich reporting** — list + HTML + JUnit (for CI).
- **Auto-starts the app** via the `webServer` config (no manual server step).

## Folder structure

```
playwright-tests/
├─ data/                 # Static test data (users, products)
│  ├─ users.ts
│  └─ products.ts
├─ fixtures/             # Custom Playwright fixtures
│  ├─ test-fixtures.ts   #   - injects page objects
│  └─ auth-fixtures.ts   #   - pre-authenticated test variant
├─ pages/                # Page Object Model classes
│  ├─ BasePage.ts        #   - shared base (toasts, navigation helpers)
│  ├─ LoginPage.ts
│  ├─ NavigationComponent.ts
│  ├─ DashboardPage.ts
│  ├─ ProductsPage.ts
│  ├─ AddProductPage.ts
│  ├─ InteractionsPage.ts
│  ├─ DynamicContentPage.ts
│  ├─ FramesPage.ts
│  └─ index.ts           #   - barrel export
├─ tests/                # Spec files (one per feature area)
│  ├─ auth.spec.ts
│  ├─ dashboard.spec.ts
│  ├─ products.spec.ts
│  ├─ add-product.spec.ts
│  ├─ interactions.spec.ts
│  ├─ dynamic-content.spec.ts
│  ├─ frames.spec.ts
│  └─ navigation.spec.ts
├─ utils/                # Reusable helpers
│  ├─ dataFactory.ts     #   - randomised valid test data
│  ├─ helpers.ts         #   - generic locator/format helpers
│  └─ logger.ts          #   - leveled logger
├─ global-setup.ts       # One-time login → storage state
├─ playwright.config.ts  # Projects, reporters, webServer, retries, traces
├─ tsconfig.json
├─ .env.example
└─ package.json
```

## Getting started

```bash
# 1) Install the app dependencies once (the suite starts the app automatically)
cd ../inventory-app && npm install && cd ../playwright-tests

# 2) Install test dependencies and browsers
npm install
npm run install:browsers
```

(Optional) copy the env file and adjust the base URL:

```bash
cp .env.example .env
```

## Running tests

| Command | What it does |
| --- | --- |
| `npm test` | Run the whole suite (all browsers). Auto-starts the app. |
| `npm run test:headed` | Run with a visible browser |
| `npm run test:ui` | Open the Playwright UI mode (great for debugging) |
| `npm run test:chromium` | Run only on Chromium |
| `npm run test:smoke` | Run only `@smoke` tagged tests |
| `npm run test:regression` | Run only `@regression` tagged tests |
| `npm run test:debug` | Step through with the inspector |
| `npm run report` | Open the last HTML report |
| `npm run codegen` | Record selectors/actions against the app |

> If you already have the app running on `http://localhost:5173`, the suite
> reuses it. Otherwise it launches `npm run dev` for the app automatically.

## How authentication works

1. `global-setup.ts` runs before the suite, logs in as `admin`, and writes the
   browser storage state to `.auth/admin.json`.
2. Specs that import from `fixtures/auth-fixtures.ts` start **already logged in**.
3. The `auth.spec.ts` file instead imports from `fixtures/test-fixtures.ts` so it
   can exercise the login flow from scratch.

## Writing a new test

```ts
import { test, expect } from '../fixtures/auth-fixtures'

test('example @smoke', async ({ productsPage }) => {
  await productsPage.open()
  await productsPage.search('Keyboard')
  await expect(productsPage.rows).toHaveCount(1)
})
```

Add new selectors/actions to the relevant page object — never put raw selectors
in a spec.
