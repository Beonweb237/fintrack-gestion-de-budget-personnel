# 08 — Documentation Utilisateur FinTrack SaaS

**Projet :** FinTrack — Plateforme SaaS de gestion budgetaire personnelle
**Version :** 1.0.0
**Date :** Juin 2025
**Public cible :** Utilisateurs finaux (Free, Pro, Premium)
**Langue :** Francais (FR) — Disponible aussi en EN et ES

---

## Table des Matieres

1. [Premiers Pas](#1-premiers-pas)
2. [Guide du Tableau de Bord](#2-guide-du-tableau-de-bord)
3. [Gerer vos Transactions](#3-gerer-vos-transactions)
4. [Gestion des Budgets](#4-gestion-des-budgets)
5. [Suivi des Dettes](#5-suivi-des-dettes)
6. [Objectifs d'Epargne](#6-objectifs-depargne)
7. [Analyses et Rapports](#7-analyses-et-rapports)
8. [Abonnement et Facturation](#8-abonnement-et-facturation)
9. [Parametres et Preferences](#9-parametres-et-preferences)
10. [Usage International](#10-usage-international)
11. [FAQ](#11-faq---foire-aux-questions)
12. [Depannage](#12-depannage)
13. [Support](#13-support)

---

## 1. Premiers Pas

Bienvenue sur FinTrack ! Cette documentation vous guide pas a pas pour prendre en main la plateforme et tirer le meilleur parti de vos outils de gestion financiere.

### 1.1 Creation de votre compte

Vous avez deux facons de creer un compte sur FinTrack :

**Par email et mot de passe :**

1. Rendez-vous sur [fintrack.app](https://fintrack.app) et cliquez sur **"Commencer gratuitement"** dans la section hero ou sur **"S'inscrire"** en haut a droite.
2. Remplissez le formulaire d'inscription :
   - Votre adresse email (valide)
   - Un mot de passe securise (minimum 8 caracteres, avec au moins une majuscule, un chiffre et un caractere special)
   - Confirmation du mot de passe
3. Cliquez sur **"Creer mon compte"**.
4. Un message de confirmation s'affiche. Dans cette version, la verification d'email est simulee — votre compte est immediatement actif.

**Via un compte externe (OAuth) :**

1. Sur la page d'inscription, cliquez sur l'un des boutons :
   - **Continuer avec Google**
   - **Continuer avec Apple**
   - **Continuer avec Microsoft**
2. Une fenetre de connexion du fournisseur s'ouvre. Autorisez FinTrack a acceder a votre email et nom.
3. Vous etes automatiquement connecte et redirige vers l'onboarding.

| Methode | Temps | Verification email | Mot de passe a memoriser |
|---------|-------|-------------------|------------------------|
| Email + MDP | ~2 min | Simulee (auto) | Oui |
| Google | ~30 sec | Non requise | Non |
| Apple | ~30 sec | Non requise | Non |
| Microsoft | ~30 sec | Non requise | Non |

> **Astuce :** Utilisez l'inscription par email si vous souhaitez garder un controle total sur vos identifiants. Les connexions OAuth sont parfaites pour une prise en main rapide.

### 1.2 Configuration de votre profil (Onboarding)

Apres votre inscription, un assistant en 4 etapes vous accompagne :

**Etape 1 — Bienvenue**
Un ecran de bienvenue vous presente FinTrack. Cliquez sur **"Commencer"** pour passer a la suite.

**Etape 2 — Configuration du profil**
Remplissez les informations essentielles :

| Champ | Description | Exemple |
|-------|-------------|---------|
| **Devise principale** | La devise dans laquelle vous gerez vos finances | EUR (€), USD ($), XAF (FCFA) |
| **Langue** | Langue de l'interface | Francais, English, Espanol |
| **Revenu mensuel net** | Votre revenu moyen par mois (confidentiel) | 2 500 € |

Ces donnees servent a personnaliser vos tableaux de bord et calculer vos ratios financiers. Vous pouvez les modifier a tout moment dans les Parametres.

**Etape 3 — Visite guidee (Quick Tour)**
La visite interactive vous presente les elements cles de l'interface :
- Le menu lateral de navigation
- Les cartes de resume (KPI)
- Le graphique principal
- Le bouton d'ajout rapide

Cliquez sur **"Suivant"** pour avancer ou **"Passer"** si vous preferez explorer seul.

**Etape 4 — C'est parti !**
Votre compte est pret. Cliquez sur **"Acceder au Dashboard"** pour commencer a utiliser FinTrack.

---

## 2. Guide du Tableau de Bord

Le Dashboard est votre cockpit financier. Il synthesise l'ensemble de vos donnees en un seul ecran pour une vision claire et immediate de votre situation.

### 2.1 Comprendre les cartes KPI

En haut de page, quatre cartes resumees vous donnent l'essentiel :

| KPI | Icone | Description | Calcul |
|-----|-------|-------------|--------|
| **Solde Total** | 💰 | Votre tresorerie actuelle (comptes + epargne - dettes actives) | Actifs - Passifs |
| **Revenus du mois** | 📈 | Total des revenus enregistres ce mois-ci | Somme des transactions "Revenu" du mois en cours |
| **Depenses du mois** | 📉 | Total des depenses ce mois-ci | Somme des transactions "Depense" du mois en cours |
| **Economies** | 🎯 | Montant epargne ce mois (Revenus - Depenses) | Si positif : vert 🟢 — Si negatif : rouge 🔴 |

Chaque carte affiche aussi la **variation en pourcentage** par rapport au mois precedent, vous permettant de suivre vos evolutions en un coup d'oeil.

> **Exemple :** Si votre carte "Depenses du mois" affiche "+15% vs mois dernier", c'est un signal pour verifier ou vous pourriez reduire vos depenses.

### 2.2 Lire les graphiques

**Graphique en aire — Evolution sur 6 mois**
Ce graphique affiche vos revenus (courbe verte) et vos depenses (courbe rouge) sur les 6 derniers mois. L'ecart entre les deux courbes represente votre capacite d'epargne. Une courbe des depenses qui se rapproche des revenus est un signe d'alerte.

**Graphique en doughnut — Repartition par categorie**
Ce cercle colore montre la repartition de vos depenses par categorie (Logement, Alimentation, Transport, etc.). Chaque portion correspond a une categorie. Survolez une portion avec votre souris pour voir le montant exact et le pourcentage.

**Barres de progression — Etat des budgets**
Chaque categorie budgetaire est representee par une barre horizontale colorée :
- 🟢 **Vert** : Moins de 70% utilise — budget sain
- 🟠 **Orange** : Entre 70% et 90% — surveillez vos depenses
- 🔴 **Rouge** : Plus de 90% — risque de depassement imminent

### 2.3 Transactions recentes

La section "Transactions recentes" affiche vos 5 dernieres operations (date, categorie, description, montant). Cliquez sur **"Voir tout"** pour acceder a la page complete des transactions.

### 2.4 Actions rapides

Depuis le Dashboard, vous pouvez :
- ➕ **Ajouter une transaction** (bouton flottant en bas a droite)
- 📊 **Voir les details analytiques** (clic sur n'importe quel graphique)
- ⚡ **Aller a un budget specifique** (clic sur une barre de progression)

---

## 3. Gerer vos Transactions

La page Transactions est le coeur operationnel de FinTrack. Vous y enregistrez, modifiez, recherchez et exportez l'ensemble de vos operations financieres.

### 3.1 Ajouter une transaction

1. Cliquez sur le bouton **"Nouvelle transaction"** (en haut a droite).
2. Remplissez le formulaire :

| Champ | Obligatoire | Description |
|-------|-------------|-------------|
| **Type** | Oui | Revenu (+) ou Depense (-) |
| **Categorie** | Oui | Choisir parmi : Logement, Transport, Alimentation, Loisirs, Sante, Education, Epargne, Services, Shopping, Voyages, Revenus, Autres |
| **Montant** | Oui | Montant en votre devise principale (ex: 45,00) |
| **Date** | Oui | Date de la transaction (par defaut : aujourd'hui) |
| **Description** | Non | Detail de la transaction (ex: "Courses hebdomadaires Carrefour") |

3. Cliquez sur **"Enregistrer"**.

Votre transaction apparait immediatement dans la liste, et tous les graphiques du Dashboard se mettent a jour automatiquement.

> **Astuce :** Utilisez des descriptions detaillees pour retrouver facilement vos transactions via la recherche plus tard.

### 3.2 Filtrer et rechercher

**Filtres rapides :**
Utilisez les boutons en haut de la liste pour filtrer par type :
- **Tout** — Affiche toutes les transactions
- **Revenus** — Uniquement les entrees d'argent
- **Depenses** — Uniquement les sorties d'argent

**Recherche textuelle :**
Saisissez un mot-cle dans la barre de recherche. FinTrack fouille dans :
- La description de la transaction
- La categorie
- Le montant

La recherche est instantanee — les resultats s'affichent au fur et a mesure de votre saisie.

**Tri :**
Cliquez sur les en-tetes de colonne pour trier :
- **Date** : Plus recent / Plus ancien
- **Montant** : Plus grand / Plus petit
- **Categorie** : Ordre alphabetique

### 3.3 Actions groupes (Bulk Actions)

Selectionnez plusieurs transactions via les cases a cocher pour :

| Action | Resultat |
|--------|----------|
| **Supprimer** | Supprime toutes les transactions selectionnees (avec confirmation) |
| **Exporter CSV** | Telecharge un fichier CSV contenant les transactions selectionnees (Pro/Premium uniquement) |

> **Note :** L'export CSV inclut les colonnes suivantes : ID, Date, Type, Categorie, Description, Montant, Devise.

### 3.4 Modifier et supprimer

- **Modifier :** Cliquez sur l'icone ✏️ a droite d'une transaction. Le formulaire s'ouvre en modal. Modifiez les champs et sauvegardez.
- **Supprimer :** Cliquez sur l'icone 🗑️. Une boite de confirmation s'affiche pour eviter les suppressions accidentelles.

---

## 4. Gestion des Budgets

Les budgets sont votre outil de controle des depenses. FinTrack vous permet de definir des limites mensuelles par categorie et de suivre votre avancement en temps reel.

### 4.1 Creer une categorie de budget

1. Allez dans **Budgets** via le menu lateral.
2. Cliquez sur **"Nouveau budget"**.
3. Configurez votre budget :

| Champ | Description | Exemple |
|-------|-------------|---------|
| **Categorie** | Choisissez une categorie existante ou creez-en une | Alimentation |
| **Montant limite** | Maximum que vous souhaitez depenser ce mois-ci | 400 € |
| **Seuil d'alerte** | Pourcentage a partir duquel vous etes alerte (defaut : 80%) | 80% = 320 € |

4. Cliquez sur **"Creer le budget"**.

### 4.2 Lire les barres de progression et le statut de sante

Chaque budget est affiche avec une barre de progression colorée et un badge de statut :

| Statut | Couleur | Condition | Action recommandee |
|--------|---------|-----------|-------------------|
| **Sain** | 🟢 Vert | Moins de 70% utilise | Continuez sur votre lancee ! |
| **Attention** | 🟠 Orange | 70% — 90% utilise | Surveillez vos prochaines depenses |
| **Critique** | 🔴 Rouge | 90% — 100% utilise | Ralentissez vos depenses dans cette categorie |
| **Depasse** | 🔴 Rouge fonce | Plus de 100% utilise | Vous avez depasse votre limite — ajustez le budget ou reduisez |

### 4.3 Alertes et notifications

Lorsque vous atteignez le seuil d'alerte configure (par defaut 80%), FinTrack vous previent de plusieurs manieres :
- 🔔 **Notification in-app** : Badge rouge sur l'icone du budget
- 📧 **Email** : Si active dans vos parametres de notifications
- 📱 **Centre de notifications** : Accessible via la cloche en haut de page

### 4.4 Modifier un budget

Vos besoins changent — vos budgets aussi ! Pour modifier un budget existant :
1. Trouvez la carte du budget concerne
2. Cliquez sur l'icone ✏️ (Modifier)
3. Ajustez le montant limite ou le seuil d'alerte
4. Sauvegardez

Les modifications prennent effet immediatement. Les pourcentages et statuts sont recalcules a la volee.

---

## 5. Suivi des Dettes

Le module Dettes vous aide a suivre les argents que vous devez ou qu'on vous doit. FinTrack distingue clairement les dettes actives, payees et en retard.

### 5.1 Ajouter une dette

1. Allez dans **Dettes** via le menu lateral.
2. Cliquez sur **"Nouvelle dette"**.
3. Remplissez le formulaire :

| Champ | Obligatoire | Description | Exemple |
|-------|-------------|-------------|---------|
| **Personne** | Oui | Nom de la personne concernee | Jean Dupont |
| **Type** | Oui | Je dois (je dois payer) ou On me doit (on me doit de l'argent) | Je dois |
| **Montant total** | Oui | Montant initial de la dette | 500 € |
| **Date d'echeance** | Non | Date prevue de remboursement complet | 31/12/2025 |
| **Description** | Non | Contexte de la dette | "Pret pour reparation voiture" |

4. Cliquez sur **"Enregistrer"**.

La dette apparait dans votre liste avec le badge **"Active"**.

### 5.2 Enregistrer un paiement

Pour reduire le solde d'une dette :
1. Trouvez la dette concernee dans la liste
2. Cliquez sur **"Enregistrer un paiement"**
3. Saisissez le montant du paiement (ex: 100 €)
4. Ajoutez une date et une note si necessaire
5. Validez

Le solde restant est automatiquement recalculé. Si le solde atteint 0 €, le statut passe automatiquement a **"Payee"**.

### 5.3 Comprendre les statuts

| Statut | Badge | Signification |
|--------|-------|---------------|
| **Active** | 🟡 Jaune | Dette en cours, solde restant > 0 |
| **Payee** | 🟢 Vert | Dette entierement remboursee, solde = 0 |
| **En retard** | 🔴 Rouge | Date d'echeance depassee et solde > 0 |

### 5.4 Filtrer et rechercher

Utilisez les filtres en haut de page pour afficher :
- Toutes les dettes
- Uniquement les dettes actives
- Uniquement les dettes payees
- Uniquement les dettes en retard

La barre de recherche permet de trouver une dette par **nom de personne** ou **description**.

> **Astuce :** Triez par date d'echeance pour prioriser les remboursements urgents.

---

## 6. Objectifs d'Epargne

Fixez-vous des objectifs concrets et suivez votre progression avec des visualisations motivantes.

### 6.1 Creer un objectif

1. Allez dans **Objectifs** via le menu lateral.
2. Cliquez sur **"Nouvel objectif"**.
3. Remplissez le formulaire :

| Champ | Obligatoire | Description | Exemple |
|-------|-------------|-------------|---------|
| **Nom** | Oui | Nom motivant de votre objectif | "Voyage au Japon" |
| **Montant cible** | Oui | Total a atteindre | 3 500 € |
| **Date d'echeance** | Non | Date souhaitee pour atteindre l'objectif | 15/03/2026 |
| **Image** | Non | Image d'illustration (URL ou upload) | Photo du Japon |

4. Cliquez sur **"Creer l'objectif"**.

> **Note limite de plan :** Les utilisateurs Free peuvent creer **1 objectif maximum**. Les utilisateurs Pro peuvent en creer jusqu'a **10**. Passez a Pro depuis la page Subscription si vous avez besoin de plus d'objectifs.

### 6.2 Ajouter une contribution

Pour alimenter votre objectif :
1. Cliquez sur le bouton **"+"** ou **"Ajouter"** sur la carte de l'objectif
2. Saisissez le montant que vous souhaitez ajouter (ex: 200 €)
3. Ajoutez une note optionnelle (ex: "Prime de fin d'annee")
4. Validez

L'anneau de progression se met a jour instantanement. Le pourcentage d'avancement est recalculé.

### 6.3 Suivre votre progression

Chaque objectif est represente par un **anneau de progression circulaire** :
- Le cercle se remplit au fur et a mesure de vos contributions
- Le pourcentage affiche au centre indique votre avancement
- Une couleur adaptee reflete votre progression :
  - 🔵 **Bleu** : En cours (< 50%)
  - 🟢 **Vert** : Bonne progression (50% — 90%)
  - 🌟 **Or** : Objectif presque atteint (> 90%)
  - 🎉 **Animation** : Objectif atteint (100%) !

### 6.4 Messages motivationnels

FinTrack vous encourage tout au long de votre parcours :
- **Au demarrage** : "Chaque grand voyage commence par un premier pas !"
- **A 25%** : "Vous y etes ! Un quart deja atteint."
- **A 50%** : "A mi-chemin ! Votre discipline paie."
- **A 75%** : "Plus que 25% — vous touchez au but !"
- **A 100%** : "Felicitations ! Objectif atteint ! 🎉"

### 6.5 Affichage des echeances

Si vous avez defini une date d'echeance :
- Le nombre de **jours restants** est affiche
- Un badge **"Urgent"** apparait si moins de 30 jours restants
- FinTrack calcule automatiquement la **contribution mensuelle moyenne** necessaire pour tenir vos delais

---

## 7. Analyses et Rapports

Le module Analytics (disponible en abonnement **Pro** et **Premium**) vous offre des analyses approfondies pour comprendre vos habitudes financieres et prendre de meilleures decisions.

### 7.1 Lire le graphique Revenus vs Depenses

Ce graphique en lignes compare vos revenus et vos depenses sur la periode selectionnee :
- **Ligne verte** : Revenus
- **Ligne rouge** : Depenses
- **Zone grisee** : Capacite d'epargne (espace entre les deux courbes)

Plus la zone grisee est large, plus vous epargnez. Une ligne rouge qui croise la verte est un signal d'alerte a ne pas ignorer.

### 7.2 Analyse par categorie

Le **tableau de detail par categorie** affiche pour chaque categorie :

| Colonne | Description |
|---------|-------------|
| **Categorie** | Nom de la categorie avec icone |
| **Montant total** | Somme des depenses de la categorie |
| **% du total** | Part dans les depenses totales |
| **Evolution** | Variation vs periode precedente (fleche ↑ ou ↓) |

Cliquez sur l'en-tete "Montant" pour trier les categories par ordre croissant ou decroissant.

### 7.3 Analyse des dettes

La section **Dettes** d'Analytics presente quatre KPIs cles :

| KPI | Description | Seuil d'alerte |
|-----|-------------|----------------|
| **Total dettes actives** | Somme de toutes vos dettes en cours | > 30% du revenu mensuel |
| **Ratio dettes/revenus** | Pourcentage de votre revenu consacre aux dettes | > 40% = danger |
| **Dettes en retard** | Nombre et montant des dettes dont l'echeance est passee | Toute dette en retard |
| **Mensualite moyenne** | Moyenne des paiements mensuels de dettes | Compare au budget |

### 7.4 Exporter vos donnees

(Abonnement **Premium** uniquement)

1. Allez dans **Analytics**
2. Cliquez sur le bouton **"Exporter les donnees"** en haut a droite
3. Choisissez le format :
   - **PDF** : Rapport complet avec graphiques et tableaux
   - **CSV** : Donnees brutes pour Excel ou Google Sheets
   - **Excel** : Fichier .xlsx formate avec onglets

L'export contient toutes les donnees de la periode selectionnee.

> **Acces reserve :** Ce module n'est pas accessible en plan Free. Un ecran de verrouillage vous propose de passer a Pro ou Premium.

---

## 8. Abonnement et Facturation

FinTrack propose trois niveaux d'abonnement adaptes a vos besoins.

### 8.1 Comprendre votre plan

| Plan | Prix | Transactions | Budgets | Objectifs | Dettes | Analytics | Export |
|------|------|-------------|---------|-----------|--------|-----------|--------|
| **Free** | Gratuit | 50 max | 3 max | 1 max | 3 max | ❌ | ❌ |
| **Pro** | 9.99€/mois | Illimite | Illimite | 10 max | Illimite | ✅ | CSV |
| **Premium** | 19.99€/mois | Illimite | Illimite | Illimite | Illimite | ✅ + IA | Tous formats |

Accedez a votre plan actuel depuis **Subscription** dans le menu lateral. Vous y voyez :
- Votre plan actuel avec badge
- La date de renouvellement
- Votre utilisation actuelle (barres de progression)

### 8.2 Verifier vos limites d'utilisation

La section **"Votre utilisation"** affiche des barres pour chaque ressource limite :
- **Transactions** : 34 / 50 (Free) ou Illimite (Pro/Premium)
- **Budgets** : 2 / 3 (Free) ou Illimite
- **Objectifs** : 1 / 1 (Free) ou 5 / 10 (Pro) ou Illimite (Premium)
- **Dettes** : 2 / 3 (Free) ou Illimite

Lorsqu'une barre approche 100%, un message vous invite a upgrader.

### 8.3 Mettre a niveau votre plan

1. Allez dans **Subscription**
2. Cliquez sur **"Passer a Pro"** ou **"Passer a Premium"**
3. Choisissez la periode :
   - **Mensuel** : Prix mensuel standard
   - **Annuel** : -20% de reduction (2 mois offerts)
4. Vous etes redirige vers la page de paiement (Checkout)

### 8.4 Gerer vos moyens de paiement

FinTrack accepte trois methodes de paiement :

**Carte bancaire (Stripe)**
1. Sur le Checkout, selectionnez **"Carte bancaire"**
2. Saisissez votre numero de carte, date d'expiration et CVC
3. Cliquez sur **"Payer"**
4. Votre souscription est immediatement activee

**Cryptomonnaies (Premium uniquement)**
1. Selectionnez **"Cryptomonnaie"**
2. Choisissez **Bitcoin (BTC)** ou **Ethereum (ETH)**
3. Un **QR code** s'affiche avec l'adresse de paiement
4. Scannez le QR code avec votre wallet crypto
5. Le paiement est valide apres confirmation blockchain (temps variable)

**Mobile Money (Afrique)**
1. Selectionnez **"Mobile Money"**
2. Choisissez votre operateur : **MTN Mobile Money** ou **Orange Money**
3. Suivez les instructions USSD affichees a l'ecran :
   - MTN : Composez *126# et suivez les instructions
   - Orange : Composez *144# et suivez les instructions
4. Saisissez le code de reference affiche dans le champ de validation

### 8.5 Consulter et telecharger vos factures

1. Allez dans **Billing** (Facturation)
2. Le tableau affiche l'historique de vos factures :

| Colonne | Description |
|---------|-------------|
| **Numero** | Identifiant unique (ex: FT-2025-001) |
| **Date** | Date d'emission |
| **Periode** | Periode couverte (ex: 01/06/2025 — 30/06/2025) |
| **Montant** | Total TTC |
| **Statut** | Payee / En attente / Annulee |

3. Cliquez sur l'icone **Telecharger** pour obtenir le PDF de la facture.

### 8.6 Annuler votre abonnement

Nous esperons que vous resterez, mais si vous souhaitez annuler :

1. Allez dans **Subscription**
2. Cliquez sur **"Annuler l'abonnement"**
3. **Etape 1** — Indiquez la raison de votre depart (enquete rapide)
4. **Etape 2** — Nous vous proposons une offre de retention :
   - **-50% pendant 3 mois** sur votre abonnement actuel
   - Ou une **pause de 1 mois** gratuite
5. **Etape 3** — Si vous confirmez l'annulation :
   - Cochez la case **"Je confirme l'annulation de mon abonnement"**
   - Cliquez sur **"Annuler definitivement"**

> **Important :** Vos donnees sont conservees pendant 12 mois apres l'annulation. Vous pouvez reactiver votre compte a tout moment pendant cette periode. Apres 12 mois, les donnees sont anonymisees puis supprimees.

---

## 9. Parametres et Preferences

Personnalisez FinTrack selon vos preferences dans la page **Parametres**, accessible depuis le menu lateral ou votre avatar en haut a droite.

### 9.1 Profil

L'onglet **Profil** vous permet de gerer :

| Element | Action |
|---------|--------|
| **Photo de profil** | Cliquez sur l'avatar pour uploader une nouvelle image (JPG, PNG, max 2Mo) |
| **Nom complet** | Modifiez votre nom affiche dans l'interface |
| **Email** | Consultez votre email de connexion (non modifiable directement) |
| **Bio** | Ajoutez une courte description personnelle (optionnel) |

### 9.2 Langue et devise

Dans l'onglet **Regional / i18n** :

| Parametre | Options disponibles |
|-----------|-------------------|
| **Langue** | English (EN), Francais (FR), Espanol (ES) |
| **Devise** | EUR (€), USD ($), GBP (£), XAF (FCFA), XOF (CFA), CAD, AUD, et 20+ autres |
| **Format de date** | JJ/MM/AAAA (Europe), MM/JJ/AAAA (US), AAAA-MM-JJ (ISO) |
| **Fuseau horaire** | Selection automatique ou manuelle parmi 400+ fuseaux |

Le changement de langue est effectif immediatement apres sauvegarde. Le changement de devise recalcule tous les montants affiches avec le taux de change du jour.

### 9.3 Notifications

Dans l'onglet **Notifications**, activez ou desactivez :

| Notification | Description | Par defaut |
|-------------|-------------|------------|
| **Alertes budget** | Avertissement quand un budget atteint 80% | ✅ Active |
| **Resume hebdomadaire** | Email recapitulatif chaque lundi | ✅ Active |
| **Alertes dettes** | Rappel des echeances de dettes | ✅ Active |
| **Notifications objectifs** | Quand un objectif est proche ou atteint | ✅ Active |
| **Offres promotionnelles** | Nouvelles fonctionnalites et offres | ❌ Desactivee |
| **Securite** | Connexions suspectes, changements de mot de passe | ✅ Active |

### 9.4 Securite

L'onglet **Securite** regroupe tous les parametres de protection de votre compte :

**Changement de mot de passe**
1. Saisissez votre mot de passe actuel
2. Saisissez votre nouveau mot de passe (respectez les criteres de force)
3. Confirmez le nouveau mot de passe
4. Validez — vous serez deconnecte de toutes les sessions

**Authentification a deux facteurs (2FA)**
1. Activez le toggle 2FA
2. Scannez le QR code avec Google Authenticator, Authy ou un app equivalent
3. Saisissez le code a 6 chiffres genere pour confirmer
4. Desormais, chaque connexion necessitera votre mot de passe + un code 2FA

### 9.5 Zone de danger

L'onglet **Danger Zone** contient les actions irreversibles :

- **Suppression de compte** : Saisissez votre mot de passe pour confirmer. Vos donnees seront anonymisees puis supprimees definitivement apres 30 jours.

> ⚠️ **Attention :** Cette action est **irreversible**. Pensez a exporter vos donnees avant de supprimer votre compte.

---

## 10. Usage International

FinTrack est concu pour une utilisation internationale, avec un support multilingue et multidevise.

### 10.1 Langues supportees

| Langue | Code | Couverture | Etat |
|--------|------|------------|------|
| **English** | EN | 100% des labels et contenus | ✅ Complet |
| **Francais** | FR | 100% des labels et contenus | ✅ Complet |
| **Espanol** | ES | 100% des labels et contenus | ✅ Complet |

Pour changer de langue : **Parametres > Regional > Langue > Sauvegarder**.

### 10.2 Conversion de devises

FinTrack utilise les taux de change en temps reel pour la conversion. Les conversions sont effectuees :
- A l'affichage (pour la presentation)
- A l'enregistrement (les montants sont stockes dans votre devise principale)

| Devise | Region | Symbole |
|--------|--------|---------|
| Euro | Europe | € |
| Dollar US | Etats-Unis | $ |
| Livre Sterling | Royaume-Uni | £ |
| Franc CFA (CEMAC) | Afrique centrale | FCFA |
| Franc CFA (UEMOA) | Afrique de l'Ouest | CFA |
| Dollar canadien | Canada | C$ |
| Peso mexicain | Mexique | Mex$ |

### 10.3 Disponibilite Mobile Money par pays

Le paiement Mobile Money est disponible dans les pays suivants :

| Pays | Operateurs | Code pays |
|------|-----------|-----------|
| **Cameroun** | MTN, Orange | CM |
| **Cote d'Ivoire** | MTN, Orange, Moov | CI |
| **Senegal** | Orange, Free, Wave | SN |
| **Ghana** | MTN, Vodafone, AirtelTigo | GH |
| **Nigeria** | MTN, Airtel, Glo | NG |
| **Kenya** | M-Pesa (Safaricom) | KE |

### 10.4 Guide de paiement par cryptomonnaie

**Avant de payer en crypto :**
1. Assurez-vous d'avoir un **abonnement Premium** (la crypto n'est pas disponible en Free/Pro)
2. Utilisez un wallet compatible : MetaMask, Trust Wallet, Coinbase Wallet, Ledger
3. Verifiez que vous disposez des fonds necessaires + frais de reseau (gas fees)

**Etapes :**
1. Au checkout, selectionnez **Cryptomonnaie**
2. Choisissez **BTC** ou **ETH**
3. Un QR code et une adresse de wallet s'affichent
4. Ouvrez votre wallet mobile et scannez le QR code
5. Le montant exact en crypto est pre-rempli
6. Confirmez la transaction dans votre wallet
7. Attendez la confirmation reseau (BTC : ~10-60 min, ETH : ~2-5 min)
8. Votre abonnement est active apres confirmation

> **Important :** Envoyez **exactement** le montant affiche. Toute difference peut necessiter un traitement manuel. Les frais de reseau (gas) sont a votre charge.

---

## 11. FAQ — Foire aux Questions

### Questions generales

**Q1 : FinTrack est-il vraiment gratuit ?**
> Oui ! Le plan Free est gratuit a vie et vous permet de gerer jusqu'a 50 transactions, 3 budgets, 1 objectif d'epargne et 3 dettes. C'est ideal pour demarrer et decouvrir la plateforme.

**Q2 : Puis-je changer de plan a tout moment ?**
> Absolument. Vous pouvez upgrader de Free a Pro ou Premium a tout moment. Vous pouvez aussi downgrader. La modification prend effet immediatement pour les upgrades, et a la fin de la periode en cours pour les downgrades.

**Q3 : Mes donnees financieres sont-elles securisees ?**
> Toutes vos donnees sont chiffrees en transit (HTTPS/TLS) et au repos. Vos identifiants de paiement ne transitent jamais par nos serveurs (Stripe les gere directement). Nous ne vendons jamais vos donnees.

**Q4 : Que se passe-t-il si j'annule mon abonnement ?**
> Vous conservez l'acces a vos fonctionnalites Pro/Premium jusqu'a la fin de la periode payee. Ensuite, votre compte passe en Free. Vos donnees historiques sont conservees et visibles, mais les fonctionnalites avancees sont verrouillees.

### Questions techniques

**Q5 : FinTrack fonctionne-t-il hors ligne ?**
> L'application necessite une connexion Internet pour synchroniser vos donnees. Une version hors ligne est prevue pour 2026.

**Q6 : Puis-je utiliser FinTrack sur plusieurs appareils ?**
> Oui ! Votre compte est accessible depuis n'importe quel appareil (desktop, tablette, mobile) via votre navigateur. Vos donnees sont synchronisees en temps reel.

**Q7 : Quels navigateurs sont supportes ?**
> Chrome 120+, Firefox 121+, Safari 17+ et Edge 120+. Nous recommandons Chrome pour la meilleure experience.

### Questions financieres

**Q8 : Comment sont calcules les KPI du Dashboard ?**
> Le solde total = (somme de vos revenus) - (somme de vos depenses) - (dettes actives). Les revenus et depenses du mois se basent sur le calendrier du mois en cours.

**Q9 : Puis-je gerer plusieurs devises simultanement ?**
> Vous avez une devise principale pour votre compte. Les transactions dans d'autres devises doivent etre converties manuellement. Le support multi-devises est prevu pour 2026.

**Q10 : Les taux de change sont-ils a jour ?**
> Oui, les taux de change sont actualises quotidiennement depuis une source financiere tierce fiable.

### Questions abonnement

**Q11 : Puis-je mettre mon abonnement en pause ?**
> Oui ! Lors du flux d'annulation, nous vous proposons une pause gratuite d'1 mois. Votre abonnement reprend automatiquement apres la pause.

**Q12 : Y a-t-il des frais de resiliation ?**
> Aucun. Vous pouvez annuler a tout moment sans frais. Il n'y a pas d'engagement de duree.

**Q13 : Comment fonctionne la periode de grace en cas de paiement refuse ?**
> Si votre paiement echoue, vous disposez de 7 jours de periode de grace avec acces complet. Nous vous envoyons des rappes quotidiens. Apres 7 jours, votre compte passe automatiquement en Free.

**Q14 : La suppression de compte est-elle definitive ?**
> Oui. Apres confirmation, vos donnees sont anonymisees immediatement et definitivement supprimees apres 30 jours. Pensez a exporter vos donnees avant.

**Q15 : Puis-je partager mon compte avec ma famille ?**
> Cette fonctionnalite est reservee aux abonnements **Premium**. Elle permet d'inviter jusqu'a 4 membres de famille avec des permissions personnalisables.

---

## 12. Depannage

### Problemes de connexion

| Probleme | Cause probable | Solution |
|----------|---------------|----------|
| "Email ou mot de passe incorrect" | Faute de saisie ou compte inexistant | Verifiez votre email, utilisez "Mot de passe oublie" si necessaire |
| "Trop de tentatives" | 5 echecs en 15 minutes | Attendez 15 minutes avant de reessayer |
| La page reste blanche | Probleme de chargement JS | Videz le cache (Ctrl+Shift+R), verifiez votre connexion |
| Deconnexion frequente | Expiration du token | Cochez "Se souvenir de moi" a la connexion |

### Problemes d'affichage

| Probleme | Cause probable | Solution |
|----------|---------------|----------|
| Graphiques non affiches | Canvas bloque par extension | Desactivez les bloqueurs de pub/extensions pour FinTrack |
| Tableau coupe sur mobile | Zoom trop eleve | Remettez le zoom a 100% (Ctrl+0) |
| Texte trop petit | Parametres navigateur | Augmentez la taille de police dans votre navigateur |
| Mise en page cassee | Navigateur non supporte | Mettez a jour votre navigateur (versions min dans la doc) |

### Problemes de donnees

| Probleme | Cause probable | Solution |
|----------|---------------|----------|
| Transaction non apparue | Delai de synchronisation | Rafraichissez la page (F5) |
| Montant incorrect | Mauvaise devise selectionnee | Verifiez votre devise principale dans Parametres |
| Budget non mis a jour | Cache navigateur | Videz le cache et reconnectez-vous |
| Donnees manquantes apres upgrade | Delai d'activation | Attendez 2-3 minutes, deconnectez-vous/reconnectez-vous |

### Problemes de paiement

| Probleme | Cause probable | Solution |
|----------|---------------|----------|
| "Carte refusee" | Fonds insuffisants ou banque restrictive | Contactez votre banque ou essayez une autre carte |
| QR code crypto non scanne | Mauvais wallet | Utilisez MetaMask, Trust Wallet ou Coinbase Wallet |
| Mobile Money non valide | Mauvais code USSD | Suivez exactement les instructions affichees, verifiez votre solde Mobile Money |
| Facture non telechargee | Popup bloquee | Autorisez les popups pour FinTrack dans votre navigateur |

---

## 13. Support

Notre equipe de support est la pour vous aider. Le niveau de support depend de votre plan d'abonnement.

### Canaux de support

| Canal | Disponibilite | Temps de reponse |
|-------|--------------|-----------------|
| **Centre d'aide** | Tous les plans | immediat (documentation) |
| **Email** | Tous les plans | 48h (Free), 24h (Pro), 12h (Premium) |
| **Chat en direct** | Pro et Premium | 24h (Pro), immediat (Premium) |
| **Video call** | Premium uniquement | Sur rendez-vous, sous 48h |

### Priorisation des tickets

| Priorite | Delai de reponse | Plans concernes |
|----------|-----------------|----------------|
| **P1 — Bloquant** | 4 heures ouvrées | Pro, Premium |
| **P2 — Important** | 24 heures ouvrées | Tous |
| **P3 — Question** | 48 heures ouvrées | Tous |

### Contact

- **Email :** support@fintrack.app
- **Chat :** Disponible dans l'application (icone bulle en bas a droite)
- **Centre d'aide :** [help.fintrack.app](https://help.fintrack.app)

### Avant de contacter le support

Pour un traitement rapide de votre demande, preparez :
1. Votre adresse email de compte
2. Votre plan actuel (Free / Pro / Premium)
3. Votre navigateur et sa version
4. Une description detaillee du probleme
5. Une capture d'ecran si possible

> **Astuce Premium :** Les utilisateurs Premium peuvent planifier un appel video directement depuis l'application. Allez dans **Parametres > Support > Planifier un appel**.

---

*Merci d'utiliser FinTrack ! Nous sommes ravis de vous accompagner dans la gestion de vos finances.*

*Pour toute suggestion d'amelioration de cette documentation, contactez-nous a docs@fintrack.app*
