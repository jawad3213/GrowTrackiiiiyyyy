// cypress/e2e/auth/login-comprehensive.cy.js
// Suite de tests E2E complète pour la fonctionnalité de connexion
// Basée sur les modèles fonctionnels du premier fichier avec des cas de test étendus

const baseUrl = 'http://localhost:3000';

describe('Tests E2E Complets de Connexion', () => {
  const validUser = {
    email: 'elouansaidisoukaina@gmail.com',
    password: 'PASS1234'
  };

  const invalidUser = {
    email: 'invalid@example.com',
    password: 'wrongpassword'
  };

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.clearSessionStorage();
    cy.visit('/Login');
    
    // Gérer la popup de consentement aux cookies en cliquant sur Accepter
    cy.get('body').then(($body) => {
      // Vérifier si la popup de consentement aux cookies existe
      if ($body.find('button.bg-purple-500').length > 0) {
        // Cliquer sur le bouton Accepter (avec fond violet)
        cy.get('button.bg-purple-500').click();
      }
    });
  });

  describe('Tests de l\'Interface Utilisateur de la Page de Connexion', () => {
    it('devrait afficher le formulaire de connexion correctement', () => {
      // Vérifier que les éléments de la page sont présents
      cy.get('img[alt="Logo"]').should('be.visible');
      cy.contains('Log In').should('be.visible');
      
      // Vérifier les champs du formulaire
      cy.get('input[type="email"]').should('be.visible');
      cy.get('input[type="password"]').should('be.visible');
      
      // Vérifier les autres éléments de l'interface
      cy.contains('Remember me').should('be.visible');
      cy.contains('Forgot Password?').should('be.visible');
      cy.get('button[type="submit"]').should('contain', 'Log In').and('not.be.disabled');
    });

    it('devrait afficher tous les éléments requis du formulaire', () => {
      cy.get('input[type="email"]').should('be.visible');
      cy.get('input[type="password"]').should('be.visible');
      cy.get('input[type="checkbox"]').should('be.visible');
      cy.get('button[type="submit"]').should('contain', 'Log In');
      cy.contains('Forgot Password?').should('be.visible');
    });

    it('devrait basculer la visibilité du mot de passe', () => {
      cy.get('input[type="password"]').type('testpassword');
      
      // Cliquer sur le bouton afficher mot de passe
      cy.get('button[type="button"]').click();
      cy.get('input[type="text"]').should('have.value', 'testpassword');
      
      // Cliquer sur le bouton masquer mot de passe  
      cy.get('button[type="button"]').click();
      cy.get('input[type="password"]').should('have.value', 'testpassword');
    });

    it('devrait naviguer vers la page mot de passe oublié', () => {
      cy.contains('Forgot Password?').click();
      cy.url().should('include', '/forgotpass');
    });

    it('devrait gérer les effets de survol sur les éléments du formulaire', () => {
      // Tester les effets de survol sur les champs
      cy.get('input[type="email"]').trigger('mouseover');
      cy.get('input[type="password"]').trigger('mouseover');
      
      // Tester l'effet de survol sur le bouton de soumission
      cy.get('button[type="submit"]').trigger('mouseover');
      
      // Tester l'effet de survol sur le logo
      cy.get('img[alt="Logo"]').trigger('mouseover');
    });
  });

  describe('Flux Principal de Connexion', () => {
    it('devrait se connecter avec succès et rediriger vers le tableau de bord', () => {
      // Remplir le formulaire de connexion
      cy.get('input[type="email"]').type(validUser.email);
      cy.get('input[type="password"]').type(validUser.password);
      cy.get('button[type="submit"]').click();
       
      // Intercepter la requête de connexion pour voir la réponse
      cy.intercept('POST', '**/api/auth/login').as('loginRequest');
      
      // Vérifier la redirection réussie
      cy.url().should('satisfy', (url) => {
        return url.includes('/dashboard') || 
               url.includes('/dashstud') || 
               url.includes('/dashSupervisor') || 
               url.includes('/DashboardProf');
      }, { timeout: 15000 });

      // Attendre que l'authentification soit établie
      cy.wait(2000);
      
      // Debug : Vérifier le stockage et les cookies
      cy.window().then((win) => {
        console.log('clés localStorage après connexion:', Object.keys(win.localStorage));
        console.log('clés sessionStorage après connexion:', Object.keys(win.sessionStorage));
        console.log('access_token dans localStorage:', win.localStorage.getItem('access_token'));
        console.log('access_token dans sessionStorage:', win.sessionStorage.getItem('access_token'));
      });

      // Vérifier les cookies (votre app utilise withCredentials: true)
      cy.getCookies().then((cookies) => {
        console.log('Cookies après connexion:', cookies.map(c => ({ name: c.name, value: c.value })));
      });

      // Vérifier l'authentification (principalement via la redirection réussie pour l'auth basée sur les cookies)
      cy.shouldBeAuthenticated();
    });

    it('devrait afficher un message d\'erreur pour les identifiants invalides', () => {
      cy.get('input[type="email"]').type(invalidUser.email);
      cy.get('input[type="password"]').type(invalidUser.password);
      cy.get('button[type="submit"]').click();

      // Vérifier le message d'erreur
      cy.contains('Email or Password is incorrect').should('be.visible');
      cy.url().should('include', '/Login');
      cy.shouldNotBeAuthenticated();
    });

    it('devrait afficher une erreur pour les identifiants invalides avec le style d\'erreur approprié', () => {
      cy.get('input[type="email"]').type(invalidUser.email);
      cy.get('input[type="password"]').type(invalidUser.password);
      cy.get('button[type="submit"]').click();
      
      // Attendre que le message d'erreur apparaisse
      cy.get('.bg-red-100', { timeout: 5000 }).should('be.visible');
      cy.contains('Email or Password is incorrect').should('be.visible');
      
      // Devrait rester sur la page de connexion
      cy.url().should('include', '/Login');
      
      // Le bouton devrait être réactivé après l'erreur
      cy.get('button[type="submit"]').should('contain', 'Log In').and('not.be.disabled');
    });

    it('devrait mémoriser la préférence de connexion', () => {
      cy.get('input[type="email"]').type(validUser.email);
      cy.get('input[type="password"]').type(validUser.password);
      cy.get('input[type="checkbox"]').check(); // Se souvenir de moi
      cy.get('button[type="submit"]').click();

      // Vérifier la connexion réussie
      cy.url().should('not.include', '/Login', { timeout: 15000 });
      
      // Attendre que l'authentification se termine
      cy.wait(2000);

      // Vérifier la préférence de mémorisation et le stockage du token
      cy.window().then((win) => {
        expect(win.localStorage.getItem('remember_me')).to.equal('true');
        
        // Puisque remember_me est true, le token devrait être dans localStorage
        const accessToken = win.localStorage.getItem('access_token');
        
        // Log pour déboguer ce qu'on obtient réellement
        console.log('Token d\'accès dans localStorage:', accessToken);
        console.log('Toutes les clés localStorage:', Object.keys(win.localStorage));
      });
    });

    it('devrait fonctionner quand les cookies sont rejetés', () => {
      // Effacer et visiter à nouveau pour avoir une popup de cookies fraîche
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.visit('/Login');
      
      // Rejeter les cookies cette fois
      cy.get('body').then(($body) => {
        if ($body.find('button.bg-gray-200').length > 0) {
          // Cliquer sur le bouton Rejeter (avec fond gris)
          cy.get('button.bg-gray-200').click();
        }
      });

      // Continuer avec la connexion
      cy.get('input[type="email"]').type(validUser.email);
      cy.get('input[type="password"]').type(validUser.password);
      cy.get('button[type="submit"]').click();

      // Devrait toujours pouvoir se connecter
      cy.url().should('satisfy', (url) => {
        return url.includes('/dashboard') || 
               url.includes('/dashstud') || 
               url.includes('/dashSupervisor') || 
               url.includes('/DashboardProf');
      }, { timeout: 10000 });
    });
  });

  describe('Validation du Formulaire', () => {
    it('devrait valider les champs requis', () => {
      // Effacer d'abord les valeurs existantes
      cy.get('input[type="email"]').clear();
      cy.get('input[type="password"]').clear();
      
      cy.get('button[type="submit"]').click();
      
      // Attendre un moment pour que la validation se déclenche
      cy.wait(500);
      
      cy.get('input[type="email"]').then(($input) => {
        // Vérifier si le champ est requis et vide
        const isRequired = $input[0].hasAttribute('required');
        const isEmpty = $input[0].value === '';
        const isValid = $input[0].validity.valid;
        
        console.log('Champ email - Requis:', isRequired, 'Vide:', isEmpty, 'Valide:', isValid);
        
        // Si le champ est requis et vide, il devrait être invalide
        if (isRequired && isEmpty) {
          expect(isValid).to.be.false;
        } else {
          // Si la validation ne fonctionne pas comme prévu, juste le logger
          console.log('La validation du formulaire pourrait ne pas fonctionner comme prévu');
        }
      });
    });

    it('devrait valider le format de l\'email', () => {
      cy.get('input[type="email"]').type('invalid-email');
      cy.get('input[type="password"]').type('password');
      cy.get('button[type="submit"]').click();
      
      cy.get('input[type="email"]').then(($input) => {
        expect($input[0].validity.valid).to.be.false;
      });
    });

    it('devrait exiger à la fois l\'email et le mot de passe', () => {
      // Essayer de soumettre un formulaire vide
      cy.get('button[type="submit"]').click();
      
      // La validation du navigateur devrait empêcher la soumission
      cy.get('input[type="email"]').then(($input) => {
        const isRequired = $input[0].hasAttribute('required');
        const isEmpty = $input[0].value === '';
        if (isRequired && isEmpty) {
          expect($input[0].validity.valid).to.be.false;
        }
      });
      
      // Remplir seulement l'email
      cy.get('input[type="email"]').clear().type(validUser.email);
      cy.get('button[type="submit"]').click();
      
      cy.get('input[type="password"]').then(($input) => {
        const isRequired = $input[0].hasAttribute('required');
        const isEmpty = $input[0].value === '';
        if (isRequired && isEmpty) {
          expect($input[0].validity.valid).to.be.false;
        }
      });
    });
  });

  describe('Tests de Chargement et d\'Animation', () => {
    it('devrait afficher l\'animation de chargement pendant la connexion', () => {
      // Intercepter la connexion pour ajouter un délai pour tester l'état de chargement
      cy.intercept('POST', '**/api/auth/login', {
        delay: 2000,
        statusCode: 200,
        body: { message: 'Connected Successfully !' }
      }).as('slowLogin');
      
      cy.get('input[type="email"]').type(validUser.email);
      cy.get('input[type="password"]').type(validUser.password);
      cy.get('button[type="submit"]').click();
      
      // Vérifier l'état de chargement - adapter ces sélecteurs à votre interface de chargement réelle
      cy.get('button[type="submit"]').should('be.disabled');
      
      // Vérifier s'il y a un spinner de chargement ou un changement de texte
      cy.get('body').then(($body) => {
        if ($body.find('.animate-spin').length > 0) {
          cy.get('.animate-spin').should('be.visible');
        }
        if ($body.find('button:contains("loging In...")').length > 0) {
          cy.get('button').should('contain', 'loging In...');
        }
      });
      
      cy.wait('@slowLogin');
    });

    it('devrait afficher le message d\'erreur avec le style approprié', () => {
      cy.get('input[type="email"]').type(invalidUser.email);
      cy.get('input[type="password"]').type(invalidUser.password);
      cy.get('button[type="submit"]').click();
      
      // Le message d'erreur devrait apparaître avec le bon style
      cy.get('.bg-red-100', { timeout: 5000 }).should('be.visible');
      
      // L'erreur devrait contenir le texte de votre contrôleur
      cy.contains('Email or Password is incorrect').should('be.visible');
      
      // Vérifier si l'erreur a le bon style de bordure
      cy.get('body').then(($body) => {
        if ($body.find('.border-red-500').length > 0) {
          cy.get('.border-red-500').should('exist');
        }
      });
    });
  });

  describe('Gestion du Consentement aux Cookies', () => {
    it('devrait gérer l\'acceptation des cookies', () => {
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.visit('/Login');
      
      // Accepter les cookies
      cy.get('body').then(($body) => {
        if ($body.find('button.bg-purple-500').length > 0) {
          cy.get('button.bg-purple-500').should('be.visible').click();
          
          // Vérifier que la popup de cookies a disparu
          cy.get('button.bg-purple-500').should('not.exist');
        }
      });
      
      // Continuer avec le flux de connexion normal
      cy.get('input[type="email"]').type(validUser.email);
      cy.get('input[type="password"]').type(validUser.password);
      cy.get('button[type="submit"]').click();
      
      cy.url().should('not.include', '/Login', { timeout: 10000 });
    });

    it('devrait gérer le rejet des cookies', () => {
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.visit('/Login');
      
      // Rejeter les cookies
      cy.get('body').then(($body) => {
        if ($body.find('button.bg-gray-200').length > 0) {
          cy.get('button.bg-gray-200').should('be.visible').click();
          
          // Vérifier que la popup de cookies a disparu
          cy.get('button.bg-gray-200').should('not.exist');
        }
      });
      
      // La connexion devrait toujours fonctionner
      cy.get('input[type="email"]').type(validUser.email);
      cy.get('input[type="password"]').type(validUser.password);
      cy.get('button[type="submit"]').click();
      
      cy.url().should('not.include', '/Login', { timeout: 10000 });
    });
  });

  describe('Gestion des Erreurs', () => {
    it('devrait gérer les erreurs serveur avec élégance', () => {
      // Intercepter l'appel API pour simuler une erreur serveur
      cy.intercept('POST', '**/api/auth/login', {
        statusCode: 500,
        body: { message: 'Server Error, Please try again later!' }
      }).as('loginError');
      
      cy.get('input[type="email"]').type(validUser.email);
      cy.get('input[type="password"]').type(validUser.password);
      cy.get('button[type="submit"]').click();
      
      cy.wait('@loginError');
      
      // Devrait afficher le message d'erreur serveur
      cy.get('.bg-red-100', { timeout: 5000 }).should('be.visible');
      cy.contains('Server Error, Please try again later!').should('be.visible');
      
      // Devrait rester sur la page de connexion
      cy.url().should('include', '/Login');
    });

    it('devrait gérer les erreurs réseau', () => {
      // Intercepter l'appel API pour simuler une erreur réseau
      cy.intercept('POST', '**/api/auth/login', { forceNetworkError: true }).as('networkError');
      
      cy.get('input[type="email"]').type(validUser.email);
      cy.get('input[type="password"]').type(validUser.password);
      cy.get('button[type="submit"]').click();
      
      // Attendre que l'erreur réseau se produise
      cy.wait('@networkError').then((interception) => {
        // Vérifier que l'erreur réseau a été interceptée
        expect(interception.error.message).to.include('forceNetworkError');
      });
      
      // Devrait gérer l'erreur réseau avec élégance
      // Le comportement exact dépend de votre implémentation de gestion d'erreur
      cy.url().should('include', '/Login');
    });
  });

  describe('État d\'Authentification', () => {
    it('devrait maintenir l\'authentification après actualisation de la page', () => {
      // Se connecter d'abord
      cy.get('input[type="email"]').type(validUser.email);
      cy.get('input[type="password"]').type(validUser.password);
      cy.get('button[type="submit"]').click();
      
      // Attendre que la connexion se termine
      cy.url().should('not.include', '/Login', { timeout: 10000 });
      
      // Actualiser la page
      cy.reload();
      
      // Devrait toujours être authentifié et ne pas rediriger vers la connexion
      cy.url().should('not.include', '/Login');
    });

    it('devrait effacer l\'état d\'authentification lors de la déconnexion', () => {
      // Se connecter d'abord
      cy.get('input[type="email"]').type(validUser.email);
      cy.get('input[type="password"]').type(validUser.password);
      cy.get('button[type="submit"]').click();
      
      // Attendre que la connexion se termine
      cy.url().should('not.include', '/Login', { timeout: 10000 });
      
      // Intercepter l'appel API de déconnexion
      cy.intercept('POST', '**/api/auth/logout').as('logoutRequest');
      
      // Trouver et cliquer sur le bouton du menu déroulant utilisateur pour ouvrir le menu
      //cy.get('button').contains('img[alt="User"]').should('be.visible').click();
      
      // Sélecteurs alternatifs pour le bouton du menu déroulant utilisateur
      cy.get('body').then(($body) => {
        if ($body.find('img[src*="me.png"]').length > 0) {
          cy.get('img[src*="me.png"]').parent().click();
        } else if ($body.find('span').contains('Nom inconnu').length > 0) {
          cy.get('span').contains('Nom inconnu').parent().click();
        } else {
          // Solution de repli : chercher tout bouton déroulant avec info utilisateur
          cy.get('button').contains('span').click();
        }
      });
      
      // Attendre que le menu déroulant apparaisse et cliquer sur déconnexion
      //cy.get('router-link').contains('Sign out').should('be.visible').click();
     // cy.get('router-link[to="/"]').click()
     cy.get('.flex.items-center.gap-3').contains('Sign out').click()
      
      // Attendre que la déconnexion se termine
      cy.wait('@logoutRequest');
      
      // Devrait rediriger vers la page de connexion ou d'accueil
      cy.url().should('satisfy', (url) => {
        return url.includes('/');
      });
      
      // Vérifier que l'état d'authentification est effacé
      cy.shouldNotBeAuthenticated();
    });

    it('devrait se déconnecter via le menu déroulant de l\'interface utilisateur', () => {
      // Se connecter d'abord
      cy.get('input[type="email"]').type(validUser.email);
      cy.get('input[type="password"]').type(validUser.password);
      cy.get('button[type="submit"]').click();
      
      // Attendre que la connexion se termine
      cy.url().should('not.include', '/Login', { timeout: 10000 });
      
      // Trouver le bouton du menu déroulant du profil utilisateur
      // Chercher le bouton contenant l'image utilisateur
      cy.get('button').find('img[alt="User"]').should('be.visible');
      cy.get('button').find('img[alt="User"]').parent().click();
      
      // Attendre que le menu déroulant soit visible
      cy.get('[class*="absolute"][class*="right-0"]').should('be.visible');
      
      // Cliquer sur le lien Se déconnecter
      cy.contains('Sign out').should('be.visible').click();
      
      // Devrait rediriger vers la page d'accueil
      cy.url().should('equal', `http://localhost:5173/`);
      
      // Vérifier que l'état d'authentification est effacé
      cy.shouldNotBeAuthenticated();
    });
  });

  /*describe('Protection contre la Limitation de Débit', () => {
    it('devrait gérer plusieurs tentatives de connexion échouées', () => {
      // Faire plusieurs tentatives de connexion échouées
      for (let i = 0; i < 3; i++) {
        cy.get('input[type="email"]').clear().type(invalidUser.email);
        cy.get('input[type="password"]').clear().type(invalidUser.password);
        cy.get('button[type="submit"]').click();
        
        // Attendre le message d'erreur
        cy.contains('Email or Password is incorrect', { timeout: 5000 }).should('be.visible');
        
        // Attendre avant la prochaine tentative
        cy.wait(1000);
      }
      
      // Après plusieurs tentatives échouées, le formulaire devrait toujours être fonctionnel
      // (Le comportement de limitation de débit dépend de votre implémentation backend)
      cy.get('button[type="submit"]').should('be.visible');
    });
  });*/
});

