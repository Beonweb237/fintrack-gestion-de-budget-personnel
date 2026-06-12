# Guide d'Installation et de Deploiement — FinTrack SaaS

## Table des matieres

1. [Prerequis systeme](#1-prerequis-systeme)
2. [Configuration du projet](#2-configuration-du-projet)
3. [Flux de travail en developpement](#3-flux-de-travail-en-developpement)
4. [Variables d'environnement](#4-variables-denvironnement)
5. [Configuration de Tailwind CSS](#5-configuration-de-tailwind-css)
6. [Ajout de composants shadcn/ui](#6-ajout-de-composants-shadcnui)
7. [Construction pour la production](#7-construction-pour-la-production)
8. [Options de deploiement](#8-options-de-deploiement)
9. [Domaine personnalise et SSL](#9-domaine-personnalise-et-ssl)
10. [Surveillance et maintenance](#10-surveillance-et-maintenance)
11. [Resolution des problemes](#11-resolution-des-problemes)

---

## 1. Prerequis systeme

Avant d'installer le projet FinTrack SaaS, assurez-vous que votre environnement de developpement respecte les exigences minimales suivantes. Chaque prerequis est essentiel pour garantir un fonctionnement optimal de l'application.

### Node.js 20 ou superieur

FinTrack utilise React 19 et Vite 7, qui necessitent Node.js 20 LTS minimum. Pour verifier votre version actuelle :

```bash
node -v
```

La sortie attendue doit indiquer `v20.x.x` ou superieur (par exemple `v22.15.0`). Si Node.js n'est pas installe ou si votre version est anterieure, telechargez la derniere version LTS depuis [nodejs.org](https://nodejs.org/).

**Installation recommandee avec nvm (Node Version Manager) :**

```bash
# Installer nvm (Linux/macOS)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# Installer Node.js 20 LTS
nvm install 20
nvm use 20
nvm alias default 20

# Verifier
node -v
# v20.19.0
```

Sous Windows, utilisez [nvm-windows](https://github.com/coreybutler/nvm-windows/releases) ou telechargez directement l'installateur depuis le site officiel de Node.js.

### Gestionnaire de paquets

Le projet est configure pour fonctionner avec **npm** (inclus avec Node.js), mais vous pouvez egalement utiliser **Yarn** ou **pnpm** selon votre preference.

| Gestionnaire | Version minimale | Commande de verification |
|-------------|------------------|------------------------|
| npm | 10.x | `npm -v` |
| Yarn | 1.22.x | `yarn -v` |
| pnpm | 8.x | `pnpm -v` |

**Pour installer pnpm (recommande pour ses performances) :**

```bash
npm install -g pnpm@latest
pnpm -v
```

### Git 2.40 ou superieur

```bash
git --version
# git version 2.47.0
```

Si Git n'est pas installe :

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install git

# macOS
brew install git

# Windows
# Telechargez l'installateur depuis https://git-scm.com/download/win
```

### Editeur de code recommande — VS Code

Visual Studio Code est l'editeur recommande pour le projet FinTrack. Telechargez-le depuis [code.visualstudio.com](https://code.visualstudio.com/).

**Extensions obligatoires :**

1. **ESLint** (`dbaeumer.vscode-eslint`) — Analyse statique du code TypeScript/JavaScript
2. **Prettier** (`esbenp.prettier-vscode`) — Formatage automatique du code
3. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`) — Autocompletion des classes Tailwind

**Extensions recommandees :**

4. **Path Intellisense** (`christian-kohler.path-intellisense`) — Autocompletion des chemins d'importation
5. **Auto Rename Tag** (`formulahendry.auto-rename-tag`) — Renommage automatique des balises JSX
6. **GitLens** (`eamodio.gitlens`) — Enrichissement de l'interface Git
7. **Error Lens** (`usernamehw.errorlens`) — Affichage des erreurs en ligne

Pour installer toutes les extensions en une seule commande :

```bash
code --install-extension dbaeumer.vscode-eslint esbenp.prettier-vscode bradlc.vscode-tailwindcss
```

### Configuration VS Code pour le projet

Creez le fichier `.vscode/settings.json` a la racine du projet :

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "'([^']*)'"],
    ["cx\\(([^)]*)\\)", "'([^']*)'"]
  ],
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

---

## 2. Configuration du projet

Cette section decrit en detail chaque etape pour cloner, installer et executer le projet FinTrack SaaS en local.

### Etape 1 — Cloner le depot

```bash
git clone https://github.com/votre-organisation/fintrack.git
cd fintrack
```

### Etape 2 — Installer les dependances

**Avec npm :**

```bash
npm install
```

**Avec pnpm (recommande) :**

```bash
pnpm install
```

**Avec yarn :**

```bash
yarn install
```

L'installation telecharge environ 250 paquets et cree le dossier `node_modules/`. La duree estimee est de 30 a 90 secondes selon votre connexion.

**Dependances principales installees :**

| Categorie | Paquets |
|-----------|---------|
| Framework | `react`, `react-dom`, `react-router-dom` |
| Styling | `tailwindcss`, `tailwind-merge`, `clsx`, `class-variance-authority` |
| Composants UI | 40+ paquets `@radix-ui/*` via shadcn/ui |
| Animations | `framer-motion` |
| Graphiques | `recharts` |
| Formulaires | `react-hook-form`, `zod` |
| Icônes | `lucide-react` |
| Notifications | `sonner` |
| Dates | `date-fns` |
| Dev | `vite`, `typescript`, `@vitejs/plugin-react`, `eslint` |

### Etape 3 — Lancer le serveur de developpement

```bash
npm run dev
```

Sortie attendue :

```
  VITE v7.2.4  ready in 312 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.1.42:3000/
  ➜  press h + enter to show help
```

Ouvrez votre navigateur a l'adresse `http://localhost:3000/`. Vous devriez voir l'application FinTrack s'afficher avec le tableau de bord principal.

### Etape 4 — Structure initiale du projet

Apres l'installation, votre arborescence doit ressembler a ceci :

```
fintrack/
├── .vscode/              # Configuration VS Code
├── node_modules/         # Dependances (genere)
├── public/               # Assets statiques
├── src/
│   ├── components/       # Composants React
│   │   └── ui/           # Composants shadcn/ui
│   ├── pages/            # Pages de l'application
│   ├── hooks/            # Hooks personnalises
│   ├── contexts/         # Contextes React
│   ├── lib/              # Utilitaires
│   ├── data/             # Donnees mock/fixtures
│   ├── types/            # Definitions TypeScript
│   ├── i18n/             # Fichiers de traduction
│   ├── App.tsx           # Point d'entree de l'application
│   └── main.tsx          # Rendu React
├── index.html            # Page HTML racine
├── vite.config.ts        # Configuration Vite
├── tailwind.config.js    # Configuration Tailwind
├── tsconfig.json         # Configuration TypeScript
├── tsconfig.app.json     # Configuration TS pour l'app
├── postcss.config.js     # Configuration PostCSS
├── components.json       # Configuration shadcn/ui
├── package.json          # Dependances et scripts
└── eslint.config.js      # Configuration ESLint
```

---

## 3. Flux de travail en developpement

Le projet fournit plusieurs scripts npm pour couvrir l'integralite du cycle de developpement.

### Scripts disponibles

#### `npm run dev` — Serveur de developpement

```bash
npm run dev
```

Lance Vite en mode developpement avec Hot Module Replacement (HMR). Toute modification du code source est refléte instantanement dans le navigateur sans perte d'etat. Le serveur ecoute sur le port 3000 par defaut.

**Options de ligne de commande Vite utiles :**

```bash
# Forcer un port specifique
npx vite --port 8080

# Exposer sur le reseau local
npx vite --host

# Mode strict pour TypeScript
npx vite --mode development
```

#### `npm run build` — Construction production

```bash
npm run build
```

Execute deux etapes :
1. `tsc -b` — Compilation TypeScript avec verification des types (strict mode)
2. `vite build` — Bundling optimise pour la production

La sortie est generee dans le dossier `dist/` :

```
dist/
├── index.html
├── assets/
│   ├── index-XXXXXXXX.css
│   ├── index-XXXXXXXX.js
│   └── (autres assets optimises)
```

#### `npm run preview` — Previsualisation production

```bash
npm run preview
```

Sert le contenu du dossier `dist/` sur un serveur local. Permet de tester le build de production avant deploiement.

#### `npm run lint` — Analyse statique

```bash
npm run lint
```

Execute ESLint sur l'ensemble du code source pour detecter les erreurs potentielles et les violations de style.

---

## 4. Variables d'environnement

Le projet utilise des variables d'environnement prefixees par `VITE_` pour etre exposees au code client. Creez un fichier `.env.local` a la racine du projet pour vos variables locales (ce fichier est ignore par Git).

### Fichier d'exemple `.env.example`

```bash
# ============================================
# Variables d'environnement — FinTrack SaaS
# Copier vers .env.local pour le developpement
# ============================================

# --- Paiements ---
VITE_STRIPE_PUBLIC_KEY=pk_test_votre_cle_publique_stripe
VITE_CRYPTO_PAYMENT_ADDRESS=0xvotreAdresseEthereum

# --- API ---
VITE_API_BASE_URL=https://api.fintrack.test/v1

# --- Mobile Money (Afrique) ---
VITE_MTN_MOMO_API_KEY=momo_test_xxxxxxxx
VITE_ORANGE_MONEY_API_KEY=om_test_xxxxxxxx

# --- Analytics ---
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

### Tableau complet des variables

| Variable | Type | Description | Exemple |
|----------|------|-------------|---------|
| `VITE_STRIPE_PUBLIC_KEY` | Optionnel | Cle publique Stripe pour les paiements par carte | `pk_test_51H...` |
| `VITE_API_BASE_URL` | Optionnel | URL de base de l'API backend | `https://api.fintrack.io/v1` |
| `VITE_CRYPTO_PAYMENT_ADDRESS` | Optionnel | Adresse de portefeuille crypto pour les paiements USDT | `0x742d...` |
| `VITE_MTN_MOMO_API_KEY` | Optionnel | Cle API MTN Mobile Money | `momo_test_abc123` |
| `VITE_ORANGE_MONEY_API_KEY` | Optionnel | Cle API Orange Money | `om_test_xyz789` |
| `VITE_GOOGLE_ANALYTICS_ID` | Optionnel | ID de mesure Google Analytics 4 | `G-ABC123DEF4` |
| `VITE_SENTRY_DSN` | Optionnel | DSN pour le suivi des erreurs Sentry | `https://xxx@sentry.io/xxx` |

### Utilisation dans le code

```typescript
const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://api-default.fintrack.io';
```

**Important :** Les variables sans prefixe `VITE_` ne sont PAS exposees au code client. Ne stockez jamais de cles privees ou de secrets dans les variables `VITE_`.

---

## 5. Configuration de Tailwind CSS

Tailwind CSS v3 est configure via le fichier `tailwind.config.js` situe a la racine du projet.

### Configuration actuelle

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Palette chaleureuse (mode clair)
        'warm-cream': '#F5F4F0',
        'warm-white': '#F9F9F9',
        'warm-black': '#272727',
        'warm-gray': '#E8E8E4',
        'accent-gold': '#D4A853',
        // Palette marine (mode sombre)
        'navy-950': '#0B1121',
        'navy-900': '#111827',
        'navy-800': '#1A2332',
        // Couleurs semantiques
        'success': '#16A34A',
        'danger': '#DC2626',
        'warning': '#D97706',
        'info': '#2563EB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### Etendre le theme

Pour ajouter une nouvelle couleur personnalisee :

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      'brand-primary': '#1E40AF',
      'brand-secondary': '#64748B',
    },
    spacing: {
      '128': '32rem',
      '144': '36rem',
    },
    screens: {
      '3xl': '1920px',
    },
  },
}
```

Utilisation dans les composants :

```tsx
<div className="bg-brand-primary text-warm-white p-128">
```

### Personnalisation des breakpoints

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
}
```

### Plugins supplementaires

Pour ajouter un plugin Tailwind, installez-le puis ajoutez-le au tableau `plugins` :

```bash
npm install @tailwindcss/typography @tailwindcss/forms
```

```javascript
// tailwind.config.js
plugins: [
  require("tailwindcss-animate"),
  require("@tailwindcss/typography"),
  require("@tailwindcss/forms"),
],
```

---

## 6. Ajout de composants shadcn/ui

Le projet integre shadcn/ui, une collection de composants reutilisables basee sur Radix UI et stylisee avec Tailwind CSS.

### Installation d'un composant

```bash
npx shadcn add <nom-du-composant>
```

Exemple pour installer le composant Dialog :

```bash
npx shadcn add dialog
```

Cette commande :
1. Telecharge le composant depuis le registre shadcn/ui
2. Cree le fichier dans `src/components/ui/dialog.tsx`
3. Installe automatiquement les dependances Radix UI necessaires (`@radix-ui/react-dialog`)
4. Met a jour `components.json` si necessaire

### Emplacement des composants

Tous les composants shadcn/ui sont installes dans :

```
src/components/ui/
├── accordion.tsx
├── alert.tsx
├── alert-dialog.tsx
├── avatar.tsx
├── badge.tsx
├── breadcrumb.tsx
├── button.tsx
├── calendar.tsx
├── card.tsx
├── carousel.tsx
├── chart.tsx
├── checkbox.tsx
├── collapsible.tsx
├── command.tsx
├── context-menu.tsx
├── dialog.tsx
├── drawer.tsx
├── dropdown-menu.tsx
├── form.tsx
├── hover-card.tsx
├── input.tsx
├── input-otp.tsx
├── label.tsx
├── menubar.tsx
├── navigation-menu.tsx
├── pagination.tsx
├── popover.tsx
├── progress.tsx
├── radio-group.tsx
├── resizable.tsx
├── scroll-area.tsx
├── select.tsx
├── separator.tsx
├── sheet.tsx
├── sidebar.tsx
├── skeleton.tsx
├── slider.tsx
├── sonner.tsx
├── switch.tsx
├── table.tsx
├── tabs.tsx
├── textarea.tsx
├── toast.tsx
├── toggle.tsx
├── toggle-group.tsx
└── tooltip.tsx
```

### Liste complete des composants disponibles

| Composant | Commande d'installation |
|-----------|------------------------|
| Accordion | `npx shadcn add accordion` |
| Alert | `npx shadcn add alert` |
| Alert Dialog | `npx shadcn add alert-dialog` |
| Avatar | `npx shadcn add avatar` |
| Badge | `npx shadcn add badge` |
| Breadcrumb | `npx shadcn add breadcrumb` |
| Button | `npx shadcn add button` |
| Calendar | `npx shadcn add calendar` |
| Card | `npx shadcn add card` |
| Carousel | `npx shadcn add carousel` |
| Chart | `npx shadcn add chart` |
| Checkbox | `npx shadcn add checkbox` |
| Collapsible | `npx shadcn add collapsible` |
| Command | `npx shadcn add command` |
| Context Menu | `npx shadcn add context-menu` |
| Dialog | `npx shadcn add dialog` |
| Drawer | `npx shadcn add drawer` |
| Dropdown Menu | `npx shadcn add dropdown-menu` |
| Form | `npx shadcn add form` |
| Hover Card | `npx shadcn add hover-card` |
| Input | `npx shadcn add input` |
| Input OTP | `npx shadcn add input-otp` |
| Label | `npx shadcn add label` |
| Menubar | `npx shadcn add menubar` |
| Navigation Menu | `npx shadcn add navigation-menu` |
| Pagination | `npx shadcn add pagination` |
| Popover | `npx shadcn add popover` |
| Progress | `npx shadcn add progress` |
| Radio Group | `npx shadcn add radio-group` |
| Resizable | `npx shadcn add resizable` |
| Scroll Area | `npx shadcn add scroll-area` |
| Select | `npx shadcn add select` |
| Separator | `npx shadcn add separator` |
| Sheet | `npx shadcn add sheet` |
| Sidebar | `npx shadcn add sidebar` |
| Skeleton | `npx shadcn add skeleton` |
| Slider | `npx shadcn add slider` |
| Sonner | `npx shadcn add sonner` |
| Switch | `npx shadcn add switch` |
| Table | `npx shadcn add table` |
| Tabs | `npx shadcn add tabs` |
| Textarea | `npx shadcn add textarea` |
| Toast | `npx shadcn add toast` |
| Toggle | `npx shadcn add toggle` |
| Toggle Group | `npx shadcn add toggle-group` |
| Tooltip | `npx shadcn add tooltip` |

### Personnalisation des styles

Chaque composant shadcn/ui utilise `class-variance-authority` (CVA) pour la gestion des variants. Vous pouvez modifier directement le fichier du composant pour adapter les styles.

Exemple — Personnaliser le composant Button :

```tsx
// src/components/ui/button.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-accent-gold text-white hover:bg-accent-gold/90",
        destructive: "bg-danger text-white hover:bg-danger/90",
        outline: "border border-warm-gray bg-transparent",
        secondary: "bg-navy-800 text-white",
        ghost: "hover:bg-warm-gray/50",
        link: "text-accent-gold underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

---

## 7. Construction pour la production

### Processus de build

```bash
npm run build
```

Le build se deroule en deux phases :

**Phase 1 — TypeScript (`tsc -b`) :**
- Verification stricte des types sur l'ensemble du projet
- Detection des erreurs de type potentielles
- Generation des fichiers de declaration `.d.ts`

**Phase 2 — Vite (`vite build`) :**
- Tree-shaking des modules non utilises
- Minification du JavaScript avec Terser
- Optimisation du CSS avec PostCSS
- Code-splitting automatique par route
- Hashing des assets pour le cache-busting
- Generation des sourcemaps (en mode production)

### Structure du dossier `dist/`

```
dist/
├── index.html                    # Point d'entree HTML
├── assets/
│   ├── index-D4f9xQwL.js        # Bundle JS principal
│   ├── index-B2n8pRtY.css       # Styles compiles
│   ├── Dashboard-XXxxXXxx.js    # Chunk lazy-loaded (code-splitting)
│   ├── vendor-XXxxXXxx.js       # Chunk vendor
│   └── (favicons, fonts, etc.)
```

### Analyse du bundle

Pour analyser la taille des dependances et identifier les modules les plus lourds :

```bash
# Installer le plugin d'analyse
npm install -D rollup-plugin-visualizer

# Modifier vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html',
    }),
  ],
});

# Reconstruire
npm run build
```

Un rapport HTML interactif s'ouvrira automatiquement dans votre navigateur, affichant un treemap de tous les modules du bundle.

### Optimisation des assets

Vite optimise automatiquement les elements suivants :

- **Images** : Conversion en WebP lorsque possible, compression
- **Fonts** : Subsetting des polices via `font-display: swap`
- **CSS** : Purge des classes Tailwind non utilisees
- **JS** : Minification et compression Gzip/Brotli

Pour des optimisations avancees, ajoutez dans `vite.config.ts` :

```typescript
export default defineConfig({
  build: {
    target: 'esnext',
    minify: 'terser',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', '@radix-ui/react-dialog'],
          charts: ['recharts'],
        },
      },
    },
  },
});
```

---

## 8. Options de deploiement

### Option A — Vercel (Recommande)

Vercel est la plateforme recommandee pour les applications React/Vite grace a son integration native et son deploiement instantane.

**Deploiement via CLI :**

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Deployer
vercel

# Configuration du projet
? Set up and deploy "~/projects/fintrack"? [Y/n] y
? Which scope do you want to deploy to? [votre-compte]
? Link to existing project? [n]
? What's your project name? [fintrack]
? In which directory is your code located? [./]
```

