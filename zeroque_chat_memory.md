# ZeroQue Mobile Application Memory & Architecture Decisions

## Project Profile
- **Application**: ZeroQue Mobile Application (React Native / Expo SDK 52)
- **Frameworks**: Expo Router v4, React 19, Redux Toolkit, NativeWind v4, react-native-reanimated v3
- **Primary Scope**: Enterprise Procurement, Provisioning & Supply Governance Mobile Client

---

## Architecture Decisions & Invariants

### 1. Domain-Driven Feature Architecture (`src/features/`)
The codebase strictly enforces domain isolation:
- `src/features/auth/` &mdash; `SignInBottomSheet`, OTP verification, authentication modal flows.
- `src/features/catalogue/` &mdash; `ProductCard`, `ProductRowCard`, `ProductSection`, `VariantCard`.
- `src/features/suppliers/` &mdash; `SupplierHeader`, `SupplierNavBar`, `SupplierProductCard`, `SupplierProductFilters`, `SupplierReviewsCard`, `SupplierStats`, `SupplierAboutSection`.
- `src/features/cart/` &mdash; Basket management, line items, price calculation, cart selectors & actions.
- `src/features/requisitions/` &mdash; Active requisitions feed, status stages, progress tracking, submission workflows.
- `src/components/ui/` &mdash; Atomic design system primitives only (`AppButton`, `BackButton`, `FloatingTextInput`, `PasswordTextInput`, `SearchCartPill`, `SearchTextInput`, `SetupEmptyState`).

### 2. State Management & Data Flow
- Redux Toolkit store (`src/store/index.ts`) orchestrates app-wide state:
  - `cartSlice`: Basket items, quantity steppers, VAT calculations, item removals, badge counts.
  - `requisitionSlice`: Requisition lifecycle (`submitted`, `awaiting_approval`, `approved`, `delivered`, `rejected`), multi-stage progress bars, live submission.
  - `userSlice`: Enterprise requester profile, cost centres, spending limits, SSO governance.
- Live tab bar badge & `SearchCartPill` are reactively connected to `selectCartTotalCount`.

### 3. Naming Conventions & Code Style
- **Components**: Strict `PascalCase` for all components (`CartScreen`, `CatalogueScreen`, `CategoryScreen`, `HomeScreen`, `ProfileScreen`, `TabLayout`, `CatalogueCard`, `CatalogueColumn`, `CatalogueIntroScreen`, `WelcomeScreen`, `ProductDetailsScreen`, `RequestStatusScreen`, `SupplierDetailsScreen`, `RootLayout`, `StandardButton`, `IconButton`, `StepperButton`, `AppButton`, `SetupEmptyState`, `EmptyStateBackdropBlob`, `ProductCard`, `ProductRowCard`, `ProductSection`, `VariantCard`, `SupplierOverview`, `SupplierProductFilters`, `SupplierProductCard`).
- **Functions & Methods**: Strict `camelCase` for all helper functions and event handlers (`handleAddToCart`, `handleQuantityChange`, `handleCardPress`, `renderTabIcon`, `getInsertedCharsCount`, etc.).
- **Variables**: Descriptive, self-documenting names. All cryptic single-letter identifiers (`s`, `q`, `p`, `cat`, `val`, `i`) have been eliminated across the entire codebase.

### 4. Performance & Re-render Invariants
- **Component Memoization**: All list items (`ProductCard`, `ProductRowCard`, `VariantCard`, `SupplierProductCard`), sections (`ProductSection`, `SupplierOverview`), and UI buttons (`AppButton`, `StandardButton`, `IconButton`, `StepperButton`, `BackButton`, `SearchCartPill`) are wrapped with `React.memo`.
- **Callback Stability**: All handlers passed as props or list items are wrapped with `useCallback`.
- **Functional State Updates**: State updates in card counters use functional updaters (`setQuantity(prev => ...)`) to avoid callback invalidation when quantity increments/decrements.
- **Key-Based State Reset**: Clean key-based remounting (`key={`${categoryId}-${searchQuery}`}`) prevents synchronous `setState` in effects, eliminating cascading renders.
- **Static Style Hoisting**: Static layout and geometry objects are extracted to `StyleSheet.create` rather than being declared inline within render bodies.

### 5. Design Tokens & Strict Hygiene
- **100% Token Compliance**: All raw hex colors across the entire codebase migrated to semantic tokens in `src/themes/colors.ts`.
- **Zero Raw Hex**: No `#...` hex strings in application logic or components.
- **Haptic Feedback**: Standardized UX haptics &mdash; `light()` on selections/add-to-cart, `selection()` on tab/modal switches, `success()` on requisition submissions, `error()` strictly reserved for validation errors.
- **Dead Code Elimination**: Removed dead/commented-out blocks and unused imports.
- **Zero Commented-Out Code & Clean Lint**: 0 TypeScript errors (`tsc --noEmit`), 0 ESLint warnings (`expo lint`).

---

## Log of Key Deliverables

| Area | Status | Deliverables |
|---|---|---|
| Domain Architecture | COMPLETED | Restructured `src/features/` with bounded contexts (`auth`, `catalogue`, `suppliers`, `cart`, `requisitions`). Cleaned redundant duplicates. |
| Missing Tabs | COMPLETED | Cleaned unbuilt mock stubs; mounted standard `SetupEmptyState` with `EmptyStateBackdropBlob` on `home.tsx`, `cart.tsx`, and `profile.tsx`. |
| Redux Integration | COMPLETED | Created `cartSlice`, `requisitionSlice`, `userSlice` with typed selectors & hooks. Live store provider mounted at root. |
| Design Tokens | COMPLETED | Standardized `colors.ts`, eliminated all raw hex strings across all files, verified zero remaining hex instances. |
| UI Primitives | COMPLETED | Created React Native `SetupEmptyState`, `EmptyStateBackdropBlob`, and `EmptyStateBackdropGraphic` with `react-native-svg` and `react-native-reanimated`. |
| Casing & Naming Audit | COMPLETED | All components verified `PascalCase`; all functions verified `camelCase`; all cryptic single-letter variables eliminated. |
| Re-render Optimization | COMPLETED | Memoized components (`React.memo`), stabilized callbacks (`useCallback`), functional state updaters, extracted static styles, removed render-time cascading effects. |
| Code Hygiene | COMPLETED | 0 TypeScript errors (`npx tsc --noEmit`), 0 ESLint warnings (`npx expo lint`). |
| AGENTS.md Mobile Rules | COMPLETED | Adapted all web-app rules to mobile-first invariants (Expo Router, CNG, SDK rules, NativeWind, haptics, safe areas) preserving all core protocols. |
| AGENTS.md Audit Execution | COMPLETED | Executed comprehensive verification across all 14 mobile invariants. Eliminated trailing non-standard parameter identifiers in supplier constants and showcase buttons; 0 tsc errors, 0 lint warnings. |
| Upstream Pull & Conflict Resolution | COMPLETED | Pulled latest commit `7a507ec` from `origin/develop`. Integrated continuous sign-in haptic pulse into `@/features/auth/SignInBottomSheet`, resolved A/B image alternating conflict in `cataloguescreen.tsx`, cleaned redundant exports in `components/ui/index.ts`. 0 tsc errors, 0 lint warnings. |
