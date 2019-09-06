/// <reference types="cypress" />

context('Actions', () => {
  beforeEach(() => {
    cy.viewport(1280, 700)
  })

  it('should register a basic user', () => {
    cy.visit('http://localhost:3000/entrar')
    cy.get('#authentication-options-register').click()
    cy.fixture('user').then(user => {
      cy.get('#form-new-account')
        .find('input')
        .each(element => {
          const elementName = element.attr('name')
          if (elementName) {
            cy.get(`#form-new-account input[name=${elementName}]`).type(
              elementName === 'email'
                ? `hello@fixture-${Date.now()}.io`
                : elementName === 'name'
                ? `${user[elementName]} ${Date.now()}`
                : user[elementName],
            )
          }
        })

      cy.get('#input-address-options > button:first').click()
      cy.get('#form-new-account').submit()
    })
  })
})
