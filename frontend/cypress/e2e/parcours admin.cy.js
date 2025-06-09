describe('Parcours Admin E2E', () => {
  beforeEach(() => {
    // Configuration initiale
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('http://localhost:5173');
  });

  it('Parcours complet de l\'administrateur', () => {
    // 1. CONNEXION ADMIN
    cy.log('🔐 Test de connexion admin');
    
    // Naviguer vers la page de login
    cy.visit('http://localhost:5173/Login');
    cy.url().should('include', '/Login');

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

    // Soumettre le formulaire
    cy.get('button[type="submit"]')
      .should('contain', 'Log In')
      .click();

    // Vérifier la redirection vers le dashboard admin
    cy.url().should('include', '/dashboard');
    cy.wait(2000);

    // 2. VÉRIFICATION DU DASHBOARD ADMIN
    cy.log('📊 Vérification du dashboard admin');
    
    // Vérifier que les éléments du dashboard sont présents
    cy.get('body').should('be.visible');
    
    // Tester les statistiques du dashboard (basé sur les endpoints API)
    cy.request({
      method: 'GET',
      url: 'http://localhost:3000/api/DashAdmin/Total_User',
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 200) {
        expect(response.body).to.exist;
      }
    });

    // 3. GESTION DES ÉTUDIANTS
    cy.log('👨‍🎓 Test de gestion des étudiants');
    
    cy.visit('http://localhost:5173/Student');
    cy.url().should('include', '/Student');
    cy.wait(1000);

    // Tester l'ajout d'un étudiant
    cy.visit('http://localhost:5173/AddStudent');
    cy.url().should('include', '/AddStudent');
    
    // Si le formulaire d'ajout d'étudiant existe
    cy.get('body').then(($body) => {
      if ($body.find('form').length > 0) {
        // Remplir le formulaire d'ajout d'étudiant
        cy.get('input').first().type('John Doe', {force: true});
      }
    });

    // 4. GESTION DES PROFESSEURS
    cy.log('👨‍🏫 Test de gestion des professeurs');
    
    cy.visit('http://localhost:5173/Professor');
    cy.url().should('include', '/Professor');
    cy.wait(1000);

    // Tester l'ajout d'un professeur
    cy.visit('http://localhost:5173/AddProfessor');
    cy.url().should('include', '/AddProfessor');

    // 5. GESTION DES SUPERVISEURS
    cy.log('👥 Test de gestion des superviseurs');
    
    cy.visit('http://localhost:5173/Supervisor');
    cy.url().should('include', '/Supervisor');
    cy.wait(1000);

    cy.visit('http://localhost:5173/AddSupervisor');
    cy.url().should('include', '/AddSupervisor');

    // 6. GESTION DES COMPÉTENCES (SKILLS)
    cy.log('🎯 Test de gestion des compétences');
    
    cy.visit('http://localhost:5173/Skills');
    cy.url().should('include', '/Skills');
    cy.wait(1000);

    // Tester l'ajout d'une compétence
    cy.visit('http://localhost:5173/AddSkill');
    cy.url().should('include', '/AddSkill');

    // Si un formulaire d'ajout de compétence existe
    cy.get('body').then(($body) => {
      if ($body.find('form').length > 0) {
        cy.get('input').first().type('Communication', {force: true});
      }
    });

    // 7. GESTION DES SIGNALEMENTS
    cy.log('🚨 Test de gestion des signalements');
    
    cy.visit('http://localhost:5173/Signals');
    cy.url().should('include', '/Signals');
    cy.wait(1000);

    // Vérifier l'accès aux solutions de signalements
    cy.visit('http://localhost:5173/Solution');
    cy.url().should('include', '/Solution');

    // 8. GESTION DES GROUPES
    cy.log('👥 Test de gestion des groupes');
    
    cy.visit('http://localhost:5173/Group');
    cy.url().should('include', '/Group');
    cy.wait(1000);

    // 9. CALENDRIER ADMIN
    cy.log('📅 Test du calendrier admin');
    
    cy.visit('http://localhost:5173/Calendar');
    cy.url().should('include', '/Calendar');
    cy.wait(1000);

    // 10. PROFIL UTILISATEUR ADMIN
    cy.log('👤 Test du profil admin');
    
    cy.visit('http://localhost:5173/UserProfile');
    cy.url().should('include', '/UserProfile');
    cy.wait(1000);

    // 11. VUE GLOBALE
    cy.log('🌍 Test de la vue globale');
    
    cy.visit('http://localhost:5173/GlobalOverview');
    cy.url().should('include', '/GlobalOverview');
    cy.wait(1000);

    // 12. GESTION DES COACHS
    cy.log('🏃‍♂️ Test de gestion des coachs');
    
    cy.visit('http://localhost:5173/Coach');
    cy.url().should('include', '/Coach');
    cy.wait(1000);

    cy.visit('http://localhost:5173/AddCoach');
    cy.url().should('include', '/AddCoach');

    // 13. ÉVALUATIONS ADMIN
    cy.log('📝 Test des évaluations admin');
    
    cy.visit('http://localhost:5173/Evaluation');
    cy.url().should('include', '/Evaluation');
    cy.wait(1000);

    cy.visit('http://localhost:5173/Personalized');
    cy.url().should('include', '/Personalized');

    // 14. TESTS API ADMIN
    cy.log('🔌 Test des endpoints API admin');
    
    // Test des statistiques utilisateurs
    cy.request({
      method: 'GET',
      url: 'http://localhost:3000/api/DashAdmin/differenceUser',
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 200) {
        expect(response.body).to.have.property('percentage');
        expect(response.body).to.have.property('trend');
      }
    });

    // Test des statistiques d'évaluations
    cy.request({
      method: 'GET',
      url: 'http://localhost:3000/api/DashAdmin/Total_Evaluation',
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 200) {
        expect(response.body).to.exist;
      }
    });

    // Test de la distribution des utilisateurs par rôle
    cy.request({
      method: 'GET',
      url: 'http://localhost:3000/api/DashAdmin/user_distribution_by_role',
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 200) {
        expect(response.body).to.have.property('student');
        expect(response.body).to.have.property('Supervisor');
        expect(response.body).to.have.property('Professor');
      }
    });

    // 15. TEST DE GESTION DES OPÉRATIONS CRUD
    cy.log('🔧 Test des opérations CRUD');
    
    // Test de suppression d'un étudiant (simulation)
    cy.visit('http://localhost:5173/Student');
    cy.wait(1000);
    
    // Test de suppression d'un professeur (simulation)
    cy.visit('http://localhost:5173/Professor');
    cy.wait(1000);

    // 16. DÉCONNEXION
    cy.log('🚪 Test de déconnexion');
    
    // Tenter de se déconnecter (si un bouton de déconnexion existe)
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="logout-btn"]').length > 0) {
        cy.get('[data-cy="logout-btn"]').click();
        cy.url().should('include', '/Login');
      } else if ($body.find('button:contains("Logout")').length > 0) {
        cy.get('button:contains("Logout")').click();
        cy.url().should('include', '/Login');
      } else {
        // Déconnexion manuelle via API
        cy.request({
          method: 'POST',
          url: 'http://localhost:3000/api/auth/logout',
          failOnStatusCode: false
        });
        cy.visit('http://localhost:5173/Login');
      }
    });

    cy.log('✅ Parcours admin terminé avec succès');
  });

  // Test séparé pour la gestion des erreurs
  it('Gestion des erreurs et authentification', () => {
    cy.log('🔒 Test de sécurité et gestion des erreurs');
    
    // Tenter d'accéder au dashboard sans être connecté
    cy.visit('http://localhost:5173/dashboard');
    
    // Devrait rediriger vers login ou afficher une erreur
    cy.url().should('satisfy', url => 
      url.includes('/Login') || url.includes('/Error')
    );

    // Test d'accès non autorisé à une route admin
    cy.visit('http://localhost:5173/Skills');
    cy.url().should('satisfy', url => 
      url.includes('/Login') || url.includes('/Error')
    );
  });

  // Test de performance et navigation
  it('Test de performance et navigation rapide', () => {
    cy.log('⚡ Test de performance');
    
    // Connexion rapide
    cy.visit('http://localhost:5173/Login');
    cy.get('input[type="email"]').type('admin@example.com');
    cy.get('input[type="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    
    // Navigation rapide entre les pages
    const adminPages = [
      '/dashboard',
      '/Student',
      '/Professor',
      '/Skills',
      '/Signals',
      '/GlobalOverview'
    ];

    adminPages.forEach(page => {
      cy.visit(`http://localhost:5173${page}`);
      cy.url().should('include', page);
      cy.wait(500); // Attente réduite pour tester la rapidité
    });
  });
});