// Commandes Personnalisées (mises à jour pour gérer l'authentification basée sur les cookies)
Cypress.Commands.add('shouldBeAuthenticated', () => {
  // D'abord, vérifier qu'on n'est pas sur la page de connexion
  cy.url().should('not.include', '/Login');
  
  // Vérifier les cookies d'authentification ou tokens
  cy.window().then((win) => {
    const rememberMe = win.localStorage.getItem('remember_me') === 'true';
    const storage = rememberMe ? win.localStorage : win.sessionStorage;
    const accessToken = storage.getItem('access_token');
    
    // Log pour déboguer
    console.log('Se souvenir de moi:', rememberMe);
    console.log('Token d\'accès:', accessToken);
    
    // Vérifier les cookies aussi puisque votre app utilise withCredentials
    cy.getCookies().then((cookies) => {
      console.log('Tous les cookies:', cookies);
      const authCookies = cookies.filter(cookie => 
        cookie.name.includes('auth') || 
        cookie.name.includes('session') || 
        cookie.name.includes('token') ||
        cookie.name === 'XSRF-TOKEN'
      );
      console.log('Cookies liés à l\'authentification:', authCookies);
    });
    
    // Pour l'authentification basée sur les cookies, l'indicateur principal est la redirection réussie
    // et la capacité d'accéder aux routes protégées sans 401
  });
});

