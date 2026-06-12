# FinTrack SaaS — Prompts Backend Production
## Transformation en application full-stack 100% operationnelle
### Prompts sequentiels : Backend API + Base de donnees + Auth + Paiements + CI/CD

---

## SOMMAIRE

| Phase | Description | Prompts |
|-------|-------------|---------|
| 1 | Architecture Backend & BDD | 1.1 — 1.3 |
| 2 | Auth & Securite | 2.1 — 2.3 |
| 3 | API REST | 3.1 — 3.6 |
| 4 | Paiements (Stripe + Crypto + Mobile Money) | 4.1 — 4.3 |
| 5 | WebSocket temps reel | 5.1 |
| 6 | Emails & Notifications | 6.1 |
| 7 | Uploads & Stockage | 7.1 |
| 8 | Migration Frontend → Backend | 8.1 — 8.3 |
| 9 | Docker & CI/CD | 9.1 — 9.2 |
| 10 | Monitoring & Production | 10.1 — 10.2 |

---

## PHASE 1 — Architecture Backend & Base de Donnees

---

### PROMPT 1.1 — Architecture backend complete

```
Cree l'architecture backend complete pour FinTrack SaaS en utilisant le stack suivant :

STACK :
- Node.js 20 + TypeScript 5.4
- Express.js 4.19 (framework HTTP)
- Prisma ORM 5.14 (acces BDD)
- PostgreSQL 16 (base de donnees relationnelle)
- Redis 7 (cache + sessions + rate limiting)
- JWT (jsonwebtoken 9.0) pour l'authentification stateless
- bcrypt (bcryptjs 2.4) pour le hashage des mots de passe
- Zod 3.23 pour la validation des schemas
- Helmet 7.1 pour la securite HTTP headers
- CORS 2.8 pour les cross-origin requests
- Morgan + Winston pour le logging
- dotenv pour les variables d'environnement
- nodemon + tsx pour le dev

STRUCTURE DU DOSSIER backend/ :
```
backend/
  prisma/
    schema.prisma       — Schema complet de la BDD
    migrations/         — Migrations Prisma
    seed.ts             — Script de peuplement de donnees
  src/
    config/
      database.ts       — Connexion Prisma + Redis
      env.ts            — Validation des variables d'environnement (Zod)
      logger.ts         — Configuration Winston
    controllers/        — Logique metier (CRUD)
      auth.controller.ts
      user.controller.ts
      transaction.controller.ts
      budget.controller.ts
      debt.controller.ts
      goal.controller.ts
      subscription.controller.ts
      payment.controller.ts
      analytics.controller.ts
      category.controller.ts
    middlewares/
      auth.middleware.ts       — Verification JWT
      rbac.middleware.ts       — Role-Based Access Control
      validate.middleware.ts   — Validation Zod des body/params/query
      rate-limit.middleware.ts — Rate limiting par endpoint
      error.middleware.ts      — Gestion globale des erreurs
      upload.middleware.ts     — Multer pour les fichiers
    routes/             — Definition des routes API
      auth.routes.ts
      user.routes.ts
      transaction.routes.ts
      budget.routes.ts
      debt.routes.ts
      goal.routes.ts
      subscription.routes.ts
      payment.routes.ts
      analytics.routes.ts
      category.routes.ts
    services/           — Logique metier complexe
      stripe.service.ts
      crypto.service.ts
      mobile-money.service.ts
      email.service.ts
      analytics.service.ts
    utils/
      jwt.util.ts       — Sign/verify JWT
      password.util.ts  — Hash/compare passwords
      crypto.util.ts    — Encryption donnees sensibles
      currency.util.ts  — Conversion de devises
    types/
      express.d.ts      — Extensions de types Express
    app.ts              — Configuration Express (middlewares, routes)
    server.ts           — Point d'entree (connexion BDD + demarrage serveur)
  tests/                — Tests unitaires et integration
  .env.example
  docker-compose.yml
  Dockerfile
  package.json
  tsconfig.json
```

Installe toutes les dependances avec "npm install".
Verifie que "npm run dev" demarre sans erreur sur le port 4000.
```

---

### PROMPT 1.2 — Schema Prisma complet

