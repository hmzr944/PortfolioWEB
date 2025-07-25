/**
 * Script d'interactions pour le portfolio professionnel
 * Gestion de la navigation, animations et formulaire de contact
 */

// Variables globales
let menuMobileOuvert = false;
let observateurScroll = null;

/**
 * Initialisation du script au chargement de la page
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des différents modules
    initialiserNavigation();
    initialiserAnimationsScroll();
    initialiserProgressionCompetences();
    initialiserFormulaire();
    initialiserScrollFluide();
    
    console.log('Portfolio initialisé avec succès');
});

/**
 * Gestion de la navigation principale et mobile
 */
function initialiserNavigation() {
    const boutonMenuMobile = document.querySelector('.bouton-menu-mobile');
    const menuNavigation = document.querySelector('.menu-navigation');
    const liensNavigation = document.querySelectorAll('.lien-navigation');
    
    // Gestion du menu mobile
    if (boutonMenuMobile && menuNavigation) {
        boutonMenuMobile.addEventListener('click', function() {
            basculerMenuMobile();
        });
        
        // Fermer le menu lors du clic sur un lien
        liensNavigation.forEach(lien => {
            lien.addEventListener('click', function() {
                if (menuMobileOuvert) {
                    basculerMenuMobile();
                }
                // Mettre à jour le lien actif
                mettreAJourLienActif(this);
            });
        });
        
        // Fermer le menu lors du clic en dehors
        document.addEventListener('click', function(event) {
            if (menuMobileOuvert && 
                !boutonMenuMobile.contains(event.target) && 
                !menuNavigation.contains(event.target)) {
                basculerMenuMobile();
            }
        });
    }
    
    // Gestion du scroll de navigation
    window.addEventListener('scroll', function() {
        mettreAJourNavigationScroll();
        mettreAJourLienActifScroll();
    });
}

/**
 * Basculer l'état du menu mobile
 */
function basculerMenuMobile() {
    const boutonMenuMobile = document.querySelector('.bouton-menu-mobile');
    const menuNavigation = document.querySelector('.menu-navigation');
    
    menuMobileOuvert = !menuMobileOuvert;
    
    boutonMenuMobile.classList.toggle('actif', menuMobileOuvert);
    menuNavigation.classList.toggle('actif', menuMobileOuvert);
    
    // Empêcher le scroll du body quand le menu est ouvert
    document.body.style.overflow = menuMobileOuvert ? 'hidden' : '';
}

/**
 * Mettre à jour l'apparence de la navigation au scroll
 */
function mettreAJourNavigationScroll() {
    const entete = document.querySelector('.entete-principal');
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
        entete.style.background = 'rgba(255, 255, 255, 0.98)';
        entete.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        entete.style.background = 'rgba(255, 255, 255, 0.95)';
        entete.style.boxShadow = 'none';
    }
}

/**
 * Mettre à jour le lien actif selon la section visible
 */
function mettreAJourLienActifScroll() {
    const sections = document.querySelectorAll('section[id]');
    const liensNavigation = document.querySelectorAll('.lien-navigation');
    
    let sectionActive = '';
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
            sectionActive = section.getAttribute('id');
        }
    });
    
    liensNavigation.forEach(lien => {
        const href = lien.getAttribute('href').substring(1);
        lien.classList.toggle('actif', href === sectionActive);
    });
}

/**
 * Mettre à jour le lien actif manuellement
 */
function mettreAJourLienActif(lienClique) {
    const liensNavigation = document.querySelectorAll('.lien-navigation');
    
    liensNavigation.forEach(lien => {
        lien.classList.remove('actif');
    });
    
    lienClique.classList.add('actif');
}

/**
 * Initialiser les animations au scroll
 */
function initialiserAnimationsScroll() {
    // Configuration de l'observateur d'intersection
    const optionsObservateur = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    observateurScroll = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animer les cartes de projet avec délai
                if (entry.target.classList.contains('carte-projet')) {
                    animerCarteProjet(entry.target);
                }
            }
        });
    }, optionsObservateur);
    
    // Observer les éléments à animer
    const elementsAAnimer = document.querySelectorAll('.carte-projet, .categorie-competences');
    
    elementsAAnimer.forEach(element => {
        element.classList.add('element-anime');
        observateurScroll.observe(element);
    });
}

