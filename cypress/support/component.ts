
/// <reference types="cypress" />
import '@cypress/code-coverage/support';

// Alternatively you can use CommonJS syntax:
// require('./commands')

import './commands'
import { mount } from 'cypress/react18'

import '@/app/global.css';



Cypress.Commands.add('mount', mount)

// Example use:
// cy.mount(<MyComponent />)