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