/**
 * Animer une carte de projet avec délai personnalisé
 */
function animerCarteProjet(carte) {
    const index = Array.from(document.querySelectorAll('.carte-projet')).indexOf(carte);
    const delai = index * 150; // 150ms de délai entre chaque carte
    
    setTimeout(() => {
        carte.style.opacity = '1';
        carte.style.transform = 'translateY(0)';
    }, delai);
}

/**
 * Initialiser l'animation des barres de progression des compétences
 */
function initialiserProgressionCompetences() {
    const observateurCompetences = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const barresProgression = entry.target.querySelectorAll('.progression');
                
                barresProgression.forEach((barre, index) => {
                    setTimeout(() => {
                        const niveau = barre.getAttribute('data-niveau');
                        barre.style.width = niveau + '%';
                    }, index * 200); // Délai progressif pour chaque barre
                });
                
                // Ne plus observer cet élément
                observateurCompetences.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const sectionCompetences = document.querySelector('.section-competences');
    if (sectionCompetences) {
        observateurCompetences.observe(sectionCompetences);
    }
}

/**
 * Initialiser la gestion du formulaire de contact
 */
function initialiserFormulaire() {
    const formulaire = document.getElementById('formulaireContact');
    
    if (formulaire) {
        formulaire.addEventListener('submit', function(event) {
            event.preventDefault();
            gererSoumissionFormulaire(this);
        });
        
        // Validation en temps réel
        const champsFormulaire = formulaire.querySelectorAll('.champ-saisie');
        champsFormulaire.forEach(champ => {
            champ.addEventListener('blur', function() {
                validerChamp(this);
            });
            
            champ.addEventListener('input', function() {
                // Effacer le message d'erreur lors de la saisie
                const messageErreur = this.parentNode.querySelector('.message-erreur');
                if (messageErreur) {
                    messageErreur.classList.remove('visible');
                }
            });
        });
    }
}

/**
 * Gérer la soumission du formulaire
 */
function gererSoumissionFormulaire(formulaire) {
    const donneesFormulaire = new FormData(formulaire);
    let formulaireValide = true;
    
    // Validation de tous les champs
    const champsRequis = formulaire.querySelectorAll('[required]');
    champsRequis.forEach(champ => {
        if (!validerChamp(champ)) {
            formulaireValide = false;
        }
    });
    
    if (formulaireValide) {
        // Simulation d'envoi (en production, remplacer par un vrai appel API)
        simulerEnvoiFormulaire(donneesFormulaire);
    }
}

/**
 * Valider un champ individuel
 */
function validerChamp(champ) {
    const valeur = champ.value.trim();
    const typeChamp = champ.type;
    const nomChamp = champ.name;
    const messageErreur = champ.parentNode.querySelector('.message-erreur');
    
    let erreur = '';
    
    // Validation selon le type de champ
    if (champ.hasAttribute('required') && !valeur) {
        erreur = 'Ce champ est obligatoire.';
    } else if (typeChamp === 'email' && valeur) {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(valeur)) {
            erreur = 'Veuillez saisir une adresse email valide.';
        }
    } else if (nomChamp === 'nom' && valeur.length < 2) {
        erreur = 'Le nom doit contenir au moins 2 caractères.';
    } else if (nomChamp === 'message' && valeur.length < 10) {
        erreur = 'Le message doit contenir au moins 10 caractères.';
    }
    
    // Afficher ou masquer le message d'erreur
    if (erreur && messageErreur) {
        messageErreur.textContent = erreur;
        messageErreur.classList.add('visible');
        champ.style.borderColor = 'var(--couleur-erreur)';
        return false;
    } else if (messageErreur) {
        messageErreur.classList.remove('visible');
        champ.style.borderColor = 'var(--bordure-principale)';
        return true;
    }
    
    return true;
}

