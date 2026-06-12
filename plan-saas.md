# Plan - FinTrack SaaS Commercial International

## Vision Produit
FinTrack devient une solution SaaS B2C de gestion budget personnel, vendue à l'international avec : landing page marketing, forfaits d'abonnement (USD), parcours utilisateur e-commerce complet, et paiements multi-canaux (Stripe, Crypto, Mobile Money).

## Parcours Utilisateur
```
Landing Page → Signup/Login → Choix Forfait → Paiement → Onboarding → Dashboard
                    ↓                ↓              ↓              ↓
              Auth convivial    3 tiers (Free/   Stripe/      Walkthrough
                                Pro/Premium)    Crypto/       tutoriel
                                                MTN-Orange     ↓
                                                               App complète
                                                               ↓
                                            Gestion abonnement (upgrade/downgrade/cancel)
                                            Facturation & historique
                                            Expiration & renouvellement
```

## Pages à créer/modifier

### Nouvelles pages
| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Page marketing avec hero, features, testimonials, CTA |
| Pricing | `/pricing` | 3 forfaits : Free $0, Pro $9.99/mo, Premium $19.99/mo |
| Checkout | `/checkout/:plan` | Page de paiement Stripe + Crypto + Mobile Money |
| Subscription | `/subscription` | Gestion abonnement, factures, renouvellement |
| Billing | `/billing` | Historique de paiements, factures PDF |

### Pages à modifier
| Page | Changements |
|------|-------------|
| Auth | Design premium, signup/login fluide, état authentifié |
| App.tsx | Routes conditionnelles (public vs auth) |
| Navbar | Upgrade badge, état abonnement, langue/devise |
| Dashboard | Widgets onboarding, état forfait, limiteurs Free |
| Parametres | Onglet Abonnement + Facturation |

### Système SaaS
- Context React : auth state, subscription state, user tier
- Mock data : plans, subscriptions, invoices, payment methods
- Gated features : certaines fonctionnalités selon le tier
- Internationalisation : EN/FR/ES, USD/EUR/GBP

## Stack identique
React 19 + TypeScript + Vite + Tailwind v3 + shadcn/ui + Framer Motion + Recharts

## Phases
1. Design (Designer subagent)
2. Scaffold (Landing + Auth + Shared SaaS infra)
3. Parallel (Pricing + Checkout + Subscription + Billing)
4. Merge, Build, Deploy