**Configuration via `vercel.json` :**

```json
{
  "version": 2,
  "name": "fintrack",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "routes": [
    {
      "src": "/[^.]+",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**Deploiement Git (recommande) :**

1. Poussez votre code sur GitHub
2. Connectez votre depot sur [vercel.com](https://vercel.com)
3. Vercel detecte automatiquement Vite et configure le build
4. Chaque `git push` declenche un deploiement

### Option B — Netlify

**Deploiement drag-and-drop :**

1. Executez `npm run build` en local
2. Allez sur [app.netlify.com](https://app.netlify.com)
3. Glissez-deposez le dossier `dist/` dans l'interface

**Deploiement via Git :**

1. Connectez votre depot GitHub/GitLab sur Netlify
2. Configurez les parametres de build :
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
3. Ajoutez le fichier `_redirects` dans `public/` :

```
/*    /index.html   200
```

**Configuration `netlify.toml` :**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### Option C — GitHub Pages

**Workflow GitHub Actions** — Creez `.github/workflows/deploy.yml` :

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        if: github.ref == 'refs/heads/main'
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

1. Activez GitHub Pages dans les parametres du depot (source : GitHub Actions)
2. Modifiez `vite.config.ts` pour le deploiement sur sous-chemin :

```typescript
export default defineConfig({
  base: '/fintrack/',
  // ...reste de la config
});
```

### Option D — AWS S3 + CloudFront

**Etape 1 — Creer le bucket S3 :**

```bash
aws s3 mb s3://fintrack-app-prod
aws s3 website s3://fintrack-app-prod --index-document index.html --error-document index.html
aws s3api put-bucket-policy --bucket fintrack-app-prod --policy file://s3-policy.json
```

**Fichier `s3-policy.json` :**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::fintrack-app-prod/*"
    }
  ]
}
```

**Etape 2 — Build et upload :**

```bash
npm run build
aws s3 sync dist/ s3://fintrack-app-prod --delete
```

**Etape 3 — Configurer CloudFront :**

```bash
# Creer une distribution CloudFront
aws cloudfront create-distribution \
  --origin-domain-name fintrack-app-prod.s3.amazonaws.com \
  --default-root-object index.html
```

**Script de deploiement complet `deploy-aws.sh` :**

```bash
#!/bin/bash
set -e

echo "=== Build de l'application ==="
npm run build

echo "=== Upload vers S3 ==="
aws s3 sync dist/ s3://$S3_BUCKET --delete

echo "=== Invalidation CloudFront ==="
aws cloudfront create-invalidation \
  --distribution-id $CLOUDFRONT_ID \
  --paths "/*"

echo "=== Deploiement termine ==="
```

```bash
chmod +x deploy-aws.sh
./deploy-aws.sh
```

### Option E — Firebase Hosting

```bash
# Installer Firebase CLI
npm install -g firebase-tools

# Se connecter
firebase login

# Initialiser
firebase init hosting

# Configuration choisie :
# ? What do you want to use as your public directory? dist
# ? Configure as a single-page app? Yes
# ? Set up automatic builds and deploys with GitHub? No

# Deploiement
firebase deploy

# Deploiement avec variables d'environnement
firebase deploy --only hosting
```

**Configuration `firebase.json` :**

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/assets/**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### Option F — Hebergement autonome avec Nginx

**Configuration Nginx `/etc/nginx/sites-available/fintrack` :**

```nginx
server {
    listen 80;
    server_name fintrack.votredomaine.com;
    root /var/www/fintrack/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 1000;

    # Cache des assets statiques
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # SPA routing — toutes les routes vers index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Securite
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

```bash
# Activer la configuration
sudo ln -s /etc/nginx/sites-available/fintrack /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Copier les fichiers
sudo mkdir -p /var/www/fintrack
sudo cp -r dist/* /var/www/fintrack/
```

---

## 9. Domaine personnalise et SSL

### Configuration DNS

Pour chaque plateforme, configurez un enregistrement CNAME dans votre registrar :

| Plateforme | Type | Nom | Valeur |
|-----------|------|-----|--------|
| Vercel | CNAME | `app` | `cname.vercel-dns.com` |
| Netlify | CNAME | `app` | `[votre-site].netlify.app` |
| GitHub Pages | CNAME | `@` | `[user].github.io` |
| AWS | A | `@` | `[CloudFront-Domain]` |
| Firebase | CNAME | `app` | `[votre-projet].web.app` |

### SSL avec Let's Encrypt (Nginx autonome)

```bash
# Installer Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Generer le certificat
sudo certbot --nginx -d fintrack.votredomaine.com

# Renouvellement automatique
sudo certbot renew --dry-run
```

### CDN pour les assets statiques

Toutes les plateformes cloud (Vercel, Netlify, AWS CloudFront) incluent un CDN global par defaut. Pour un deploiement autonome, envisagez Cloudflare :

1. Creez un compte sur [cloudflare.com](https://cloudflare.com)
2. Ajoutez votre domaine
3. Modifiez les nameservers chez votre registrar
4. Activez le proxy orange dans l'onglet DNS de Cloudflare

---

## 10. Surveillance et maintenance

### Google Analytics 4

Ajoutez l'ID de mesure dans vos variables d'environnement :

```bash
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

Creez le hook `useAnalytics.ts` :

```typescript
// src/hooks/useAnalytics.ts
const GA_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;

export const pageview = (path: string) => {
  if (!GA_ID || typeof window.gtag === 'undefined') return;
  window.gtag('config', GA_ID, { page_path: path });
};

export const event = (action: string, params?: Record<string, unknown>) => {
  if (!GA_ID || typeof window.gtag === 'undefined') return;
  window.gtag('event', action, params);
};
```

### Sentry — Suivi des erreurs

```bash
npm install @sentry/react
```

```typescript
// src/main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### Performance monitoring

Ajoutez le composant `WebVitals` pour suivre les Core Web Vitals :

```typescript
// src/components/WebVitals.tsx
import { useEffect } from 'react';

export function WebVitals() {
  useEffect(() => {
    if ('web-vitals' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log);
        getFID(console.log);
        getFCP(console.log);
        getLCP(console.log);
        getTTFB(console.log);
      });
    }
  }, []);
  return null;
}
```

### Mise a jour des dependances

```bash
# Verifier les mises a jour disponibles
npm outdated

# Mise a jour securisee (patch et mineures uniquement)
npm update

# Mise a jour interactive (recommandee)
npx npm-check-updates -i

# Mise a jour d'un paquet specifique
npm install react@latest react-dom@latest

# Apres mise a jour — toujours tester
npm run build
npm run lint
```

**Plan de maintenance mensuel :**

1. Executer `npm outdated`
2. Lire les changelogs des mises a jour majeures
3. Tester `npm run build` et `npm run lint`
4. Verifier visuellement les pages critiques
5. Deployer sur un environnement de staging

---

## 11. Resolution des problemes

### Erreur : `Cannot find module '@/components/ui/button'`

**Cause** : L'alias `@` n'est pas correctement configure.

**Solution** : Verifiez `vite.config.ts` :

```typescript
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

Et dans `tsconfig.json` :

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### Erreur : `tailwindcss not found` lors du build

**Solution** :

```bash
# Reinstaller les dependances
rm -rf node_modules package-lock.json
npm install

# Verifier PostCSS
npx postcss --version
```

### Erreur : `Port 3000 is already in use`

```bash
# Trouver le processus
lsof -i :3000

# Tuer le processus
kill -9 <PID>

# Ou utiliser un autre port
npx vite --port 3001
```

### Erreur : Les styles ne s'appliquent pas

Verifiez que les directives Tailwind sont presentes dans `src/index.css` :

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Variables de theme */
  }
}
```

### Erreur : `Module not found: './components/ui/dialog'`

Assurez-vous que le composant shadcn/ui a bien ete installe :

```bash
npx shadcn add dialog
```

### Probleme : Le routage ne fonctionne pas en production (erreur 404)

Toutes les routes SPA doivent rediriger vers `index.html`. Verifiez votre configuration de deploiement :

- **Vercel** : Ajoutez les routes dans `vercel.json`
- **Netlify** : Ajoutez `_redirects` dans `public/`
- **Nginx** : `try_files $uri $uri/ /index.html;`
- **Apache** : Activez `mod_rewrite` avec un `.htaccess`

### Probleme : Les images ne s'affichent pas apres le build

Utilisez le dossier `public/` pour les assets statiques ou importez-les depuis `src/` :

```tsx
// Depuis public/
<img src="/images/logo.png" alt="Logo" />

// Depuis src/ (optimise par Vite)
import logo from './assets/logo.png';
<img src={logo} alt="Logo" />
```

### Probleme : Hot Module Replacement (HMR) ne fonctionne pas

```bash
# Verifier que le WebSocket n'est pas bloque
# Desactiver temporairement les extensions de navigateur
# Forcer le rechargement complet : Ctrl+Shift+R
# Vider le cache : Ctrl+Shift+Suppr
```

### Commandes de diagnostic

```bash
# Informations systeme
node -v && npm -v && git --version

# Etat du projet
npm ls --depth=0

# Espace disque
df -h

# Test de build propre
rm -rf dist node_modules
npm install
npm run build
```

---

*Document version 1.0 — FinTrack SaaS*
*Derniere mise a jour : Juin 2025*
