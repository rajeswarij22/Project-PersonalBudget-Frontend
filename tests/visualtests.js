// cypress/integration/visual-test.js
const { appName, batchName } = require('../../applitools.config');
const { Eyes } = require('@applitools/eyes-cypress');

const eyes = new Eyes();
eyes.setApiKey('YOUR_APPLITOOLS_API_KEY');

describe('Example visual regression test', () => {
  it('should display page correctly', () => {
    cy.visit('/');
    eyes.open(cy, appName, batchName, { width: 800, height: 600 });

    // Add visual test steps
    cy.get('.hero').contains('Welcome to Personal Budget');
    
    eyes.checkWindow('Main Page');
    eyes.close();
  });
});