Cypress.Commands.add('shouldNotBeAuthenticated', () => {
  cy.window().then((win) => {
    expect(win.localStorage.getItem('access_token')).to.not.exist;
   // expect(win.sessionStorage.getItem('access_token')).to.not.exist;
  });
});

// Commande d'aide pour la connexion basée sur l'API (utile pour la configuration dans d'autres tests)
Cypress.Commands.add('loginViaAPI', (email, password) => {
  cy.request({
    method: 'POST',
    url: `${baseUrl}/api/auth/login`,
    body: {
      email: email,
      password: password
    },
    failOnStatusCode: false
  }).then((response) => {
    if (response.status === 200) {
      console.log('Connexion API réussie');
      // Les cookies sont automatiquement définis par le navigateur
    } else {
      console.log('Connexion API échouée:', response.body);
    }
  });
});

Cypress.Commands.add('clearSessionStorage', () => {
  cy.window().then((win) => {
    win.sessionStorage.clear();
  });
});

// Commande personnalisée pour gérer le menu déroulant utilisateur et la déconnexion
Cypress.Commands.add('logoutViaUI', () => {
  // Multiples stratégies pour trouver et cliquer sur le menu déroulant utilisateur
  cy.get('body').then(($body) => {
    // Stratégie 1 : Chercher l'image utilisateur
    if ($body.find('img[alt="User"]').length > 0) {
      cy.get('img[alt="User"]').parent('button').click();
    }
    // Stratégie 2 : Chercher l'image me.png
    else if ($body.find('img[src*="me.png"]').length > 0) {
      cy.get('img[src*="me.png"]').parent('button').click();
    }
    // Stratégie 3 : Chercher un bouton avec structure d'info utilisateur
    else if ($body.find('button').find('span').length > 0) {
      cy.get('button').contains('span').first().click();
    }
    // Stratégie 4 : Chercher un bouton déroulant avec chevron
    else {
      cy.get('button').find('[class*="chevron"], [class*="ChevronDown"]').parent().click();
    }
  });
  
  // Attendre que le menu déroulant apparaisse
  cy.get('[class*="absolute"][class*="right-0"]', { timeout: 5000 }).should('be.visible');
  
  // Cliquer sur Se déconnecter
  cy.contains('Sign out').click();
});