# 07 — Plan de Tests FinTrack SaaS

**Projet :** FinTrack — Plateforme SaaS de gestion budgetaire personnelle
**Version :** 1.0.0
**Date :** Juin 2025
**Auteur :** Lead QA — Documentation Technique
**Statut :** Approuve

---

## Table des Matieres

1. [Strategie de Test](#1-strategie-de-test)
2. [Environnement de Test](#2-environnement-de-test)
3. [Cas de Tests Fonctionnels](#3-cas-de-tests-fonctionnels)
4. [Cas de Tests SaaS Specifiques](#4-cas-de-tests-saas-specifiques)
5. [Tests Non-Fonctionnels](#5-tests-non-fonctionnels)
6. [Suite de Regression](#6-suite-de-regression)
7. [Template de Rapport de Bug](#7-template-de-rapport-de-bug)

---

## 1. Strategie de Test

### 1.1 Objectifs

Le present plan de tests a pour objectif de garantir la qualite, la fiabilite et la securite de la plateforme FinTrack SaaS avant chaque mise en production. Les objectifs principaux sont :

- **Verifier la conformite fonctionnelle** : S'assurer que les 15 pages de l'application repondent aux specifications fonctionnelles et aux user stories definies.
- **Valider les flux metiers critiques** : Tester les parcours utilisateurs cles (inscription, onboarding, paiement, gestion financiere).
- **Garantir la stabilite SaaS** : Verifier le bon fonctionnement des 3 niveaux d'abonnement (Free, Pro, Premium), des 3 methodes de paiement et du cycle de vie des souscriptions.
- **Assurer la qualite non-fonctionnelle** : Controler les performances, l'accessibilite (WCAG 2.1 AA), la responsive et la securite.
- **Prevenir les regressions** : Maintenir une suite de tests de regression couvrant l'ensemble des fonctionnalites.

### 1.2 Perimetre (Scope)

| Domaine | Inclus | Exclus |
|---------|--------|--------|
| Pages publiques (Landing, Auth, Pricing) | ✅ | |
| Onboarding (4 etapes) | ✅ | |
| Application core (Dashboard, Transactions, Budgets, Dettes, Objectifs, Analytics) | ✅ | |
| Fonctionnalites SaaS (Checkout, Subscription, Billing, Settings) | ✅ | |
| Feature gating (3 plans) | ✅ | |
| i18n (EN/FR/ES) | ✅ | |
| API Backend (tests d'integration) | ✅ | |
| Base de donnees (30 transactions mock, 10 budgets, 8 dettes, 5 objectifs) | ✅ | |
| Tests de charge et stress (> 10 000 utilisateurs) | | ❌ |
| Tests de penetration approfondis | | ❌ (audit securite externe) |

### 1.3 Approche de Test

| Niveau | Type | Methode | Responsable |
|--------|------|---------|-------------|
| Unitaire | Tests de composants React | Automatise (Jest + React Testing Library) | Dev |
| Integration | API + Frontend | Automatise (Cypress/Playwright) | QA |
| End-to-End | Parcours utilisateurs complets | Automatise (Cypress) + Manuel | QA |
| Exploratoire | Tests libres sans scenario | Manuel | QA Lead |
| SaaS | Feature gating, paiements, cycles | Manuel + Automatise | QA |
| UAT | Validation metier avec utilisateurs reels | Manuel | Product Owner |

### 1.4 Criteres d'Entree

- [x] L'ensemble des user stories du sprint sont developpees et mergees sur la branche `staging`
- [x] Les tests unitaires cote developpeur passent avec un taux de couverture >= 70%
- [x] L'application est deployee sur l'environnement de staging
- [x] Les donnees de test (30 transactions, 10 budgets, 8 dettes, 5 objectifs) sont injectees
- [x] La documentation technique a jour est disponible
- [x] Les maquettes Figma sont validees par le PO

### 1.5 Criteres de Sortie

- 100% des cas de tests P1 (critiques) sont executes et passes
- 95% des cas de tests P2 (majeurs) sont executes et passes
- Aucun bug bloquant (Sev 1) ou critique (Sev 2) ouvert
- Le taux de bugs majeurs ouverts est <= 3
- Les indicateurs de performance (Lighthouse) : Performance >= 90, Accessibilite >= 95, SEO >= 85
- Validation du Product Owner sur l'environnement staging

---

## 2. Environnement de Test

### 2.1 Navigateurs Supportes

| Navigateur | Version Minimale | Moteur | Frequence de Test |
|------------|------------------|--------|-------------------|
| Google Chrome | 120+ | Blink | A chaque build |
| Mozilla Firefox | 121+ | Gecko | A chaque release |
| Apple Safari | 17+ | WebKit | A chaque release |
| Microsoft Edge | 120+ | Blink | A chaque release |

### 2.2 Peripheriques et Resolutions

| Type | Resolution | Appareil de Reference | OS |
|------|------------|----------------------|-----|
| Desktop (Large) | 1920 x 1080 | Dell XPS 15 | Windows 11 |
| Desktop (Ultra-wide) | 2560 x 1440 | MacBook Pro 16" | macOS Sonoma |
| Tablet (Paysage) | 1024 x 768 | iPad Air 5 | iPadOS 17 |
| Tablet (Portrait) | 768 x 1024 | iPad Air 5 | iPadOS 17 |
| Mobile (Grand) | 414 x 896 | iPhone 15 Pro | iOS 17 |
| Mobile (Standard) | 375 x 812 | iPhone 13 | iOS 17 |
| Mobile (Android) | 360 x 800 | Samsung Galaxy S23 | Android 14 |

### 2.3 Outils de Test

| Categorie | Outil | Usage |
|-----------|-------|-------|
| Tests E2E | Cypress 13 + Playwright | Automatisation des parcours critiques |
| Tests API | Postman + Newman | Validation des endpoints REST |
| Accessibilite | Axe DevTools + WAVE | Conformite WCAG 2.1 AA |
| Performance | Lighthouse CI + WebPageTest | Mesure des KPI de performance |
| Visual Testing | Chromatic | Regression visuelle |
| Mobile Testing | BrowserStack | Tests sur vrais appareils |
| Gestion des bugs | Jira | Suivi des anomalies |

### 2.4 Donnees de Test

| Collection | Volume | Description |
|------------|--------|-------------|
| Utilisateurs | 5 comptes | 1 Free, 1 Pro, 1 Premium, 1 Expire, 1 Admin |
| Transactions | 30 items | Mix revenus/depenses, 3 mois d'historique |
| Budgets | 10 categories | Logement, Transport, Alimentation, Loisirs, Sante, Education, Epargne, Services, Shopping, Voyages |
| Dettes | 8 entrees | Statuts actif/paye/en retard, 4 personnes |
| Objectifs | 5 buts | Echeances variees, montants differents |

---

## 3. Cas de Tests Fonctionnels

### 3.1 Page Landing (Accueil)

| ID | Page | Fonctionnalite | Pre-conditions | Etapes | Resultat Attendu | Priorite |
|----|------|---------------|----------------|--------|-----------------|----------|
| TC-L001 | Landing | Hero CTA | Utilisateur non connecte | 1. Acceder a `/` <br> 2. Cliquer sur "Commencer Gratuitement" | Redirection vers `/auth/register` | P1 |
| TC-L002 | Landing | Basculement tarification | Utilisateur sur la landing | 1. Scroller jusqu'a la section Pricing <br> 2. Cliquer sur le toggle Mensuel/Annuel | Les prix se mettent a jour avec la reduction annuelle (-20%) affichee | P2 |
| TC-L003 | Landing | Accordeon FAQ | Utilisateur sur la landing | 1. Cliquer sur une question FAQ <br> 2. Cliquer a nouveau | La reponse s'affiche au premier clic, se replie au second | P2 |
| TC-L004 | Landing | Navigation mobile | Utilisateur sur mobile (375px) | 1. Ouvrir la page <br> 2. Cliquer sur le bouton hamburger <br> 3. Selectionner un lien | Le menu s'ouvre en slide-over, la navigation vers la section se fait avec smooth scroll | P2 |
| TC-L005 | Landing | Smooth scroll | Utilisateur sur la landing | 1. Cliquer sur un lien d'ancre (ex: "Fonctionnalites") | Le defilement vers la section est fluide (duration: 800ms, easing: ease-in-out) | P3 |

### 3.2 Authentification (Auth)

| ID | Page | Fonctionnalite | Pre-conditions | Etapes | Resultat Attendu | Priorite |
|----|------|---------------|----------------|--------|-----------------|----------|
| TC-A001 | Auth | Connexion reussie | Compte existant (email: `test@fintrack.com`, mdp: `Test1234!`) | 1. Aller sur `/auth/login` <br> 2. Saisir email et mot de passe valides <br> 3. Cliquer "Se connecter" | Redirection vers le Dashboard, token JWT stocke dans localStorage, cookie de session cree | P1 |
| TC-A002 | Auth | Echec de connexion | Compte existant | 1. Aller sur `/auth/login` <br> 2. Saisir un mot de passe incorrect <br> 3. Cliquer "Se connecter" | Message d'erreur "Email ou mot de passe incorrect" affiche, aucun token genere, tentative limitee a 5 essais | P1 |
| TC-A003 | Auth | Validation inscription | Nouvel utilisateur | 1. Aller sur `/auth/register` <br> 2. Saisir email invalide (sans @) <br> 3. Saisir mot de passe < 8 caracteres <br> 4. Cliquer "S'inscrire" | Messages d'erreur en temps reel : "Format email invalide", "Mot de passe trop court" | P1 |
| TC-A004 | Auth | Force du mot de passe | Page d'inscription | 1. Saisir `abc` → 2. Saisir `Abcdef1` → 3. Saisir `Abcdef1!` | Barre de force : rouge (faible) → orange (moyen) → verte (fort), avec criteres visuels (majuscule, chiffre, special) | P2 |
| TC-A005 | Auth | Boutons OAuth | Utilisateur non connecte | 1. Aller sur `/auth/login` <br> 2. Cliquer sur "Continuer avec Google" <br> 3. (idem Apple, Microsoft) | Ouverture du popup OAuth, redirection vers le callback, creation de session, redirection Dashboard | P1 |
| TC-A006 | Auth | Mot de passe oublie | Compte existant | 1. Aller sur `/auth/forgot-password` <br> 2. Saisir l'email <br> 3. Cliquer "Envoyer" | Message de confirmation "Si ce compte existe, un email a ete envoye", email mock affiche dans la console | P2 |

### 3.3 Page Pricing (Tarification)

| ID | Page | Fonctionnalite | Pre-conditions | Etapes | Resultat Attendu | Priorite |
|----|------|---------------|----------------|--------|-----------------|----------|
| TC-P001 | Pricing | Basculement Mensuel/Annuel | Utilisateur sur `/pricing` | 1. Cliquer sur le toggle "Annuel" <br> 2. Verifier les prix <br> 3. Cliquer sur "Mensuel" | Prix annuels avec badge "-20%" affiche, retour mensuel correct, animation de transition | P2 |
| TC-P002 | Pricing | Comparaison des fonctionnalites | Utilisateur sur `/pricing` | 1. Scroller jusqu'au tableau comparatif <br> 2. Verifier les icones check/cross par plan | Tableau complet : Free (cochees : base, croix : avance), Pro (tout coche sauf IA), Premium (tout coche) | P2 |
| TC-P003 | Pricing | CTA vers inscription | Utilisateur non connecte | 1. Cliquer sur "Choisir Free" <br> 2. Cliquer sur "Choisir Pro" | Free → redirection `/auth/register?plan=free` ; Pro → redirection `/auth/register?plan=pro` | P1 |
| TC-P004 | Pricing | Affichage des devises | Utilisateur avec devise EUR | 1. Consulter les prix | Symbole € affiche, formatage correct (ex: €9.99/mois) | P3 |

### 3.4 Onboarding (Parcours d'Accueil)

| ID | Page | Fonctionnalite | Pre-conditions | Etapes | Resultat Attendu | Priorite |
|----|------|---------------|----------------|--------|-----------------|----------|
| TC-O001 | Onboarding | Progression des etapes | Inscription fraiche effectuee | 1. Completer l'etape 1 (Welcome) <br> 2. Avancer vers l'etape 2 | Barre de progression : 25% → 50%, animation entre les etapes, bouton precedent actif depuis l'etape 2 | P1 |
| TC-O002 | Onboarding | Formulaire profil | Utilisateur sur l'etape 2 | 1. Selectionner devise (EUR) <br> 2. Selectionner langue (FR) <br> 3. Saisir revenu mensuel <br> 4. Valider | Donnees sauvegardees, passage a l'etape 3, message d'erreur si champ requis vide | P1 |
| TC-O003 | Onboarding | Navigation du tour | Utilisateur sur l'etape 3 (Quick Tour) | 1. Cliquer "Suivant" sur chaque tooltip <br> 2. Cliquer "Passer" | Les tooltips s'affichent sequentiellement sur les elements cles ; "Passer" saute au resume | P2 |
| TC-O004 | Onboarding | Redirection finale | Utilisateur sur l'etape 4 (Done) | 1. Cliquer "Acceder au Dashboard" | Redirection vers `/dashboard`, flag onboarding_complete=true enregistre | P1 |

### 3.5 Tableau de Bord (Dashboard)

| ID | Page | Fonctionnalite | Pre-conditions | Etapes | Resultat Attendu | Priorite |
|----|------|---------------|----------------|--------|-----------------|----------|
| TC-D001 | Dashboard | Cartes KPI | Utilisateur connecte (Pro) | 1. Acceder au Dashboard | 4 cartes affichees : Solde total, Revenus du mois, Depenses du mois, Economies. Valeurs correctes, variation % vs mois precedent | P1 |
| TC-D002 | Dashboard | Rendu des graphiques | Utilisateur avec donnees | 1. Charger le Dashboard | Graphique en aire (depenses 6 mois), doughnut (repartition categories), barres de progression (budgets) tous rendus sans erreur Canvas/SVG | P1 |
| TC-D003 | Dashboard | Liste transactions recentes | Utilisateur avec >= 5 transactions | 1. Scroller vers "Transactions recentes" | 5 dernieres transactions affichees avec icone, categorie, montant, date. Clic sur "Voir tout" → /transactions | P2 |
| TC-D004 | Dashboard | Navigation rapide | Utilisateur sur le Dashboard | 1. Cliquer sur chaque lien du sidebar | Navigation vers Transactions, Budgets, Dettes, Objectifs, Analytics, Parametres | P1 |

### 3.6 Transactions

| ID | Page | Fonctionnalite | Pre-conditions | Etapes | Resultat Attendu | Priorite |
|----|------|---------------|----------------|--------|-----------------|----------|
| TC-T001 | Transactions | Ajout de transaction | Utilisateur connecte (Pro) | 1. Cliquer "Nouvelle transaction" <br> 2. Remplir : type (depense), categorie, montant, date, description <br> 3. Valider | Transaction apparait dans la liste, total mis a jour, graphique rafraichi, toast de confirmation | P1 |
| TC-T002 | Transactions | Filtrage par type | Utilisateur sur /transactions | 1. Cliquer "Revenus" dans les filtres <br> 2. Cliquer "Depenses" <br> 3. Cliquer "Tout" | Liste filtree dynamiquement, compteur de resultats mis a jour, URL mise a jour avec parametres | P2 |
| TC-T003 | Transactions | Recherche textuelle | 30 transactions chargees | 1. Saisir "Supermarche" dans la barre de recherche | Resultats filtres contenant "Supermarche" dans description ou categorie, recherche instantanee (< 300ms) | P2 |
| TC-T004 | Transactions | Tri | Liste de transactions affichee | 1. Cliquer sur l'en-tete "Montant" <br> 2. Cliquer a nouveau | Tri croissant → decroissant, icone de direction mise a jour | P2 |
| TC-T005 | Transactions | Export CSV | Utilisateur Pro (Free ne voit pas le bouton) | 1. Selectionner des transactions <br> 2. Cliquer "Exporter CSV" | Fichier CSV telecharge avec colonnes : ID, Date, Type, Categorie, Description, Montant, Devise | P2 |

### 3.7 Budgets

| ID | Page | Fonctionnalite | Pre-conditions | Etapes | Resultat Attendu | Priorite |
|----|------|---------------|----------------|--------|-----------------|----------|
| TC-B001 | Budgets | Barres de progression | Utilisateur avec 10 budgets | 1. Acceder a /budgets | 10 categories affichees avec barre de progression coloree : verte (< 70%), orange (70-90%), rouge (> 90%) | P1 |
| TC-B002 | Budgets | Statut de sante | Budgets avec differentes utilisations | 1. Observer les badges de statut | "Sain" (vert, < 70%), "Attention" (orange, 70-90%), "Critique" (rouge, > 90%), "Depasse" (rouge fonce, > 100%) | P2 |
| TC-B003 | Budgets | Edition de budget | Utilisateur Pro | 1. Cliquer l'icone edit sur un budget <br> 2. Modifier le montant limite <br> 3. Sauvegarder | Budget mis a jour, barre de progression recalculee, toast de confirmation | P2 |
| TC-B004 | Budgets | Seuil d'alerte | Budget configure avec alerte a 80% | 1. Depasser 80% d'utilisation | Notification visuelle (badge rouge), alerte dans le centre de notifications, email si active | P2 |

### 3.8 Dettes (Debts)

| ID | Page | Fonctionnalite | Pre-conditions | Etapes | Resultat Attendu | Priorite |
|----|------|---------------|----------------|--------|-----------------|----------|
| TC-DT001 | Dettes | Ajout d'une dette | Utilisateur connecte | 1. Cliquer "Nouvelle dette" <br> 2. Saisir : personne, montant, date d'echeance, description <br> 3. Valider | Dette apparait avec badge "Active", ajoutee a la liste | P1 |
| TC-DT002 | Dettes | Enregistrement d'un paiement | Dette existante active | 1. Cliquer "Enregistrer un paiement" <br> 2. Saisir le montant du paiement <br> 3. Valider | Solde mis a jour, badge mis a jour si solde = 0 ("Payee"), historique de paiement enrichi | P1 |
| TC-DT003 | Dettes | Filtre par statut | 8 dettes avec statuts varies | 1. Cliquer "Active" <br> 2. Cliquer "Payee" <br> 3. Cliquer "En retard" | Liste filtree correctement par statut, compteur mis a jour | P2 |
| TC-DT004 | Dettes | Recherche par personne | 8 dettes, 4 personnes | 1. Saisir un nom dans la recherche | Dettes filtrees par nom de personne (crediteur/debiteur) | P2 |
| TC-DT005 | Dettes | Historique des paiements | Dette avec paiements | 1. Cliquer sur une dette pour voir le detail | Liste chronologique des paiements avec montant, date, solde restant | P2 |

### 3.9 Objectifs (Goals)

| ID | Page | Fonctionnalite | Pre-conditions | Etapes | Resultat Attendu | Priorite |
|----|------|---------------|----------------|--------|-----------------|----------|
| TC-G001 | Objectifs | Anneau de progression | 5 objectifs crees | 1. Acceder a /goals | Cercles de progression affiches avec pourcentage, couleur selon l'avancement, animation au chargement | P1 |
| TC-G002 | Objectifs | Ajout de contribution | Objectif existant | 1. Cliquer "Ajouter" sur un objectif <br> 2. Saisir le montant <br> 3. Valider | Anneau mis a jour, montant accumule augmente, message motivationnel si seuil franchi | P1 |
| TC-G003 | Objectifs | Creation d'objectif | Utilisateur (respecte la limite de plan) | 1. Cliquer "Nouvel objectif" <br> 2. Saisir : nom, montant cible, date d'echeance, image <br> 3. Valider | Objectif cree, apparait dans la grille, limite de plan verifiee (Free: max 1, Pro: max 10) | P1 |
| TC-G004 | Objectifs | Affichage de l'echeance | Objectifs avec dates | 1. Observer les cartes d'objectifs | Date d'echeance affichee, badge "Urgent" si < 30 jours, compte a rebours visuel | P2 |

### 3.10 Analytics

| ID | Page | Fonctionnalite | Pre-conditions | Etapes | Resultat Attendu | Priorite |
|----|------|---------------|----------------|--------|-----------------|----------|
| TC-AN001 | Analytics | Selecteur de periode | Utilisateur Pro (Premium pour IA) | 1. Selectionner "7 jours" <br> 2. Selectionner "30 jours" <br> 3. Selectionner "12 mois" | Tous les graphiques se mettent a jour avec les donnees de la periode, loader affiche pendant le fetch | P2 |
| TC-AN002 | Analytics | Tri par categorie | Utilisateur sur /analytics | 1. Cliquer sur l'en-tete "Montant" dans le tableau de detail | Tri croissant/decroissant par montant, categories reorganisees | P3 |
| TC-AN003 | Analytics | KPIs d'analyse des dettes | Dettes existantes | 1. Scroller vers la section "Dettes" | Cartes KPI : Total des dettes actives, Ratio dettes/revenus, Dettes en retard, Mensualite moyenne | P2 |
| TC-AN004 | Analytics | Bouton d'export de donnees | Utilisateur Premium | 1. Cliquer "Exporter les donnees" | Menu deroulant avec options : PDF, CSV, Excel. Generation et telechargement du fichier | P3 |

### 3.11 Souscription (Subscription)

| ID | Page | Fonctionnalite | Pre-conditions | Etapes | Resultat Attendu | Priorite |
|----|------|---------------|----------------|--------|-----------------|----------|
| TC-S001 | Subscription | Affichage du plan actuel | Utilisateur connecte | 1. Acceder a /subscription | Carte du plan actuel avec badge (Free/Pro/Premium), date de renouvellement, statut (Actif/Expire) | P1 |
| TC-S002 | Subscription | Barres d'utilisation | Utilisateur Free | 1. Observer la section "Votre utilisation" | Barres : Transactions (X/50), Budgets (X/3), Objectifs (X/1), Dettes (X/3) avec pourcentage | P1 |
| TC-S003 | Subscription | Mise a niveau (Upgrade) | Utilisateur Free | 1. Cliquer "Passer a Pro" <br> 2. Choisir Pro <br> 3. Redirection checkout | Redirection vers `/checkout?plan=pro&period=monthly`, plan selectionne pre-rempli | P1 |
| TC-S004 | Subscription | Flux d'annulation — Etape 1 | Utilisateur Pro actif | 1. Cliquer "Annuler l'abonnement" | Affichage de l'etape 1 : enquete de satisfaction (raison de l'annulation), bouton "Continuer" | P2 |
| TC-S005 | Subscription | Flux d'annulation — Etape 2 (Retention) | Utilisateur sur l'etape 1 | 1. Selectionner une raison <br> 2. Cliquer "Continuer" | Affichage de l'offre de retention : -50% pendant 3 mois OU pause 1 mois, boutons "Accepter" / "Continuer l'annulation" | P2 |
| TC-S006 | Subscription | Flux d'annulation — Etape 3 (Confirmation) | Utilisateur sur l'etape 2 | 1. Cliquer "Continuer l'annulation" | Page de confirmation avec resume, checkbox "Je confirme", bouton "Annuler definitivement", message sur preservation des donnees | P1 |

### 3.12 Facturation (Billing)

| ID | Page | Fonctionnalite | Pre-conditions | Etapes | Resultat Attendu | Priorite |
|----|------|---------------|----------------|--------|-----------------|----------|
| TC-BL001 | Billing | Tableau des factures | Utilisateur avec historique | 1. Acceder a /billing | Tableau avec : Numero, Date, Periode, Montant, Statut (Payee/En attente/Annulee), Action (Telecharger) | P1 |
| TC-BL002 | Billing | Telechargement PDF | Factures existantes | 1. Cliquer l'icone "Telecharger" sur une facture | Fichier PDF genere avec logo, details de la facture, lignes de commande, total TTC | P2 |
| TC-BL003 | Billing | CRUD moyens de paiement | Utilisateur connecte | 1. Ajouter une carte (Stripe test) <br> 2. Definir comme par defaut <br> 3. Supprimer | Carte ajoutee avec masquage (**** 4242), par defaut = true, suppression avec confirmation | P2 |
| TC-BL004 | Billing | Sauvegarde infos de facturation | Utilisateur sur /billing | 1. Remplir le formulaire : nom, adresse, ville, code postal, pays <br> 2. Cliquer "Sauvegarder" | Donnees sauvegardees, toast de confirmation, affichage mis a jour | P2 |

### 3.13 Parametres (Settings)

| ID | Page | Fonctionnalite | Pre-conditions | Etapes | Resultat Attendu | Priorite |
|----|------|---------------|----------------|--------|-----------------|----------|
| TC-ST001 | Settings | Mise a jour profil | Utilisateur connecte | 1. Aller dans l'onglet "Profil" <br> 2. Modifier le nom et la photo <br> 3. Sauvegarder | Profil mis a jour, avatar affiche dans le header, toast de confirmation | P2 |
| TC-ST002 | Settings | Changement de langue | Utilisateur dans "Regional" | 1. Selectionner "Espanol" dans le selecteur de langue <br> 2. Sauvegarder | Interface traduite en ES, labels mis a jour, localStorage mis a jour, rechargement de la page | P1 |
| TC-ST003 | Settings | Changement de devise | Utilisateur dans "Regional" | 1. Changer EUR → USD <br> 2. Sauvegarder | Tous les montants de l'application convertis en USD, symbole $ affiche | P1 |
| TC-ST004 | Settings | Toggle notifications | Utilisateur dans "Notifications" | 1. Desactiver "Emails de resume hebdomadaire" <br> 2. Activer "Alertes budget" | Etat sauvegarde, toggle visuel mis a jour, comportement effectif | P2 |
| TC-ST005 | Settings | Changement de mot de passe | Utilisateur dans "Securite" | 1. Saisir ancien mdp <br> 2. Saisir nouveau mdp (2x) <br> 3. Valider | Verification de l'ancien mdp, validation du nouveau, message de succes, deconnexion forcee | P1 |
| TC-ST006 | Settings | Suppression de compte | Utilisateur dans "Danger Zone" | 1. Cliquer "Supprimer mon compte" <br> 2. Saisir le mot de passe <br> 3. Confirmer | Compte supprime, donnees anonymisees, redirection vers landing, message de confirmation | P1 |

---

## 4. Cas de Tests SaaS Specifiques

### 4.1 Feature Gating (Gardes d'Acces)

| ID | Fonctionnalite | Pre-conditions | Etapes | Resultat Attendu | Priorite |
|----|---------------|----------------|--------|-----------------|----------|
| TC-FG001 | Verrouillage Free → Analytics | Utilisateur Free | 1. Naviguer vers /analytics | Page avec overlay de verrouillage, message "Passez a Pro pour debloquer", bouton "Mettre a niveau", pas d'erreur 404 | P1 |
| TC-FG002 | Acces Pro → Export CSV | Utilisateur Pro | 1. Aller sur /transactions <br> 2. Cliquer "Exporter CSV" | Export fonctionnel, fichier genere | P1 |
| TC-FG003 | Limite Free → Transactions | Utilisateur Free ayant 50 transactions | 1. Essayer d'ajouter une 51e transaction | Message : "Limite atteinte — Passez a Pro pour illimite", bouton d'upgrade, transaction non creee | P1 |
| TC-FG004 | Limite Free → Objectifs | Utilisateur Free avec 1 objectif | 1. Essayer de creer un 2e objectif | Bouton "Nouvel objectif" desactive ou avec tooltip, message de limitation | P1 |
| TC-FG005 | Acces Premium → IA Insights | Utilisateur Premium | 1. Aller sur /analytics <br> 2. Scroller vers "Insights IA" | Section visible avec recommandations personnalisees, analyse predictive | P1 |
| TC-FG006 | Acces Premium → Crypto | Utilisateur Premium | 1. Aller sur /checkout | Option de paiement Crypto (BTC/ETH) disponible et fonctionnelle | P1 |
| TC-FG007 | Acces Premium → Family Sharing | Utilisateur Premium | 1. Aller dans Settings <br> 2. Onglet "Partage Familial" | Option visible, invitation de membres fonctionnelle (max 4) | P2 |

### 4.2 Cycle de Vie de la Souscription

| ID | Fonctionnalite | Pre-conditions | Etapes | Resultat Attendu | Priorite |
|----|---------------|----------------|--------|-----------------|----------|
| TC-SL001 | Statut Actif | Abonnement Pro en cours | 1. Consulter /subscription | Badge "Actif" vert, date de prochaine facturation affichee, acces complet au plan | P1 |
| TC-SL002 | Statut Annule (fin de periode) | Utilisateur ayant annule | 1. Consulter /subscription | Badge "Expire le [date]" orange, message sur non-renouvellement, acces conserve jusqu'a la date | P1 |
| TC-SL003 | Statut Expire | Abonnement Pro termine | 1. Se connecter <br> 2. Naviguer | Redirection vers /subscription, badge "Expire" rouge, acces limite au plan Free, message d'upgrade | P1 |
| TC-SL004 | Reactivation | Utilisateur expire | 1. Cliquer "Reactiver mon abonnement" <br> 2. Choisir un plan <br> 3. Payer | Statut "Actif" immediatement, acces restaure, nouvelle date de facturation | P1 |
| TC-SL005 | Grace period | Paiement echoue | 1. Simuler echec de paiement | 7 jours de periode de grace, acces maintenu, notifications repetees, downgrade Free apres 7 jours | P2 |

### 4.3 Methodes de Paiement

| ID | Fonctionnalite | Pre-conditions | Etapes | Resultat Attendu | Priorite |
|----|---------------|----------------|--------|-----------------|----------|
| TC-PM001 | Stripe — Paiement reussi | Carte test valide (4242 4242 4242 4242) | 1. Aller au checkout <br> 2. Saisir carte <br> 3. Confirmer | Paiement reussi, souscription activee, redirection Dashboard, email de confirmation | P1 |
| TC-PM002 | Stripe — Paiement refuse | Carte test refusee (4000 0000 0000 0002) | 1. Saisir carte refusee <br> 2. Confirmer | Message "Votre carte a ete refusee", retry possible, aucun debit, reste sur la page | P1 |
| TC-PM003 | Crypto — Affichage QR | Utilisateur Premium | 1. Choisir paiement Crypto <br> 2. Selectionner BTC | QR code genere avec adresse wallet, montant en BTC converti, timer de 15 min, instructions | P2 |
| TC-PM004 | Crypto — Statut En attente | Paiement Crypto initie | 1. Scanner QR mais ne pas payer | Statut "En attente" pendant 15 min, expiration apres delai, message d'expiration | P2 |
| TC-PM005 | Mobile Money — Selection operateur | Utilisateur en zone CEMAC | 1. Choisir "Mobile Money" <br> 2. Selectionner MTN | Instructions USSD affichees (*126#), numero de reference genere, modal d'instructions | P2 |
| TC-PM006 | Mobile Money — Orange Money | Selection operateur | 1. Choisir Orange Money | Instructions USSD (*144#), integration API Orange Money sandbox | P2 |

### 4.4 Generation de Factures

| ID | Fonctionnalite | Pre-conditions | Etapes | Resultat Attendu | Priorite |
|----|---------------|----------------|--------|-----------------|----------|
| TC-IN001 | Montants corrects | Souscription Pro mensuelle | 1. Consulter la facture | Montant HT, TVA (20%), TTC corrects, detail par ligne | P1 |
| TC-IN002 | Dates de periode | Renouvellement mensuel | 1. Verifier la periode sur la facture | Dates de debut et fin correspondant exactement au mois facture | P1 |
| TC-IN003 | Transition de statut | Paiement reussi | 1. Payer <br> 2. Verifier la facture | Statut "Payee" apes paiement, passage "En attente" → "Payee" | P1 |

### 4.5 Retrogradation de Plan (Downgrade)

| ID | Fonctionnalite | Pre-conditions | Etapes | Resultat Attendu | Priorite |
|----|---------------|----------------|--------|-----------------|----------|
| TC-DG001 | Perte de fonctionnalites | Retrogradation Pro → Free | 1. Effectuer le downgrade | Section Analytics verrouillee, bouton Export masque, creation bloquee au-dela des limites Free | P1 |
| TC-DG002 | Preservation des donnees | Retrogradation avec 15 budgets | 1. Downgrade <br> 2. Consulter les budgets | 15 budgets visibles en lecture seule, les 3 premiers modifiables, message "Passez a Pro pour modifier tous vos budgets" | P1 |
| TC-DG003 | Conservation historique | Retrogradation apres 1 an d'utilisation | 1. Consulter l'historique | Toutes les transactions historiques conservees et visibles, seule la creation est limitee | P2 |

---

## 5. Tests Non-Fonctionnels

### 5.1 Performance

| ID | Critere | Seuil | Methode de Test | Outil |
|----|---------|-------|-----------------|-------|
| TC-PF001 | Temps de chargement initial | < 2.0 secondes | Lighthouse, 3 runs median | Lighthouse CI |
| TC-PF002 | Time to Interactive (TTI) | < 3.0 secondes | Lighthouse Performance audit | Lighthouse CI |
| TC-PF003 | First Contentful Paint (FCP) | < 1.5 secondes | Lighthouse | Lighthouse CI |
| TC-PF004 | Cumulative Layout Shift (CLS) | < 0.1 | Lighthouse | Lighthouse CI |
| TC-PF005 | Taille du bundle JS | < 1.5 MB (gzip) | webpack-bundle-analyzer | CI/CD |
| TC-PF006 | Requetes API (Dashboard) | < 5 requetes, < 500ms chacune | DevTools Network | Chrome DevTools |
| TC-PF007 | Rendu des graphiques | < 1 seconde pour 6 mois de donnees | Mesure manuelle avec timer | Stopwatch |

### 5.2 Accessibilite (WCAG 2.1 AA)

| ID | Critere | Exigence | Methode |
|----|---------|----------|---------|
| TC-AC001 | Contraste des couleurs | Ratio >= 4.5:1 (texte normal), >= 3:1 (UI components) | Axe DevTools, WAVE |
| TC-AC002 | Navigation clavier | Tous les elements interactifs accessibles via Tab, focus visible | Test manuel clavier uniquement |
| TC-AC003 | Lecteur d'ecran | Labels ARIA sur tous les composants, landmarks corrects | NVDA + VoiceOver |
| TC-AC004 | Zoom 200% | Aucune perte d'information, pas de scroll horizontal | Zoom navigateur |
| TC-AC005 | Attributs ARIA | role, aria-label, aria-describedby presents ou les elements sont semantiques | Axe DevTools |
| TC-AC006 | Formulaires | Labels associes, messages d'erreur associes via aria-describedby | HTML Validator |
| TC-AC007 | Skip links | Lien "Aller au contenu" present et fonctionnel sur toutes les pages | Test clavier |

### 5.3 Responsive Design

| ID | Critere | Seuil | Methode |
|----|---------|-------|---------|
| TC-RS001 | Breakpoints | 320px, 375px, 768px, 1024px, 1440px, 1920px | BrowserStack + DevTools |
| TC-RS002 | Touch targets | >= 44x44px sur mobile | Axe DevTools |
| TC-RS003 | Font scaling | Support du texte a 200% sans troncature | Parametres OS |
| TC-RS004 | Orientation | Portrait + Paysage fonctionnels sur tablette/mobile | Rotation physique |
| TC-RS005 | Safe areas | Respect des safe areas (notch, home indicator) | iPhone Simulator |

### 5.4 Securite

| ID | Critere | Exigence | Methode |
|----|---------|----------|---------|
| TC-SC001 | Prevention XSS | Sanitization des inputs, CSP headers presents | OWASP ZAP |
| TC-SC002 | localStorage | Donnees sensibles chiffrees (token), pas de PII en clair | Audit manuel du code |
| TC-SC003 | Auth Token | JWT avec expiration, refresh token rotation, stockage securise | Audit manuel |
| TC-SC004 | HTTPS | Toutes les communications en HTTPS, HSTS active | SSL Labs |
| TC-SC005 | Rate limiting | Login : 5 tentatives / 15 min, API : 100 req / min | Test de charge |
| TC-SC006 | Dependances | Aucune vulnerabilite critique (npm audit) | Snyk + npm audit |

---

## 6. Suite de Regression

Cette checklist de 30 items doit ete executee integralement avant chaque mise en production.

### Parcours Critiques (10 items)

- [ ] **REG-01** Inscription complete : Landing → Register → Onboarding → Dashboard (5 min max)
- [ ] **REG-02** Connexion avec email/mot de passe → Redirection Dashboard
- [ ] **REG-03** Connexion OAuth (Google) → Creation de session → Dashboard
- [ ] **REG-04** Upgrade Free → Pro : Subscription → Checkout (Stripe) → Confirmation → Acces Pro
- [ ] **REG-05** Ajout transaction → Mise a jour Dashboard → Mise a jour Budgets
- [ ] **REG-06** Flux d'annulation complet : Initier → Retention → Confirmer → Expiration
- [ ] **REG-07** Ajout dette → Paiement partiel → Statut mis a jour
- [ ] **REG-08** Creation objectif → Contribution → Progression mise a jour
- [ ] **REG-09** Changement langue FR → EN → ES → Toutes les pages traduites
- [ ] **REG-10** Changement devise EUR → USD → Tous les montants convertis

### Pages Publiques (4 items)

- [ ] **REG-11** Landing : Hero CTA, FAQ accordion, Pricing toggle, mobile nav
- [ ] **REG-12** Auth : Login success/failure, Register validation, Password strength, OAuth
- [ ] **REG-13** Pricing : Comparison table, Monthly/yearly toggle, CTA navigation
- [ ] **REG-14** Forgot password : Email sent confirmation, error handling

### Core Application (8 items)

- [ ] **REG-15** Dashboard : 4 KPI cards, charts render, recent transactions, navigation
- [ ] **REG-16** Transactions : CRUD, filter, search, sort, CSV export (Pro+)
- [ ] **REG-17** Budgets : 10 categories, progress bars, health badges, edit modal
- [ ] **REG-18** Dettes : CRUD, payment tracking, status filter, person search
- [ ] **REG-19** Objectifs : 5 goals, circular progress, contributions, deadline
- [ ] **REG-20** Analytics : All 4 chart types, period selector, category detail (Pro+)
- [ ] **REG-21** Subscription : Plan view, usage bars, upgrade flow, cancel retention
- [ ] **REG-22** Billing : Invoice table, PDF download, payment methods CRUD

### SaaS & Feature Gating (5 items)

- [ ] **REG-23** Free user : Analytics locked, export hidden, limit warnings displayed
- [ ] **REG-24** Pro user : All features accessible except Premium (AI, crypto, family)
- [ ] **REG-25** Premium user : All features including AI insights, crypto checkout, family sharing
- [ ] **REG-26** Subscription lifecycle : Active → Cancelled → Expired → Reactivated
- [ ] **REG-27** Payment methods : Stripe success/failure, Crypto QR, Mobile Money USSD

### Settings & Securite (3 items)

- [ ] **REG-28** Settings : All 6 tabs functional, profile update, 2FA toggle, danger zone
- [ ] **REG-29** Security : XSS prevention, token handling, password change enforces re-login
- [ ] **REG-30** Responsive : All breakpoints tested, touch targets > 44px, no layout breaks

---

## 7. Template de Rapport de Bug

### 7.1 Grille Severite / Priorite

| | **Severite 1 — Bloquant** | **Severite 2 — Critique** | **Severite 3 — Majeur** | **Severite 4 — Mineur** | **Severite 5 — Trivial** |
|---|---|---|---|---|---|
| **Priorite P1** | App crash, perte de donnees | Securite, paiement bloque | Feature core inaccessible | - | - |
| **Priorite P2** | - | Workflow principal perturbe | Feature secondaire cassee | UI cassee, contenu tronque | - |
| **Priorite P3** | - | - | - | Faute d'orthographe | Pixel perfect, amelioration |

### 7.2 Template

```markdown
## Rapport de Bug — FinTrack SaaS

### Identification
- **ID Bug :** BUG-[NUMERO]-[DATE]
- **Titre :** [Resume concis du probleme]
- **Auteur :** [Nom du QA]
- **Date :** JJ/MM/AAAA
- **Environnement :** [Staging / Production]

### Classification
- **Page / Module :** [Landing / Auth / Dashboard / ...]
- **Severite :** [1 — Bloquant / 2 — Critique / 3 — Majeur / 4 — Mineur / 5 — Trivial]
- **Priorite :** [P1 / P2 / P3]
- **Type :** [Fonctionnel / Visuel / Performance / Securite / Accessibilite]

### Description
[Description detaillee du comportement anormal]

### Conditions de Reproduction
1. [Etape 1]
2. [Etape 2]
3. [Etape 3]

### Resultat Attendu
[Description du comportement correct attendu]

### Resultat Obtenu
[Description du comportement errone observe]

### Preuves
- **Screenshot :** [Lien vers capture d'ecran]
- **Video :** [Lien vers enregistrement video si applicable]
- **Logs :**
  ```
  [Copier-coller des logs console / reseau / serveur]
  ```

### Environnement Technique
| Element | Detail |
|---------|--------|
| Navigateur | [Chrome 120 / Firefox 121 / ...] |
| OS | [Windows 11 / macOS Sonoma / ...] |
| Resolution | [1920x1080 / 375x812 / ...] |
| Compte | [Free / Pro / Premium / Expire] |

### Impact Utilisateur
[Description de l'impact sur l'experience utilisateur et le business]

### Suggestions de Correction
[Idees ou hypotheses sur la cause et la correction, si pertinent]

### Historique
- [JJ/MM/AAAA HH:MM] — Bug cree par [Auteur]
- [JJ/MM/AAAA HH:MM] — [Mises a jour, assignations, status changes]

---
**Status :** [Nouveau / Confirme / En cours / A tester / Resolu / Ferme]
**Assigne a :** [Nom du developpeur]
**Sprint :** [Numero de sprint]
**Estimation de correction :** [XS / S / M / L / XL]
```

---

## Glossaire

| Terme | Definition |
|-------|------------|
| **Feature Gating** | Mecanisme de restriction des fonctionnalites selon le plan d'abonnement |
| **KPI** | Key Performance Indicator — Indicateur cle de performance |
| **WCAG 2.1 AA** | Web Content Accessibility Guidelines — Niveau AA (standard) |
| **TTI** | Time To Interactive — Temps avant que la page soit interactive |
| **CLS** | Cumulative Layout Shift — Mesure de stabilite visuelle |
| **Retention Flow** | Flux de retention propose lors de l'annulation d'un abonnement |
| **USSD** | Unstructured Supplementary Service Data — Protocole Mobile Money |

---

*Document valide pour la version 1.0.0 de FinTrack SaaS. Toute modification fonctionnelle necessite une mise a jour de ce plan de tests.*