```
Cree le fichier prisma/schema.prisma avec le schema complet suivant :

GENERATOR & DATASOURCE :
- generator client : provider = "prisma-client-js"
- datasource db : provider = "postgresql", url = env("DATABASE_URL")

MODELES (tous avec createdAt/updatedAt @default(now()) / @updatedAt) :

1. model User :
   - id String @id @default(uuid())
   - email String @unique
   - password String (hashe avec bcrypt)
   - name String
   - avatar String? (URL Cloudinary/S3)
   - language String @default("en") (en/fr/es)
   - currency String @default("USD") (USD/EUR/GBP)
   - timezone String @default("Europe/Paris")
   - dateFormat String @default("MM/DD/YYYY")
   - role Role @default(USER) (enum : USER, ADMIN, SUPPORT)
   - isEmailVerified Boolean @default(false)
   - emailVerificationToken String? @unique
   - resetPasswordToken String? @unique
   - resetPasswordExpires DateTime?
   - stripeCustomerId String? @unique
   — Relations : subscription?, transactions[], budgets[], debts[], goals[], categories[], sessions[]

2. model Session :
   - id String @id @default(uuid())
   - userId String
   - token String @unique (JWT refresh token)
   - device String (User-Agent)
   - ipAddress String
   - location String?
   - expiresAt DateTime
   - isRevoked Boolean @default(false)
   — Relation : user User @relation(fields: [userId], references: [id], onDelete: Cascade)

3. model Subscription :
   - id String @id @default(uuid())
   - userId String @unique (1:1 avec User)
   - planId PlanTier @default(FREE)
   - interval Interval @default(MONTHLY)
   - status SubscriptionStatus @default(TRIAL)
   - currentPeriodStart DateTime
   - currentPeriodEnd DateTime
   - cancelAtPeriodEnd Boolean @default(false)
   - stripeSubscriptionId String? @unique
   — Relation : user User @relation(fields: [userId], references: [id], onDelete: Cascade)

4. model Invoice :
   - id String @id @default(uuid())
   - subscriptionId String
   - userId String
   - amount Decimal @db.Decimal(10, 2)
   - currency String @default("USD")
   - status InvoiceStatus @default(PENDING)
   - paidAt DateTime?
   - periodStart DateTime
   - periodEnd DateTime
   - paymentMethod String (stripe/crypto/mtn/orange)
   - stripePaymentIntentId String?
   - description String
   - pdfUrl String? (URL du PDF genere)
   — Relations : subscription, user

5. model PaymentMethod :
   - id String @id @default(uuid())
   - userId String
   - type String (stripe/crypto/mtn/orange)
   - label String
   - last4 String?
   - expiryMonth Int?
   - expiryYear Int?
   - brand String? (visa/mastercard/amex)
   - stripePaymentMethodId String?
   - isDefault Boolean @default(false)
   — Relation : user

6. model Transaction :
   - id String @id @default(uuid())
   - userId String
   - date DateTime
   - description String
   - amount Decimal @db.Decimal(10, 2)
   - type TransactionType (INCOME/EXPENSE)
   - paymentMethod String (card/cash/transfer/check)
   - categoryId String
   - notes String?
   - receiptUrl String?
   — Relations : user, category

7. model Category :
   - id String @id @default(uuid())
   - userId String
   - name String
   - type CategoryType (INCOME/EXPENSE)
   - color String @default("#94A3B8")
   - icon String @default("circle")
   - budget Decimal? @db.Decimal(10, 2)
   - isDefault Boolean @default(false)
   — Relations : user, transactions[]

8. model Budget :
   - id String @id @default(uuid())
   - userId String
   - categoryId String
   - month String @db.VarChar(7) (format "YYYY-MM")
   - limit Decimal @db.Decimal(10, 2)
   - alertThreshold Int @default(90) (pourcentage)
   — Relations : user, category

9. model SavingsGoal :
   - id String @id @default(uuid())
   - userId String
   - name String
   - description String?
   - targetAmount Decimal @db.Decimal(10, 2)
   - currentAmount Decimal @default(0) @db.Decimal(10, 2)
   - deadline DateTime?
   - color String @default("#F59E0B")
   - icon String @default("target")
   — Relations : user, contributions[]

10. model Contribution :
    - id String @id @default(uuid())
    - goalId String
    - amount Decimal @db.Decimal(10, 2)
    - note String?
    — Relation : goal

11. model Debt :
    - id String @id @default(uuid())
    - userId String
    - personName String
    - personAvatar String?
    - personContact String?
    - description String
    - amount Decimal @db.Decimal(10, 2)
    - repaidAmount Decimal @default(0) @db.Decimal(10, 2)
    - type DebtType (I_OWE/OWED_TO_ME)
    - status DebtStatus (ACTIVE/PAID/OVERDUE)
    - dueDate DateTime?
    - note String?
    - reminderEnabled Boolean @default(false)
    — Relations : user, payments[]

12. model DebtPayment :
    - id String @id @default(uuid())
    - debtId String
    - amount Decimal @db.Decimal(10, 2)
    - note String?
    — Relation : debt

ENUMS a definir : Role, PlanTier, Interval, SubscriptionStatus, InvoiceStatus, TransactionType, CategoryType, DebtType, DebtStatus

Cree ensuite le fichier prisma/seed.ts qui peuple la BDD avec :
- 1 utilisateur admin
- 1 utilisateur demo avec toutes les donnees (30 transactions, 10 budgets, 5 goals, 8 debts, 14 categories)
- Les 3 plans (Free, Pro, Premium) dans une table Plan

Execute "npx prisma migrate dev --name init" puis "npx prisma db seed".
Verifie que les tables sont creees dans PostgreSQL.
```

---

### PROMPT 1.3 — Configuration et connexions

```
Cree les fichiers de configuration du backend :

1. backend/src/config/env.ts :
   — Validation Zod des variables d'environnement obligatoires :
     DATABASE_URL, REDIS_URL, JWT_SECRET, JWT_REFRESH_SECRET,
     STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_ID_PRO, STRIPE_PRICE_ID_PREMIUM,
     CRYPTO_PAYMENT_ADDRESS_BTC, CRYPTO_PAYMENT_ADDRESS_ETH,
     MTN_MOMO_API_KEY, MTN_MOMO_API_USER, MTN_MOMO_BASE_URL,
     ORANGE_MONEY_API_KEY, ORANGE_MONEY_BASE_URL,
     RESEND_API_KEY, FRONTEND_URL
   — Exporte un objet ENV type-safe

2. backend/src/config/database.ts :
   — Exporte PrismaClient singleton avec $extends pour logging
   — Exporte Redis client (ioredis)
   — Fonction connectDB() qui teste la connexion Prisma + Redis

3. backend/src/config/logger.ts :
   — Winston avec 3 transports : console (dev), fichier info, fichier error
   — Format JSON avec timestamps

4. backend/.env.example :
   — Toutes les variables avec des exemples de valeurs

5. backend/docker-compose.yml :
   — Service postgres:16 (port 5432, volume persistant)
   — Service redis:7-alpine (port 6379)
   — Service app (build depuis Dockerfile, port 4000, depends_on postgres + redis)
   — Network bridge

Verifie que "docker-compose up postgres redis" demarre les services.
```

---

## PHASE 2 — Authentification & Securite

---

### PROMPT 2.1 — Auth controller (register, login, logout, refresh)

```
Cree backend/src/controllers/auth.controller.ts avec :

REGISTER (POST /api/auth/register) :
1. Validation Zod du body : { name: string(min 2), email: string(email), password: string(min 8), currency?: string, language?: string }
2. Verifie que l'email n'existe pas deja
3. Hash le mot de passe avec bcrypt (12 salt rounds)
4. Cree l'utilisateur dans PostgreSQL via Prisma
5. Genere un token de verification d'email (UUID)
6. Envoie un email de verification via email.service.ts
7. Cree un abonnement FREE avec periode d'essai 14 jours
8. Genere un JWT access token (15 min d'expiration) et un refresh token (7 jours)
9. Cree une Session en BDD avec le refresh token
10. Retourne : { user: { id, name, email, avatar, language, currency }, accessToken, refreshToken, subscription }

LOGIN (POST /api/auth/login) :
1. Validation Zod : { email: string, password: string }
2. Trouve l'utilisateur par email
3. Compare le mot de passe avec bcrypt.compare
4. Genere access token + refresh token
5. Cree une Session en BDD
6. Retourne les memes donnees que register

LOGOUT (POST /api/auth/logout) :
1. Recupere le refresh token depuis le header ou cookie
2. Marque la Session comme revoked en BDD
3. Supprime le cookie de refresh token
4. Retourne { success: true }

REFRESH (POST /api/auth/refresh) :
1. Recupere le refresh token depuis le cookie "refreshToken"
2. Verifie que la Session existe et n'est pas revoked
3. Verifie que le refresh token est valide (JWT verify)
4. Genere un nouvel access token
5. Retourne { accessToken }

FORGOT PASSWORD (POST /api/auth/forgot-password) :
1. Validation : { email: string }
2. Genere un reset token (UUID) + expiration (1 heure)
3. Sauvegarde dans User.resetPasswordToken / resetPasswordExpires
4. Envoie un email avec le lien de reinitialisation
5. Retourne { message: "If an account exists, an email was sent" }

RESET PASSWORD (POST /api/auth/reset-password/:token) :
1. Validation : { password: string(min 8) }
2. Trouve l'utilisateur par token non expire
3. Hash le nouveau mot de passe
4. Supprime les champs reset token
5. Retourne { message: "Password updated successfully" }

VERIFY EMAIL (GET /api/auth/verify-email/:token) :
1. Trouve l'utilisateur par emailVerificationToken
2. Met isEmailVerified a true
3. Supprime le token
4. Redirige vers le frontend /auth?verified=true

Exporte toutes les fonctions comme handler Express async.
```

