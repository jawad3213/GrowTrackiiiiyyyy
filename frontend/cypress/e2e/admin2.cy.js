describe('Parcours Admin E2E', () => {
  beforeEach(() => {
    // Configuration initiale
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('http://localhost:5173');
  });

  it('Parcours complet de l\'administrateur', () => {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.space-x-4 > .py-2').click();
    
    // Vérifier que la page de login se charge
    cy.get('h2').should('contain', 'Log In');
    cy.get('img[alt="Logo"]').should('be.visible');
    
    // Remplir le formulaire de connexion
    cy.get('input[type="email"]')
      .should('be.visible')
      .type('elouansaidisoukaina@gmail.com')
      .should('have.value', 'elouansaidisoukaina@gmail.com');

    cy.get('input[type="password"]')
      .should('be.visible')
      .type('PASS1234')
      .should('have.value', 'PASS1234');

    // Cocher "Remember me"
    cy.get('input[type="checkbox"]').check();

    /* ==== Generated with Cypress Studio ==== */
    cy.get('.bg-purple-500').click();
    /* ==== End Cypress Studio ==== */
    
    // Soumettre le formulaire
    cy.get('button[type="submit"]')
      .should('contain', 'Log In')
      .click();
    
    // ====== SOLUTION PRECISE: Attendre le chargement complet du dashboard ======
    
    // 1. Intercepter TOUS les appels API du dashboard avant qu'ils se déclenchent
    cy.intercept('GET', '**/api/dashboard/Total_User').as('totalUser');
    cy.intercept('GET', '**/api/dashboard/differenceUser').as('userDifference');
    cy.intercept('GET', '**/api/dashboard/Total_Evaluation').as('totalEvaluation');
    cy.intercept('GET', '**/api/dashboard/differenceEvaluation').as('evaluationDifference');
    cy.intercept('GET', '**/api/dashboard/Involvement').as('involvement');
    cy.intercept('GET', '**/api/dashboard/Involvement_target').as('involvementTarget');
    cy.intercept('GET', '**/api/dashboard/flagged_evaluation').as('flaggedEvaluation');
    cy.intercept('GET', '**/api/dashboard/evaluation_source_overtime').as('evaluationSource');
    cy.intercept('GET', '**/api/dashboard/user_distribution_by_role').as('userDistribution');
    cy.intercept('GET', '**/api/dashboard/news_admin').as('newsAdmin');
    cy.intercept('GET', '**/api/dashboard/news_professor').as('newsProfessor');
    cy.intercept('GET', '**/api/csrf-token').as('csrfToken');

    // 2. Attendre la redirection vers le dashboard
    cy.url().should('include', '/dashboard');
    
    // 3. Attendre que la page dashboard commence à charger (titre visible)
    cy.contains('Welcome to Your Admin Dashboard').should('be.visible');
    cy.contains('SOUKAINA').should('be.visible');
    
    // 4. Attendre que TOUS les appels API critiques se terminent
    cy.wait([
      '@totalUser',
      '@userDifference', 
      '@totalEvaluation',
      '@evaluationDifference',
      '@involvement',
      '@involvementTarget'
    ], { timeout: 15000 }).then((interceptions) => {
      // Vérifier que les appels API principaux ont réussi
      interceptions.forEach((interception) => {
        expect(interception.response.statusCode).to.equal(200);
      });
    });

    // 5. Attendre les données des graphiques (peuvent être plus lentes)
    cy.wait([
      '@flaggedEvaluation',
      '@evaluationSource', 
      '@userDistribution'
    ], { timeout: 10000 }).then((interceptions) => {
      interceptions.forEach((interception) => {
        expect(interception.response.statusCode).to.equal(200);
      });
    });

    // 6. Vérifier que les composants principaux sont visibles et contiennent des données
    
    // EcommerceMetrics component (métriques principales)
    cy.get('[class*="grid"]').within(() => {
      // Vérifier qu'il y a des cartes de métriques visibles
      cy.get('[class*="col-span"]').should('have.length.greaterThan', 0);
    });

    // Attendre que les chiffres se chargent (pas juste des 0 ou des loaders)
    cy.get('body').then(($body) => {
      // Vérifier que les données sont chargées (plus de texte de chargement)
      if ($body.find('[class*="loading"]').length > 0) {
        cy.get('[class*="loading"]').should('not.exist');
      }
      if ($body.find('[class*="spinner"]').length > 0) {
        cy.get('[class*="spinner"]').should('not.exist');
      }
    });

    // 7. Attendre un délai supplémentaire pour que tous les composants se stabilisent
    cy.wait(2000);

    // 8. Vérification finale : s'assurer que la page est interactive
    cy.get('body').should('be.visible');
    cy.document().should('have.property', 'readyState', 'complete');
    
    // Maintenant Cypress Studio peut enregistrer sur une page complètement chargée
    cy.log('Dashboard complètement chargé - Prêt pour Cypress Studio');
  });
});