describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/login')
    cy.get('input[name="username"]').type('admin')
    cy.get('input[name="password"]').type('admin')
    cy.get('button[type="submit"]').click()
    cy.url().should('eq', 'http://localhost:3000/')
    cy.window().then((window) => {
      expect(window.localStorage.getItem('auth')).to.exist
    })
  })
})