---

### PROMPT 2.2 — Middlewares de securite

```
Cree les middlewares de securite suivants :

1. backend/src/middlewares/auth.middleware.ts :
   — Fonction authenticate(req, res, next)
   — Lit le header "Authorization: Bearer <token>"
   — Verifie le JWT avec JWT_SECRET
   — Attache req.userId au payload decoded
   — Optionnel : si le header x-refresh-token est present et le token principal expire, tente un refresh silencieux
   — Erreurs : 401 "Invalid token", 401 "Token expired", 401 "No token provided"

2. backend/src/middlewares/rbac.middleware.ts :
   — Fonction requireRole(...roles: Role[])
   — Verifie que req.user.role est dans la liste autorisee
   — Erreur 403 "Insufficient permissions"

3. backend/src/middlewares/validate.middleware.ts :
   — Fonction validate(schema: ZodSchema)
   — Valide req.body, req.params, req.query avec le schema Zod
   — Erreur 400 avec details des champs invalides

4. backend/src/middlewares/rate-limit.middleware.ts :
   — Rate limiter par route :
     * Auth : 5 requetes / 15 minutes par IP (prevent brute force)
     * API generale : 100 requetes / 15 minutes par user
     * Paiements : 10 requetes / heure par user
   — Utilise Redis pour stocker les compteurs (ioredis)
   — Headers X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
   — Erreur 429 "Too many requests" avec Retry-After

5. backend/src/middlewares/error.middleware.ts :
   — Gestion centralisee des erreurs
   — Erreurs Prisma : mapping vers codes HTTP (P2002 → 409, P2025 → 404)
   — Erreurs Zod : 400 avec details
   — Erreurs JWT : 401
   — Erreurs Stripe : 400 avec message adapte
   — Erreurs generiques : 500, log l'erreur avec Winston
   — En production : ne retourne pas la stack trace

6. backend/src/app.ts :
   — Configure Express avec :
     * Helmet() pour les headers de securite
     * CORS({ origin: FRONTEND_URL, credentials: true })
     * express.json({ limit: '10mb' })
     * Morgan pour le logging des requetes HTTP
     * Cookie-parser pour les refresh tokens
     * Routes API sous /api/v1
     * Middleware d'erreur en dernier

Cree backend/src/routes/auth.routes.ts qui :
— Route POST /register → authController.register
— Route POST /login → authController.login
— Route POST /logout → authController.logout
— Route POST /refresh → authController.refresh
— Route POST /forgot-password → authController.forgotPassword
— Route POST /reset-password/:token → authController.resetPassword
— Route GET /verify-email/:token → authController.verifyEmail

Teste avec Postman ou curl que chaque endpoint repond correctement.
```

---

### PROMPT 2.3 — OAuth (Google, Apple, Microsoft)

```
Cree l'integration OAuth pour Google, Apple et Microsoft dans backend/src/controllers/oauth.controller.ts :

GOOGLE OAUTH (POST /api/auth/google) :
1. Recoit { idToken: string } depuis le frontend (Google Identity Services)
2. Verifie le idToken avec l'API Google (google-auth-library)
3. Extrait : email, name, picture (avatar)
4. Si l'utilisateur existe : genere JWT + refresh token, retourne session
5. Si non : cree un compte sans mot de passe (authProvider: "google"), abonnement FREE
6. Retourne les memes donnees que login classique

APPLE OAUTH (POST /api/auth/apple) :
1. Recoit { identityToken, authorizationCode, user?: { name: { firstName, lastName } } }
2. Verifie le token avec les cles publiques Apple (JWKS)
3. Extrait email, nom
4. Logique identique a Google

MICROSOFT OAUTH (POST /api/auth/microsoft) :
1. Recoit { accessToken: string }
2. Appelle l'API Microsoft Graph (/me) avec le access token
3. Extrait : email, displayName
4. Logique identique

Cree les schemas Zod pour valider chaque payload.

Dans backend/src/config/oauth.ts :
— Configuration des credentials pour chaque provider (client IDs, secrets depuis .env)

Dans backend/src/routes/oauth.routes.ts :
— Routes POST /google, POST /apple, POST /microsoft

Ajoute un champ authProvider (GOOGLE/APPLE/MICROSOFT/EMAIL) au model User.
```

---

## PHASE 3 — API REST Complete

---

### PROMPT 3.1 — User API

```
Cree backend/src/controllers/user.controller.ts avec :

GET /api/users/me (authentifie) :
— Retourne le profil complet de l'utilisateur connecte (sans le password)
— Inclut la subscription, les preferences

PATCH /api/users/me (authentifie) :
— Body : { name?, avatar?, language?, currency?, timezone?, dateFormat?, monthlyIncome? }
— Validation Zod
— Met a jour l'utilisateur en BDD
— Retourne l'utilisateur mis a jour

DELETE /api/users/me (authentifie) :
— Supprime l'utilisateur et toutes ses donnees (cascade)
— Si abonnement actif, annule d'abord via Stripe
— Supprime le customer Stripe
— Retourne { message: "Account deleted successfully" }

GET /api/users/me/sessions (authentifie) :
— Liste toutes les sessions actives de l'utilisateur
— Exclut la session courante (req.sessionId)
— Format : [{ id, device, ipAddress, location, lastActive }]

DELETE /api/users/me/sessions/:id (authentifie) :
— Revoke une session specifique (set isRevoked = true)

GET /api/users/me/preferences (authentifie) :
— Retourne { language, currency, timezone, dateFormat, notifications: {...} }

PATCH /api/users/me/preferences (authentifie) :
— Met a jour les preferences utilisateur
— Sauvegarde aussi dans Redis pour acces rapide

Dans backend/src/routes/user.routes.ts :
— Toutes les routes protegees par authenticate middleware
```

