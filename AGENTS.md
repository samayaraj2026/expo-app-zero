# AGENTS.md — ZeroQue Enterprise AI Coding Rules & Invariants

> [!CAUTION]
> **CRITICAL & COMPULSORY MANDATE FOR ALL AI AGENTS & IDES (ANTIGRAVITY, GEMINI, CURSOR, COPILOT, CLAUDE, ETC.)**
>
> BEFORE taking ANY action, answering questions, proposing changes, or writing ANY code: You MUST read [zeroque_chat_memory.md](file:///d:/ZQApp/zeroque_chat_memory.md) in its entirety. This requirement is strictly non-negotiable.

---

## 🔒 Permanent Mobile Workspace Invariants

### 1. Mandatory Memory Reading
Every AI agent, subagent, and IDE assistant must first load and inspect `zeroque_chat_memory.md` to understand current architecture, domain structures, state conventions, and active mobile standards.

### 2. Backend Read-Only Boundary
* `d:\projects\consumables\ZeroQueBackend` is strictly **READ-ONLY**.
* NEVER create, edit, move, or delete any file in `ZeroQueBackend`.
* The mobile application must always adapt to the backend API contracts, never vice versa.

### 3. No Unprompted Git Commits or Pushes
* NEVER execute `git commit` or `git push` unless explicitly asked by the user in that prompt.
* All changes must remain cleanly staged or unstaged in the local working directory.

### 4. Direct Parent Package Imports Only (Zero 1-Line Re-export Shims)
Import directly from the parent feature package or design-system root:
* `@/features/auth`
* `@/features/catalogue`
* `@/features/suppliers`
* `@/features/cart`
* `@/features/requisitions`
* `@/components/ui`
* `@/assets`
* `@/store`
* `@/themes/colors`
* `@/types`
* `@/hooks`
* `@/utils`

**Rules:**
* NEVER create 1-line proxy or re-export shim files (e.g. `src/components/modals/`, `src/components/supplier/`, `src/hooks/useDepartments.ts`, etc.).
* Sibling modules inside the same feature use relative imports (`./Component`, `../types`, `../hooks`).

### 5. Expo Router Navigation & Screen Placement
* Use **Expo Router v4** for all navigation.
* Routes live strictly in `src/app/` — every file in `src/app/` is a route screen (e.g., `src/app/(tabs)/`, `src/app/productdetails.tsx`, `src/app/supplierdetails.tsx`, `src/app/requestscreen.tsx`, `src/app/cataloguescreen.tsx`).
* `_layout.tsx` files define root and nested navigators.
* Keep non-route code (components, hooks, state slices, utilities) strictly outside `src/app/`.
* NEVER export route screen components from feature barrels (`index.ts`).
* Import navigation primitives (`Link`, `router`, `useLocalSearchParams`, `useFocusEffect`) from `expo-router`.

### 6. Expo SDK & Dependency Invariants
Expo ships breaking changes with every SDK release. APIs you remember may be renamed, moved, or removed:
1. Always check the version of the `expo` package in `package.json`.
2. ALWAYS install packages with `npx expo install <package>` (or `bunx expo install <package>` if `bun.lock` exists). Never use bare `npm add` or `yarn add` — Expo CLI resolves SDK-compatible versions.
3. Consult `https://docs.expo.dev/llms.txt` and matching versioned docs rather than answering from outdated memory.
4. **Continuous Native Generation (CNG)**: If `ios/` and `android/` directories do not exist, they are generated. Never create or edit them manually — configure native behavior in `app.json` and config plugins.
5. Development builds: Libraries with native dependencies require development builds (`npx expo run:android` / `npx expo run:ios` or EAS Build).

### 7. Code Quality, TypeScript & Linter Gate
Before declaring any task complete, run and pass both checks with **0 errors and 0 warnings**:
```bash
npx tsc --noEmit   # typecheck: 0 errors
npx expo lint      # linter: 0 warnings, 0 errors
```
* Use `@ts-expect-error <description>` instead of `@ts-ignore` if a typed exception is strictly required.
* Run `npx expo-doctor` whenever diagnosing dependency or configuration issues.
* Fix incompatible packages using `npx expo install --fix`.

### 8. Documentation Updates
Upon completing ANY task, refactor, or optimization, the AI agent MUST update:
* `zeroque_chat_memory.md`
* `README.md`
* `REFACTORING_PROGRESS.md`
Record completed steps, architectural decisions, and current scorecard status.

### 9. Performance & Mobile Audit Prompt Trigger
When the user asks to "run my performance prompt now" or "run my audit prompt now", load and execute the full audit from [React_Native_Enterprise_Audit_Prompt.md](file:///d:/ZQApp/React_Native_Enterprise_Audit_Prompt.md) across all mobile files.

### 10. Release Quality & Mobile Refactoring Invariants
All current and upcoming versions must strictly uphold these engineering standards:
* **Domain-Driven Feature Isolation**: New domain logic must live inside `src/features/<domain>/` with dedicated components, types, and a clean public `index.ts`.
* **Zero Re-export Shims**: Consumers must import from direct parent packages (`@/features/...`, `@/components/ui`, etc.).
* **Reusable UI Primitives**: Shared UI primitives live strictly under `src/components/ui/` (`AppButton`, `BackButton`, `FloatingTextInput`, `PasswordTextInput`, `SearchCartPill`, `SearchTextInput`, `SetupEmptyState`).
* **React 19 State Purity & Lifecycle**:
  - No side-effects inside render bodies or state updaters.
  - Zero cascading `setState` calls inside effects (`react-hooks/set-state-in-effect`).
  - Use key-based component resets (`key={`${categoryId}-${searchQuery}`}`) or render-time calculations instead of `useEffect` state syncing.
* **Re-render Prevention & List Performance**:
  - Wrap list items and cards in `React.memo` (`ProductCard`, `ProductRowCard`, `SupplierProductCard`, `VariantCard`, `ProductSection`).
  - Memoize all callbacks passed to list items or children with `useCallback`.
  - Use functional state updaters (`setQuantity(prev => ...)`) in card counters to prevent callback invalidation.
  - Hoist static styles into file-level `StyleSheet.create` constants.
  - Use `FlatList` windowing properties (`initialNumToRender`, `maxToRenderPerBatch`, `windowSize`, `removeClippedSubviews`).
* **Native Device UX & Haptics**:
  - Use standardized contextual haptics via `@/utils/haptics`:
    - `haptics.light()` on selections, steppers, and add-to-cart.
    - `haptics.selection()` on tab or filter switches.
    - `haptics.success()` on requisition submissions.
    - `haptics.error()` strictly reserved for validation errors.
  - Respect device safe areas with `useSafeAreaInsets()` from `react-native-safe-area-context`.
* **Security & Auth Protection**:
  - Authenticated flows guarded by token presence and biometric / OTP verification.
  - Never trust unvalidated client storage.

### 11. Zero Commented-Out Code, Conversational Comments & Strict Design Tokens
* **No commented-out code blocks**: Never leave code commented out with block comment markers (`/* ... */`, `/** ... */`) or store inactive implementation chunks. All code must be active and tested.
* **No conversational inline pseudo-comments**: Never write explanatory narrative comments (e.g. `// Click the button`, `// Reset quantity here`). Code must be self-documenting through clean naming, TypeScript types, and modular functions.
* **Zero ad-hoc raw color codes**: Never define or hardcode raw hex colors (`#FFFFFF`, `#000000`, `#E0E0E0`, `#9F0712`, etc.) in components. All colors MUST strictly consume semantic tokens from `src/themes/colors.ts` (`colors.primary`, `colors.black`, `colors.white`, `colors.surface`, etc.) or Tailwind theme utility classes via NativeWind.

### 12. No Unprompted New Test Cases or Test Files
* NEVER write, generate, or add any new test cases, test suites, or test files unless the user EXPLICITLY instructs you to add them in that prompt. Maintain and verify existing tests, but never introduce new test cases unprompted.

### 13. Strict Component & Identifier Naming Conventions (PascalCase & camelCase)
* **PascalCase for Components**: All React Native components (file names, component declarations, and HOCs) MUST strictly be named in `PascalCase` (`[A-Z][a-zA-Z0-9]*`).
* **camelCase for Inner Functions & Variables**: All inner functions, helper functions, hooks, and local variables MUST strictly be named in `camelCase` (`[a-z][a-zA-Z0-9]*`).
* **Meaningful Identifiers**: Never use single-letter or cryptic abbreviations (`s`, `q`, `p`, `cat`, `val`, `i`). Use self-documenting variable names (`section`, `trimmedQuery`, `product`, `category`, `nextQuantity`, `itemIndex`, `animIndex`).
* **No Non-Standard Identifiers**: Never use leading underscores (`_handleSkip`, `_err`). Dynamic component references inside components remain `PascalCase` (e.g. `const IconComponent = ...`); module constants remain `UPPER_SNAKE_CASE`.

### 14. Neutral Em-Dash Placeholder Invariant (`|| '—'`) & Zero Synthetic Entities
* **No Synthetic Mock Entities**: NEVER inject hardcoded synthetic mock strings (e.g. `'Primary Tenant'`, `'User'`, `'N/A'`, `'Free Trial'`, `'Trial'`) as fallback or display values.
* **Standardized Neutral Em-Dash**: Missing, unassigned, or null display fields MUST strictly use the standardized enterprise neutral em-dash placeholder: `|| '—'`.
