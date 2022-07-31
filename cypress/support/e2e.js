/* eslint-disable @typescript-eslint/no-var-requires */
import '@testing-library/cypress/add-commands';

const getBySelector = (selector, value, options) => cy.get(`[${selector}=${value}]`, { ...options });

const setResolution = (size) => {
  // Viewport presets: https://docs.cypress.io/api/commands/viewport#Arguments
  if (size === 'desktop') {
    cy.viewport('macbook-15'); // 1440x900
  } else if (size === 'tablet') {
    cy.viewport('ipad-2'); // 768x1024
  } else if (size === 'mobile') {
    cy.viewport('iphone-8'); // 375x667
  } else {
    cy.viewport(size);
  }
};

// // Bind commands and functions
Cypress.Commands.add('getBySelector', getBySelector);
Cypress.Commands.add('setResolution', setResolution);