---

### PROMPT 3.2 — Transaction API (CRUD complet)

```
Cree backend/src/controllers/transaction.controller.ts :

GET /api/transactions (authentifie) :
— Query params : page, limit, sortBy, sortOrder, type, categoryId, search, dateFrom, dateTo
— Pagination avec Prisma skip/take
— Filtres dynamiques (type INCOME/EXPENSE, categoryId, date range, search texte dans description)
— Tri : date/amount/description asc/desc
— Retourne : { data: Transaction[], pagination: { page, limit, total, totalPages } }

POST /api/transactions (authentifie) :
— Body : { description, amount, type, paymentMethod, categoryId, date, notes?, receipt? }
— Validation Zod
— Cree la transaction associee a req.userId
— Verifie la limite du plan (Free = 50/mois) → 403 si depasse
— Incremente le compteur Redis pour le tracking d'usage
— Retourne la transaction creee

GET /api/transactions/:id (authentifie) :
— Retourne une transaction par ID
— Verifie que la transaction appartient a l'utilisateur connecte

PATCH /api/transactions/:id (authentifie) :
— Met a jour les champs fournis
— Verifie l'ownership

DELETE /api/transactions/:id (authentifie) :
— Supprime la transaction
— Verifie l'ownership

POST /api/transactions/bulk-delete (authentifie) :
— Body : { ids: string[] }
— Supprime les transactions en batch

GET /api/transactions/export/csv (authentifie) :
— Genere un fichier CSV avec toutes les transactions filtrees
— Headers : Date, Description, Category, Type, Amount, Payment Method, Notes
— Content-Type: text/csv
— Content-Disposition: attachment; filename="transactions.csv"

GET /api/transactions/stats/summary (authentifie) :
— Retourne les KPIs : totalIncome, totalExpenses, balance, transactionCount
— Pour le mois courant par defaut, ou periode specifiee par query params

Dans backend/src/routes/transaction.routes.ts :
— Toutes les routes avec authenticate
— rate-limit : 100 req/15min pour GET, 20 req/15min pour POST
```

---

### PROMPT 3.3 — Budget & Category APIs

```
Cree backend/src/controllers/budget.controller.ts et category.controller.ts :

BUDGET API :
GET /api/budgets — Liste les budgets de l'utilisateur pour le mois specifie (query: month=YYYY-MM)
POST /api/budgets — Cree un budget : { categoryId, month, limit, alertThreshold }
PATCH /api/budgets/:id — Modifie limit ou alertThreshold
DELETE /api/budgets/:id — Supprime le budget
GET /api/budgets/:id/progress — Retourne { spent, limit, percentage, remaining, status }
— Status calcule : healthy (0-50%), good (50-75%), warning (75-90%), critical (90-100%), overspent (>100%)
— Le spent est calcule en temps reel depuis les transactions du mois

CATEGORY API :
GET /api/categories — Liste les categories (default + personnalisees de l'utilisateur)
POST /api/categories — Cree une categorie personnalisee : { name, type, color, icon, budget? }
PATCH /api/categories/:id — Modifie une categorie
DELETE /api/categories/:id — Supprime (sauf categories default avec isDefault=true)
GET /api/categories/:id/stats — Retourne les stats de la categorie : total spent, count, trend

Les routes sont protegees par authenticate.
```

---

### PROMPT 3.4 — Debt & Goal APIs

```
Cree backend/src/controllers/debt.controller.ts et goal.controller.ts :

DEBT API :
GET /api/debts — Liste les dettes avec filtres : type (i-owe/owed-to-me), status, search (personName)
POST /api/debts — Cree une dette : { personName, personContact?, description, amount, type, dueDate?, note?, reminderEnabled? }
GET /api/debts/:id — Detail d'une dette avec tous ses payments
PATCH /api/debts/:id — Modifie une dette
DELETE /api/debts/:id — Supprime une dette et ses payments
POST /api/debts/:id/payments — Ajoute un paiement : { amount, note? }
— Met a jour automatiquement repaidAmount
— Si repaidAmount >= amount, met status a PAID
— Si dueDate depassee et pas entierement paye, met status a OVERDUE

GOAL API :
GET /api/goals — Liste les objectifs
POST /api/goals — Cree un objectif : { name, description?, targetAmount, deadline?, color, icon }
GET /api/goals/:id — Detail avec contributions
PATCH /api/goals/:id — Modifie
DELETE /api/goals/:id — Supprime
POST /api/goals/:id/contributions — Ajoute une contribution : { amount, note? }
— Met a jour currentAmount
— Si currentAmount >= targetAmount, retourne un flag goalReached: true

Toutes les routes sont protegees par authenticate.
```

---

### PROMPT 3.5 — Subscription & Analytics APIs

```
Cree backend/src/controllers/subscription.controller.ts et analytics.controller.ts :

SUBSCRIPTION API :
GET /api/subscriptions/me — Retourne l'abonnement courant avec les limites d'usage (Redis counters)
POST /api/subscriptions/upgrade — Upgrade de plan : { planId, interval, paymentMethod, ...paymentDetails }
— Verifie le paiement
— Cree la subscription en BDD (ou met a jour)
— Genere une invoice
— Met a jour le cache Redis
POST /api/subscriptions/cancel — Cancel : { reason?, acceptRetentionOffer? }
— Si acceptRetentionOffer = true → applique reduction 50% 3 mois
— Sinon → cancelAtPeriodEnd = true
POST /api/subscriptions/reactivate — Reactive l'abonnement
GET /api/subscriptions/usage — Retourne les compteurs d'usage : transactionsCount, budgetsCount, goalsCount, debtsCount
GET /api/subscriptions/plans — Liste les 3 plans disponibles avec leurs features et prix

ANALYTICS API :
GET /api/analytics/dashboard — Retourne les KPIs pour le dashboard :
  { balance, income, expenses, savingsRate, transactionCount, budgetStatus, goalProgress }
GET /api/analytics/monthly — Donnees mensuelles pour les charts : { month, income, expenses, balance }[]
GET /api/analytics/categories — Repartition par categorie : { categoryId, name, color, amount, percentage }[]
GET /api/analytics/debts — Analytics des dettes : { totalReceivable, totalPayable, netBalance, overdueAmount, recoveryRate }
GET /api/analytics/export/:format — Export PDF ou Excel des rapports

Toutes les routes sont protegees par authenticate.
```

