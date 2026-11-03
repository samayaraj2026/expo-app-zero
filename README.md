# ZeroQue Mobile Application

### Autonomous Enterprise Procurement, Provisioning & Supply Governance Client

ZeroQue Mobile is an enterprise-grade React Native & Expo application providing mobile-first workflows for multi-tenant workspace procurement, requisition tracking, catalogue browsing, and AI-governed approvals.

---

## Architecture Overview

The codebase is organized according to **Domain-Driven Feature Architecture** (`src/features/`) and **Atomic UI Primitives** (`src/components/ui/`):

```text
src/
├── app/                  # Expo Router file-based route tree & screens
│   ├── _layout.tsx       # Root layout, Redux Store Provider, Gestures
│   ├── (tabs)/           # Floating bottom tab bar screens
│   │   ├── _layout.tsx   # Glassmorphic floating tab bar
│   │   ├── home.tsx      # Active requisitions dashboard & status progress
│   │   ├── catalogue.tsx # Multi-supplier catalogue & categories
│   │   ├── category.tsx  # Filtered category view
│   │   ├── cart.tsx      # Requisition basket & line-item checkout
│   │   └── profile.tsx   # User profile, cost centres, spending limits
│   ├── productdetails.tsx# Product details & variant selector
│   ├── supplierdetails.tsx# Supplier profile, reviews & catalogue
│   └── requestscreen.tsx # Requisition status onboarding screen
│
├── features/             # Bounded Feature Domains (Domain-Driven Design)
│   ├── auth/             # SignInBottomSheet, authentication bottom sheet
│   ├── catalogue/        # ProductCard, ProductRowCard, ProductSection, VariantCard
│   ├── suppliers/        # SupplierHeader, SupplierNavBar, SupplierProductCard, etc.
│   ├── cart/             # Cart actions, state selectors, basket mutations
│   └── requisitions/     # Requisition lifecycle, progress stages, status feeds
│
├── components/           # Atomic UI Primitives & Design System
│   └── ui/               # AppButton, BackButton, FloatingTextInput, PasswordTextInput, SearchCartPill, SearchTextInput
│
├── store/                # Redux Toolkit Global State
│   ├── slices/           # cartSlice, requisitionSlice, userSlice
│   └── index.ts          # Root store, typed hooks (useAppDispatch, useAppSelector), selectors
│
├── themes/               # Semantic Design Tokens
│   └── colors.ts         # Centralized palette (100% token compliance, 0 raw hex)
│
└── utils/                # Utility helpers (haptics, formatting)
```

---

## Quality Invariants & Verification

- **TypeScript Strict Mode**: Zero compilation errors (`npx tsc --noEmit`)
- **Lint & Code Hygiene**: Zero ESLint errors or warnings (`npx expo lint`)
- **Strict Design Tokens**: 100% token compliance with `src/themes/colors.ts`, zero raw hex codes in code
- **Haptics Standard**: Contextual haptic feedback (`light` on positive user interactions, `success` on requisition submission, `error` strictly on validation failure)
- **Zero Commented-Out Code**: No dead or conversational narrative blocks

---

## Available Commands

```bash
# Typecheck
npx tsc --noEmit

# Lint
npx expo lint

# Start development server
npx expo start
```
