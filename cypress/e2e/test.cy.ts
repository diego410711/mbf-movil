describe("My First Test", () => {
  it("Visits the app root url", () => {
    cy.visit("/Inbox");
    cy.contains("#container", "Inbox");
  });
});