---

### PROMPT 3.6 — Invoice & Payment Method APIs

```
Cree backend/src/controllers/payment.controller.ts :

INVOICE API :
GET /api/invoices — Liste les factures de l'utilisateur avec pagination
GET /api/invoices/:id — Detail d'une facture
GET /api/invoices/:id/pdf — Genere et retourne le PDF de la facture
— Utilise une librairie comme PDFKit ou Puppeteer pour generer un PDF professionnel
— Layout : en-tete FinTrack, infos facture (numero, date, periode), tableau des lignes, total, pied de page

PAYMENT METHOD API :
GET /api/payment-methods — Liste les methodes de paiement
POST /api/payment-methods — Ajoute une methode :
  * Card : via Stripe Setup Intent → retourne client_secret pour confirmation frontend
  * Crypto : enregistre l'adresse wallet
  * Mobile Money : enregistre le numero + provider
PATCH /api/payment-methods/:id/default — Definit comme methode par defaut
DELETE /api/payment-methods/:id — Supprime (sauf si c'est la derniere)

Les routes sont protegees par authenticate.
```

---

## PHASE 4 — Paiements Reels

---

### PROMPT 4.1 — Integration Stripe complete

```
Cree backend/src/services/stripe.service.ts avec :

DEPENDANCE : stripe ^15.0 (SDK officiel Stripe)

1. createCustomer(userId: string, email: string, name: string) :
   — Cree un customer Stripe
   — Sauvegarde stripeCustomerId dans User

2. createSetupIntent(userId: string) :
   — Cree un SetupIntent pour sauvegarder une carte
   — Retourne client_secret

3. createPaymentIntent(userId: string, amount: number, currency: string) :
   — Cree un PaymentIntent pour un paiement unique
   — Retourne client_secret

4. createSubscription(userId: string, priceId: string) :
   — Cree une subscription Stripe avec le priceId (pro ou premium)
   — Retourne { subscriptionId, clientSecret, status }

5. cancelSubscription(stripeSubscriptionId: string) :
   — Annule la subscription a la fin de la periode

6. reactivateSubscription(stripeSubscriptionId: string) :
   — Reactive une subscription annulee

7. handleWebhook(payload: string, signature: string) :
   — Verifie la signature du webhook
   — Gere les evenements :
     * invoice.payment_succeeded → cree une Invoice en BDD, active l'abonnement
     * invoice.payment_failed → marque l'invoice comme FAILED, envoie un email
     * customer.subscription.updated → sync le status en BDD
     * customer.subscription.deleted → marque comme CANCELLED en BDD

8. generateInvoicePDF(invoiceId: string) :
   — Genere un PDF professionnel pour la facture

Cree la route POST /api/webhooks/stripe :
— Lit le body brut (pas JSON parse)
— Appelle stripeService.handleWebhook
— Retourne 200 OK (sinon Stripe reessaie)

Dans .env, ajoute :
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_PREMIUM=price_...

Le frontend Checkout utilise Stripe Elements (@stripe/stripe-js et @stripe/react-stripe-js) pour :
— Afficher le formulaire de carte securise (PCI compliant)
— Confirmer le paiement avec le client_secret du backend
— Rediriger vers /dashboard?success=true apres paiement
```

---

### PROMPT 4.2 — Integration Crypto (Coinbase Commerce)

```
Cree backend/src/services/crypto.service.ts avec :

DEPENDANCE : axios pour les appels API

1. createCharge(userId: string, amount: number, currency: string, cryptoType: 'bitcoin' | 'ethereum') :
   — Cree une charge via l'API Coinbase Commerce
   — Body : { name: "FinTrack Subscription", description: "...", pricing_type: "fixed_price", local_price: { amount, currency }, requested_info: ["email"] }
   — Retourne : { chargeId, hostedUrl, qrCodeUrl, address, amount: cryptoAmount, expiresAt }

2. getChargeStatus(chargeId: string) :
   — Verifie le statut d'une charge
   — Retourne : { status: 'NEW'|'PENDING'|'COMPLETED'|'EXPIRED', confirmedAt? }

3. handleWebhook(payload: object) :
   — Gere les evenements Coinbase Commerce
   — charges:confirmed → active l'abonnement, cree l'invoice
   — charges:failed → envoie un email d'echec

Cree la route POST /api/webhooks/crypto :
— Verifie la signature (X-CC-Webhook-Signature)
— Appelle cryptoService.handleWebhook

Le frontend affiche :
— Le QR code (encode l'adresse wallet en QR via qrcode library ou URL)
— L'adresse wallet avec bouton copier
— Le montant en crypto
— Un bouton "I've sent the payment" qui poll le statut toutes les 10 secondes
— Apres confirmation (statut COMPLETED) → upgrade le plan

Dans .env : COINBASE_COMMERCE_API_KEY=...
```

---

### PROMPT 4.3 — Integration Mobile Money (MTN MOMO + Orange Money)

