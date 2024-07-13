
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
