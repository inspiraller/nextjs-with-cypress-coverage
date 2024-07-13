### Create Next project and re-arrange routes
1. `npx create-next-app lines --use-npm`
3. Repostion javascript file page.tsx into typescript file into src/ folder:
 ***/src/pages/index.tsx***
4. Clear .next folder ***rm -rf .next***
5. Fix global css problem:
   - mv globals.css global.css
   - rm app/Layout.tsx
   - Create page to import global.css:
  
**pages/_app.tsx**
```ts
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

import '@/app/global.css';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}
 
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}
 
export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  return <Component {...pageProps} />
}
```
##### run dev to test
 `npm run dev`

---

### Install Cypress
**useful links to try:**
- https://menaiala.medium.com/a-comprehensive-guide-to-cypress-integration-and-code-coverage-generation-in-nextjs-application-828838ba6cf3
- https://www.testingwithmarie.com/post/generating-code-coverage-report-for-cypress
- https://mickydore.medium.com/adding-code-coverage-to-your-cypress-e2e-tests-in-vite-37d6bcef0d57

**install deps**
1. `npm install cypress -D`

##### open cypress - to configure e2e
2. `npx cypress open`
3. window modal - accept
4. select e2e testing > continue > start E2E testing in Chrome > Scaffold example specs > okay got it > 
Close browser

##### fix tsconfig baseUrl
 > Missing baseUrl in compilerOptions. tsconfig-paths will be skipped
5. update tsconfig.json baseUrl to .

##### open cypress - to configure components
6. - create component/Button/Button.tsx
```ts
interface Props {
  children: React.ReactNode;
}
export const Button = ({children}: Props) => <button>{children}</button>
```
7. `npx cypress open`
8. select component testing > choose nextjs > next step > continue > start component testing in Chrome > Scaffold example specs > okay got it > 
9. Create your first spec - create from component (new) >  Select Button > ok run spec > passes and works
10. Close  browser
---

### Setup Cypress coverage
**follow guidelines**
- https://menaiala.medium.com/a-comprehensive-guide-to-cypress-integration-and-code-coverage-generation-in-nextjs-application-828838ba6cf3

1. npm install dependencies 
- `npm install  @testing-library/cypress @cypress/code-coverage @istanbuljs/nyc-config-typescript babel-plugin-istanbul babel-plugin-transform-import-meta nyc -D`

2. npm install non security risk babel deps: 
- `npm i babel-plugin-transform-class-properties@6.10.2 -D`


**add import to cypress/support/component.ts**
3. `import '@/app/global.css';`

##### Cypress Coverage config
1. add import to: cypress/support/e2e.ts: 
- `import '@cypress/code-coverage/support'`

2. add import to: cypress/support/component.ts: 
- `import '@cypress/code-coverage/support'`

3. update cypress.config.ts
```ts

import { defineConfig } from "cypress";
import codeCover from "@cypress/code-coverage/task"; // if require doesn't work, just import it
export default defineConfig({
  env: {
    codeCoverage: {
        exclude: ["cypress/**/*.*", "*/**/*.cy.tsx"],
    },
  },
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      codeCover(on, config);
      return config;
    },
  },
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
    setupNodeEvents(on, config) {
      codeCover(on, config);
      return config;
    },
  },
});
```

##### Create file: .babel_
**.babel_**
```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["next/babel"],
    env: {
      test: {
        plugins: ["babel-plugin-transform-import-meta", "transform-class-properties", "istanbul"],
      },
    },
  };
};
```
#### Create .nyrcrc
**.nycrc**
```js
{
  "extends": "@istanbuljs/nyc-config-typescript",
  "all": true,
  "extension": [".ts", ".tsx", ".css"],
  "exclude": [
    "cypress/**",
    "**/__fixtures__/**",
    "**/__mocks__/**",
    "**/__tests__/**",
    "coverage/**"
  ],
  "reporter": ["text-summary", "json", "html"],
  "instrumenter": "nyc",
  "sourceMap": false
}
```
##### Create files /scripts/babel/backup.js and /scripts/babel/restore.js from :
- https://github.com/alamenai/nextjs-cypress-code-coverage/blob/main/scripts/babel/restore.js

##### Add to package.json > scripts: {}
```json {
    "predev": "node scripts/babel/backup.js",
    "prebuild": "node scripts/babel/backup.js",
    "precypress-run-component": "node scripts/babel/restore.js",
    "precypress-open-component": "node scripts/babel/restore.js",
    "precypress-run-e2e": "node scripts/babel/restore.js",
    "precypress-open-e2e": "node scripts/babel/restore.js",
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "cypress-open-component": "cypress open --component",
    "cypress-open-e2e": "cypress open --e2e",
    "cypress-run-component": "cypress run --component --headless"
}
```

##### try running in two terminals
- `npm run dev`
- `npm run cypress-open-component`

> error cypress/support/component.ts
> Module build failed (from ./node_modules/next/dist/build/babel/loader/index.js):
SyntaxError: C:\baps\reactjs-projects\next-24-q3-with-cypress-coverage\cypress\support\component.ts: Missing semicolon. (10:7)

8 |
9 |
> 10 | declare global {
|        ^
11 |   namespace Cypress {
12 |     interface Chainable {


- add - '@babel/preset-typescript', to babelrc
```js
module.exports = {
  presets: [["next/babel"],  '@babel/preset-typescript'],
};
```

Try
- `npx cypress cache clear`
- `npx cypress install`
- `npx cypress open`
- re add into **cypress/support/component.ts**
```ts

import '@cypress/code-coverage/support'
```

- Try - creating
**cypress.d.ts**
```ts
/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    dataCy(value: string): Chainable<Element>;
  }
}
```
**tsconfig.json**
```json
{"compilerOptions": {
    "types": ["cypress", "node"], // cypress.d.ts here Causes error at top of { of tsonfig.json - Cannot find
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", "cypress.d.ts"],
}
```
- Try install
`npm i ts-node source-map-support @types/cypress__code-coverage @types/cypres -D 