```
Cree backend/src/services/mobile-money.service.ts avec :

DEPENDANCE : axios pour les appels HTTP aux APIs

MTN MOMO API :
1. requestPayment(phoneNumber: string, amount: number, currency: string, userId: string) :
   — Authentification : OAuth2 client credentials (apiKey + apiUser)
   — POST /collection/v1_0/requesttopay
   — Body : { amount, currency, externalId: userId, payer: { partyIdType: "MSISDN", partyId: phoneNumber }, payerMessage: "FinTrack Subscription", payeeNote: "..." }
   — Retourne : { referenceId, status: 'PENDING' }

2. checkPaymentStatus(referenceId: string) :
   — GET /collection/v1_0/requesttopay/{referenceId}
   — Retourne : { status: 'PENDING'|'SUCCESSFUL'|'FAILED', amount, currency, payer: { partyId } }

3. handleCallback(payload: object) :
   — Gere le callback asynchrone de MTN
   — SUCCESSFUL → active l'abonnement, cree l'invoice
   — FAILED → envoie un email

ORANGE MONEY API :
1. requestPayment(phoneNumber: string, amount: number, currency: string, userId: string) :
   — POST /orange-money-webpay/dev/v1/payment
   — Body : { merchant_key, currency, order_id: userId, amount, return_url, cancel_url, notif_url, lang: "fr", reference: "FinTrack" }
   — Retourne payment_url + token

2. checkPaymentStatus(token: string) :
   — GET /orange-money-webpay/dev/v1/payment/{token}
   — Retourne le statut

Cree les routes :
POST /api/payments/mobile-money/request — Lance un paiement
GET /api/payments/mobile-money/status/:referenceId — Verifie le statut
POST /api/webhooks/mtn-momo — Callback MTN
POST /api/webhooks/orange-money — Callback Orange

Le frontend :
— Selection du provider (MTN/Orange) avec logos
— Input numero de telephone avec indicatif pays (+233, +225, +237, +256)
— Bouton "Request Payment" → appelle le backend
— Polling du statut toutes les 5 secondes
— Message "Check your phone for a USSD prompt to confirm"
— Apres SUCCESSFUL → upgrade le plan

Dans .env :
MTN_MOMO_BASE_URL=https://sandbox.momodeveloper.mtn.com
MTN_MOMO_API_KEY=...
MTN_MOMO_API_USER=...
MTN_MOMO_SUBSCRIPTION_KEY=...
ORANGE_MONEY_API_KEY=...
ORANGE_MONEY_BASE_URL=https://api.orange.com
```

---

## PHASE 5 — WebSocket Temps Reel

---

### PROMPT 5.1 — Notifications en temps reel

```
Cree un serveur WebSocket pour les notifications temps reel :

DEPENDANCE : socket.io ^4.7

FICHIER backend/src/websocket.ts :
— Configure Socket.IO avec le serveur Express
— Authentification : verifie le JWT token dans le handshake query
— Room par userId (socket.join(`user_${userId}`))

EVENEMENTS EMIS PAR LE SERVEUR :
— payment:success — Quand un paiement est confirme (Stripe webhook, crypto confirmed, mobile money successful)
— payment:failed — Quand un paiement echoue
— subscription:updated — Quand l'abonnement change (upgrade, downgrade, cancel)
— budget:alert — Quand un budget depasse son seuil d'alerte
— debt:reminder — Rappel automatique pour les dettes proches de l'echeance
— goal:reached — Quand un objectif est atteint

EVENEMENTS RECUS DU CLIENT :
— subscribe:user — Rejoint la room de l'utilisateur
— markNotificationRead — Marque une notification comme lue

FICHIER backend/src/services/notification.service.ts :
— createNotification(userId, type, title, message, data?) — Sauvegarde en BDD + emet via WebSocket
— getUnreadNotifications(userId) — Retourne les notifications non lues
— markAsRead(notificationId) — Marque comme lue

Le frontend cree un hook useSocket() qui :
— Se connecte au WebSocket avec le JWT token
— Ecoute les evenements et affiche les toasts (sonner)
— Rejoint la room utilisateur au montage
— Se deconnecte au demontage
```

---

## PHASE 6 — Emails & Notifications

---

### PROMPT 6.1 — Service d'emails

```
Cree backend/src/services/email.service.ts avec :

DEPENDANCE : resend ^3.2 (ou @sendgrid/mail si prefere)

Configuration :
— Client Resend avec RESEND_API_KEY
— Sender : FinTrack <no-reply@fintrack.app>
— Templates HTML pour chaque email

TEMPLATES EMAILS :

1. sendVerificationEmail(email: string, token: string) :
   — Sujet : "Verify your FinTrack account"
   — Lien : FRONTEND_URL/auth/verify-email?token=...

2. sendWelcomeEmail(email: string, name: string) :
   — Sujet : "Welcome to FinTrack!"
   — Contenu personnalise avec le nom

3. sendPasswordResetEmail(email: string, token: string) :
   — Sujet : "Reset your FinTrack password"
   — Lien : FRONTEND_URL/auth/reset-password?token=...

4. sendPaymentReceipt(invoice: Invoice) :
   — Sujet : "Payment Receipt — FinTrack [Plan]"
   — Detail du paiement, montant, periode, lien vers la facture PDF

5. sendPaymentFailedEmail(userId: string, invoice: Invoice) :
   — Sujet : "Payment Failed — Update your payment method"
   — Instructions pour mettre a jour la methode de paiement

6. sendSubscriptionCancellationEmail(userId: string, endDate: Date) :
   — Sujet : "Your FinTrack subscription has been cancelled"
   — Date de fin d'acces, options pour reactiver

7. sendBudgetAlert(userId: string, budgetName: string, percentage: number) :
   — Sujet : "Budget Alert — [budgetName] at [percentage]%"
   — Declenche quand un budget depasse son threshold

8. sendDebtReminder(userId: string, debt: Debt) :
   — Sujet : "Debt Reminder — [debt.personName]"
   — Rappel pour les dettes avec reminderEnabled=true et proche echeance

9. sendGoalReached(userId: string, goal: SavingsGoal) :
   — Sujet : "Congratulations! You reached your [goal.name] goal!"

10. sendWeeklySummary(userId: string, stats: WeeklyStats) :
    — Sujet : "Your Weekly FinTrack Summary"
    — Revenus, depenses, budgets en alerte, progres objectifs

Utilise un systeme de queue pour les emails (Redis list + worker) pour ne pas bloquer les requetes HTTP.
```

---

## PHASE 7 — Uploads & Stockage

---

### PROMPT 7.1 — Upload de fichiers

```
Cree le service d'upload et de stockage :

DEPENDANCES : multer ^1.4 (upload), cloudinary ^2.2 (stockage cloud) OU @aws-sdk/client-s3 ^3.600 (AWS S3)

1. backend/src/middlewares/upload.middleware.ts :
   — Multer avec limite 5MB
   — Filtre : images uniquement (jpeg, png, webp) pour avatars, pdf pour reçus
   — Stockage temporaire en memoire (pas de disk)

2. backend/src/services/upload.service.ts :
   uploadAvatar(file: Buffer, userId: string) :
   — Upload vers Cloudinary (ou S3) dans le dossier "avatars/"
   — Nom du fichier : avatar_{userId}_{timestamp}.webp
   — Retourne l'URL publique
   
   uploadReceipt(file: Buffer, transactionId: string) :
   — Upload vers Cloudinary dans "receipts/"
   — Retourne l'URL

3. Routes :
   POST /api/users/me/avatar — Upload d'avatar
   POST /api/transactions/:id/receipt — Upload de reçu

Le frontend utilise un input file drag-and-drop avec preview.
```

