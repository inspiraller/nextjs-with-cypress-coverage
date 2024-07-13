/// <reference types="cypress" />
import React from 'react'
import {Button} from '../../src/component/Button';

describe('<Button />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Button >dd</Button>)
  })
})