/**
 * Simuler l'envoi du formulaire
 */
function simulerEnvoiFormulaire(donnees) {
    const boutonEnvoi = document.querySelector('.bouton-envoi');
    const texteOriginal = boutonEnvoi.textContent;
    
    // État de chargement
    boutonEnvoi.textContent = 'Envoi en cours...';
    boutonEnvoi.disabled = true;
    boutonEnvoi.style.opacity = '0.7';
    
    // Simulation d'une requête (2 secondes)
    setTimeout(() => {
        // Réinitialiser le bouton
        boutonEnvoi.textContent = texteOriginal;
        boutonEnvoi.disabled = false;
        boutonEnvoi.style.opacity = '1';
        
        // Réinitialiser le formulaire
        document.getElementById('formulaireContact').reset();
        
        // Afficher le message de confirmation
        afficherMessageConfirmation();
        
        console.log('Formulaire soumis avec les données:', Object.fromEntries(donnees));
    }, 2000);
}

/**
 * Afficher le message de confirmation
 */
function afficherMessageConfirmation() {
    const messageConfirmation = document.getElementById('messageConfirmation');
    if (messageConfirmation) {
        messageConfirmation.classList.remove('cache');
        
        // Empêcher le scroll de la page
        document.body.style.overflow = 'hidden';
        
        // Fermeture automatique après 5 secondes
        setTimeout(() => {
            fermerMessage();
        }, 5000);
    }
}

/**
 * Fermer le message de confirmation
 */
function fermerMessage() {
    const messageConfirmation = document.getElementById('messageConfirmation');
    if (messageConfirmation) {
        messageConfirmation.classList.add('cache');
        document.body.style.overflow = '';
    }
}

/**
 * Initialiser le scroll fluide pour les liens d'ancrage
 */
function initialiserScrollFluide() {
    const liensAncrage = document.querySelectorAll('a[href^="#"]');
    
    liensAncrage.forEach(lien => {
        lien.addEventListener('click', function(event) {
            event.preventDefault();
            
            const cibleId = this.getAttribute('href').substring(1);
            const elementCible = document.getElementById(cibleId);
            
            if (elementCible) {
                const offsetTop = elementCible.offsetTop - 80; // Compensation pour l'en-tête fixe
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Gestion des événements de redimensionnement
 */
window.addEventListener('resize', function() {
    // Fermer le menu mobile si on passe en mode desktop
    if (window.innerWidth > 768 && menuMobileOuvert) {
        basculerMenuMobile();
    }
});

/**
 * Gestion des événements clavier pour l'accessibilité
 */
document.addEventListener('keydown', function(event) {
    // Fermer le menu mobile avec Échap
    if (event.key === 'Escape' && menuMobileOuvert) {
        basculerMenuMobile();
    }
    
    // Fermer le message de confirmation avec Échap
    if (event.key === 'Escape') {
        const messageConfirmation = document.getElementById('messageConfirmation');
        if (messageConfirmation && !messageConfirmation.classList.contains('cache')) {
            fermerMessage();
        }
    }
});

/**
 * Optimisation des performances - nettoyage lors du déchargement
 */
window.addEventListener('beforeunload', function() {
    if (observateurScroll) {
        observateurScroll.disconnect();
    }
});

/**
 * Fonction utilitaire pour débouncer les événements
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimiser l'événement de scroll
const scrollOptimise = debounce(() => {
    mettreAJourNavigationScroll();
    mettreAJourLienActifScroll();
}, 10);

window.addEventListener('scroll', scrollOptimise);

/**
 * Mode développement - fonctions de debug (à supprimer en production)
 */
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.portfolioDebug = {
        toggleMenu: basculerMenuMobile,
        showMessage: afficherMessageConfirmation,
        hideMessage: fermerMessage,
        validateForm: () => gererSoumissionFormulaire(document.getElementById('formulaireContact'))
    };
    
    console.log('Mode développement activé. Utilisez window.portfolioDebug pour les fonctions de debug.');
}