---

## PHASE 8 — Migration Frontend

---

### PROMPT 8.1 — Service API client

```
Cree le client API pour le frontend dans src/services/api.ts :

DEPENDANCE : axios ^1.7

Configuration :
— Base URL depuis VITE_API_URL (ou http://localhost:4000/api/v1 en dev)
— Timeout : 10000ms
— Headers par defaut : Content-Type: application/json

Interceptors :
— Request : ajoute le header Authorization: Bearer <accessToken> depuis localStorage
— Response error 401 : tente un refresh silencieux avec le refresh token, puis retry la requete
— Si refresh echoue : redirige vers /auth

Fonctions exportees (toutes typees) :
— api.get<T>(url, config?) → Promise<T>
— api.post<T>(url, data?, config?) → Promise<T>
— api.patch<T>(url, data?, config?) → Promise<T>
— api.delete<T>(url, config?) → Promise<T>

Exemple d'usage :
const transactions = await api.get<PaginatedResponse<Transaction>>('/transactions', { params: { page: 1, limit: 10 } });
```

---

### PROMPT 8.2 — Remplacement des contextes

```
Modifie les contextes pour utiliser le vrai backend :

1. Met a jour src/contexts/AuthContext.tsx :
   — login(email, password) : POST /api/auth/login au lieu du mock
   — register(name, email, password) : POST /api/auth/register
   — logout() : POST /api/auth/logout + suppression localStorage
   — Au montage : GET /api/auth/refresh pour verifier la session
   — Stocke uniquement le accessToken dans localStorage (pas l'utilisateur entier)

2. Met a jour src/contexts/SubscriptionContext.tsx :
   — Au montage : GET /api/subscriptions/me pour charger la subscription
   — upgradePlan() : POST /api/subscriptions/upgrade
   — cancelSubscription() : POST /api/subscriptions/cancel
   — getCurrentPlan() : lit depuis le state (pas depuis le fichier local)
   — canUseFeature() : appelle GET /api/subscriptions/usage

3. Cree src/contexts/NotificationContext.tsx :
   — Notifications en temps reel via WebSocket
   — unreadCount dans le state
   — markAsRead(id), markAllAsRead()

Toutes les donnees viennent du backend, plus de mock data (sauf en mode demo).
```

---

### PROMPT 8.3 — Mise a jour des pages

```
Modifie les pages pour utiliser le backend au lieu des donnees mock :

DASHBOARD (src/pages/Dashboard.tsx) :
— useEffect au montage : GET /api/analytics/dashboard → setKPIs
— GET /api/analytics/monthly → setChartData
— Chargement avec skeleton shadcn/ui

TRANSACTIONS (src/pages/Transactions.tsx) :
— GET /api/transactions?page=&limit=&search=&type= → donnees pagines
— POST /api/transactions → creation
— PATCH /api/transactions/:id → modification
— DELETE /api/transactions/:id → suppression
— GET /api/transactions/export/csv → export (window.open)

BUDGETS, DETTES, OBJECTIFS :
— Meme pattern : GET liste, POST creation, PATCH modification, DELETE suppression

SETTINGS :
— GET /api/users/me → profil
— PATCH /api/users/me → mise a jour
— GET /api/users/me/preferences → preferences
— PATCH /api/users/me/preferences → sauvegarde

CHECKOUT :
— Stripe : utilise Stripe Elements (@stripe/stripe-js)
  * GET /api/payment-methods/setup-intent → client_secret
  * Confirme le SetupIntent, recupere le paymentMethodId
  * POST /api/subscriptions/upgrade avec paymentMethodId
— Crypto : GET /api/payments/crypto/charge → affiche QR
— Mobile Money : POST /api/payments/mobile-money/request → poll status

Ajoute des etats de chargement (skeletons), des etats d'erreur (toasts), et des retry automatiques.
```

---

## PHASE 9 — Docker & CI/CD

---

### PROMPT 9.1 — Docker & docker-compose

```
Cree les fichiers Docker :

1. backend/Dockerfile :
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
RUN npx prisma generate
EXPOSE 4000
CMD ["node", "dist/server.js"]
```

2. frontend/Dockerfile :
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

3. nginx.conf (pour le frontend) :
```nginx
server {
  listen 80;
  server_name localhost;
  root /usr/share/nginx/html;
  index index.html;
  location / {
    try_files $uri $uri/ /index.html;
  }
  location /api {
    proxy_pass http://backend:4000;
  }
}
```

4. docker-compose.prod.yml (racine du projet) :
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: fintrack
      POSTGRES_USER: fintrack
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://fintrack:${DB_PASSWORD}@postgres:5432/fintrack
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
      STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY}
    ports:
      - "4000:4000"
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
  redis_data:
```

5. .github/workflows/ci-cd.yml (CI/CD GitHub Actions) :
```yaml
name: CI/CD
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
        working-directory: ./backend
      - run: npx prisma migrate deploy
        working-directory: ./backend
      - run: npm test
        working-directory: ./backend
      - run: npm ci && npm run build
        working-directory: ./frontend

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      - run: docker-compose -f docker-compose.prod.yml build
      - run: docker-compose -f docker-compose.prod.yml push
      - run: |
          ssh ${{ secrets.SSH_USER }}@${{ secrets.SSH_HOST }} \
            "cd /opt/fintrack && docker-compose pull && docker-compose up -d"
```

Verifie que "docker-compose -f docker-compose.prod.yml up --build" demarre tous les services.
```

---

### PROMPT 9.2 — Reverse proxy & SSL

