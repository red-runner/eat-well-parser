// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />
/// <reference types="cypress-plugin-snapshots" />
/// <reference types="@testing-library/cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by custom attribute
     * @example cy.getBySelector('data-testid', 'my-custom-input', ...options)
     */
    getBySelector(
      selector: string,
      value: string,
      options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>
    ): Chainable<any>;

    /**
     * Custom command to set the Browser viewport
     * @example cy.setResolution('desktop')
     */
    setResolution(size: 'desktop' | 'tablet' | 'mobile' | Cypress.ViewportPreset): void;
  }
}