```
Configure le reverse proxy et SSL pour la production :

1. Docker Compose avec Traefik (reverse proxy + SSL auto) :

Ajoute au docker-compose.prod.yml :
```yaml
  traefik:
    image: traefik:v3.0
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.tlschallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.email=admin@fintrack.app"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - letsencrypt:/letsencrypt
    labels:
      - "traefik.enable=true"

  frontend:
    labels:
      - "traefik.http.routers.frontend.rule=Host(`fintrack.app`)"
      - "traefik.http.routers.frontend.entrypoints=websecure"
      - "traefik.http.routers.frontend.tls.certresolver=letsencrypt"
      - "traefik.http.services.frontend.loadbalancer.server.port=80"

  backend:
    labels:
      - "traefik.http.routers.backend.rule=Host(`api.fintrack.app`)"
      - "traefik.http.routers.backend.entrypoints=websecure"
      - "traefik.http.routers.backend.tls.certresolver=letsencrypt"
      - "traefik.http.services.backend.loadbalancer.server.port=4000"
```

2. Alternative : Nginx + Certbot
— nginx/nginx.conf avec upstream backend
— Certbot pour Let's Encrypt SSL auto-renewal
— docker-compose avec certbot companion

Verifie que HTTPS fonctionne et que les certificats se renouvellent automatiquement.
```

---

## PHASE 10 — Monitoring & Production

---

### PROMPT 10.1 — Monitoring & logs

```
Cree l'infrastructure de monitoring :

1. Logging avec Winston + rotation :
— backend/logs/app.log (info+)
— backend/logs/error.log (error+)
— Rotation journaliere (30 jours de retention)
— Format JSON structurel pour parsing automatique

2. Health Check endpoint :
GET /api/health :
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:00Z",
  "services": {
    "database": "connected",
    "redis": "connected",
    "stripe": "connected"
  },
  "version": "2.0.0"
}
```

3. Metriques avec prom-client (Prometheus) :
— Nombre de requetes HTTP par route et status code
— Latence des requetes (histogram)
—— Nombre d'utilisateurs actifs
—— Nombre de transactions par heure
—— Taux de reussite des paiements
— GET /api/metrics pour Prometheus scraping

4. Uptime monitoring (UptimeRobot ou BetterUptime) :
—— Check /api/health toutes les 5 minutes
—— Alertes email/SMS si le service est down

5. Error tracking avec Sentry :
—— Integration dans le error.middleware
—— Capture des exceptions automatiques
—— Contexte utilisateur pour le debugging

6. APM (Application Performance Monitoring) :
—— Optionnel : Elastic APM ou Datadog pour tracing distribue
```

---

### PROMPT 10.2 — Backup & disaster recovery

```
Cree la strategie de backup et recovery :

1. Backup PostgreSQL (script cron quotidien) :
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec fintrack-postgres pg_dump -U fintrack fintrack > /backups/fintrack_$DATE.sql
gzip /backups/fintrack_$DATE.sql
# Supprime les backups de plus de 30 jours
find /backups -name "fintrack_*.sql.gz" -mtime +30 -delete
```

2. Backup Redis :
```bash
docker exec fintrack-redis redis-cli BGSAVE
# Copie le dump.rdb vers /backups/
```

3. Upload vers S3 (AWS CLI) :
```bash
aws s3 sync /backups s3://fintrack-backups/production/ --delete
```

4. Procedure de recovery :
—— Stopper les services
—— Restaurer PostgreSQL : psql < backup.sql
—— Restaurer Redis : copier dump.rdb
—— Redemarrer les services
—— Verifier /api/health

5. Multi-region (optionnel) :
—— Replica PostgreSQL read-only dans une autre region
—— DNS failover avec Cloudflare
—— Objectif RPO : 1 heure, RTO : 30 minutes

Cree le fichier scripts/backup.sh executable.
```

---

## INDEX DES PROMPTS BACKEND

| Phase | Prompt | Description | Fichiers crees |
|-------|--------|-------------|----------------|
| **1.1** | Architecture | Structure backend complete | ~30 fichiers |
| **1.2** | Schema Prisma | Base de donnees PostgreSQL | schema.prisma, seed.ts |
| **1.3** | Configuration | Env, DB, Redis, Docker | env.ts, database.ts, docker-compose.yml |
| **2.1** | Auth Controller | Register, login, logout, refresh | auth.controller.ts |
| **2.2** | Middlewares | JWT, RBAC, rate-limit, errors | 5 middlewares |
| **2.3** | OAuth | Google, Apple, Microsoft | oauth.controller.ts |
| **3.1** | User API | CRUD profil, sessions, preferences | user.controller.ts |
| **3.2** | Transaction API | CRUD + export CSV + pagination | transaction.controller.ts |
| **3.3** | Budget API | CRUD + progress + Category API | budget.controller.ts, category.controller.ts |
| **3.4** | Debt & Goal APIs | CRUD + payments + contributions | debt.controller.ts, goal.controller.ts |
| **3.5** | Subscription API | Upgrade/downgrade/cancel + Analytics | subscription.controller.ts, analytics.controller.ts |
| **3.6** | Invoice API | Factures PDF + Payment methods | payment.controller.ts |
| **4.1** | Stripe | Paiements cartes + webhooks | stripe.service.ts |
| **4.2** | Crypto | Coinbase Commerce BTC/ETH | crypto.service.ts |
| **4.3** | Mobile Money | MTN MOMO + Orange Money | mobile-money.service.ts |
| **5.1** | WebSocket | Notifications temps reel | websocket.ts |
| **6.1** | Emails | 10 templates + queue | email.service.ts |
| **7.1** | Uploads | Avatars + recus | upload.service.ts |
| **8.1** | API Client | Axios + interceptors | api.ts |
| **8.2** | Contextes v2 | Connexion au vrai backend | AuthContext.tsx, SubscriptionContext.tsx |
| **8.3** | Pages v2 | Donnees backend + chargement | Toutes les pages |
| **9.1** | Docker | Multi-stage + CI/CD GitHub Actions | Dockerfiles, docker-compose, ci-cd.yml |
| **9.2** | SSL | Traefik/Certbot + HTTPS | docker-compose avec labels |
| **10.1** | Monitoring | Logs, metriques, Sentry | health endpoint, prometheus |
| **10.2** | Backup | PostgreSQL + Redis + S3 | scripts/backup.sh |

---

## TOTALS

| Metrique | Valeur |
|----------|--------|
| **Prompts backend** | **24** |
| **Phases** | **10** |
| **Fichiers backend crees** | **~40+** |
| **Services integres** | PostgreSQL, Redis, Stripe, Coinbase, MTN, Orange, Resend, Cloudinary, S3 |
| **DevOps** | Docker, CI/CD, SSL, Monitoring, Backup |
| **Securite** | JWT, bcrypt, Helmet, CORS, Rate Limiting, RBAC, XSS/CSRF |
