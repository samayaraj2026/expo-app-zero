**# Enterprise React Native Mobile App Code Review & Production Readiness Audit**



Act as a **\*\*world-class software engineering review board\*\*** with 20+ years of enterprise experience, consisting of:



\- Principal Software Architect

\- Distinguished Mobile App Architect

\- Senior React Native Engineer

\- Senior TypeScript Engineer

\- UI/UX Engineer

\- Performance Engineer

\- Security Engineer

\- API Design Expert

\- Scalability Consultant

\- Database Architect

\- DevOps & Cloud Architect

\- QA Automation Architect

\- Site Reliability Engineer (SRE)

\- Accessibility Specialist

\- Enterprise Software Consultant



Your task is to perform a **\*\*COMPLETE enterprise-grade audit\*\*** of my **\*\*React Native mobile application only\*\***.



Do **\*\*NOT\*\*** provide generic suggestions.



Think like you are performing the final production review for Microsoft, Google, Netflix, Amazon, Stripe, Uber, Airbnb, Apple, Meta, or Cloudflare before a global release.



Your review should be exhaustive, highly critical, and based on real-world enterprise engineering standards.



\---



**# IMPORTANT CONSTRAINTS**



Review **\*\*ONLY\*\*** the React Native application.



Do **\*\*NOT\*\*** review or modify any backend code.



Assume the backend APIs are fixed and immutable.



The mobile application must adapt to the backend, never the other way around.



Review every React Native source file recursively.



Do not skip any source files except build artifacts such as:



\- node_modules

\- dist

\- build

\- iOS Pods, Android build outputs, .gradle, and other generated native build artifacts (exclude only generated files, not source/configuration)

\- coverage

\- out

\- generated build outputs



Continue reviewing until **\*\*every mobile app file\*\*** has been analyzed.



Never stop after finding major issues.



\---



**# PROJECT GOAL**



Assume this application will go live tomorrow. Review whether the mobile client can behave reliably at these user scales; explicitly separate client-side limits from backend/infrastructure capacity:



\- 100 users

\- 1,000 users

\- 10,000 users

\- 100,000 concurrent users

\- 1,000,000 total users



with:



\- Zero downtime

\- High availability

\- Enterprise-grade maintainability

\- Excellent developer experience

\- Strong security

\- High performance

\- Production-ready architecture



\---



**# PHASE 1 — PROJECT ANALYSIS**



Understand the complete mobile app architecture.



Analyze:

\- React Native entry points and app bootstrap
\- Android and iOS native project configuration
\- Metro bundler configuration
\- Babel and TypeScript configuration
\- Hermes configuration and compatibility
\- New Architecture / Fabric / TurboModules compatibility where applicable
\- Folder structure

\- Feature organization

\- Component hierarchy

\- Navigation architecture (React Navigation or the library actually used)

\- Screen, navigator, and layout architecture

\- Page organization

\- Native design system and platform-specific UI patterns

\- Services

\- API layer

\- State management

\- Context

\- Redux

\- Zustand

\- React Query

\- TanStack Query

\- Hooks

\- Utilities

\- Assets

\- Constants

\- Types

\- Models

\- Configurations

\- Environment variables and build-time configuration (including secrets exposure)

\- Android Gradle, iOS Xcode/Pods, Metro, Babel, and build configuration

\- Dependency graph



Identify:



\- Bad architecture

\- Tight coupling

\- Duplicate logic

\- Dead code

\- Unused files

\- Unused dependencies

\- Circular dependencies

\- Large files

\- God components

\- Deep prop drilling

\- Missing abstractions

\- Poor folder organization

\- Poor naming

\- Code smells

\- Technical debt



\---



**# PHASE 2 — API CONTRACT REVIEW**



Review every mobile API integration.



Verify:



\- Request payloads

\- Response mapping

\- DTO compatibility

\- HTTP methods

\- Authentication headers

\- Authorization headers

\- Query parameters

\- Path parameters

\- Multipart uploads

\- File downloads

\- Pagination

\- Filtering

\- Sorting

\- Retry logic

\- Timeout handling

\- Request cancellation

\- Optimistic updates

\- Cache invalidation

\- Error handling

\- Response parsing

\- Environment-based API configuration

\- Duplicate requests

\- Missing integrations

\- Hardcoded endpoints

\- Mock APIs



Identify:



\- Missing API integrations

\- Wrong payload mapping

\- Missing validations

\- Missing loading states

\- Missing error handling

\- Race conditions

\- Redundant requests

\- API contract mismatches

\- Inefficient data fetching



\---



**# PHASE 3 — ARCHITECTURE REVIEW**



Review whether the application follows:



\- SOLID

\- DRY

\- KISS

\- Separation of Concerns

\- Feature-based Architecture

\- Clean Architecture

\- Layered Architecture

\- Modular Design

\- Reusable Components

\- Reusable Hooks

\- Reusable Services

\- Dependency Injection principles

\- Composition over inheritance



Identify:



\- Over-engineering

\- Under-engineering

\- Missing abstractions

\- Poor module boundaries

\- Shared logic duplication

\- Monolithic components

\- Poor scalability



\---



**# PHASE 4 — PERFORMANCE REVIEW**

Also review React Native-specific performance:

- JS thread and UI thread contention
- dropped frames, FPS, and jank
- FlatList / SectionList virtualization and keyExtractor usage
- large lists, pagination, windowing, and getItemLayout where appropriate
- image decoding, caching, resizing, and memory pressure
- startup time, splash-screen duration, and expensive app initialization
- Hermes performance and heap behavior
- Reanimated/worklet usage and animation performance
- unnecessary bridge/native-module communication where applicable
- app state, timers, subscriptions, and cleanup on unmount/backgrounding
- battery usage and background work
- Android low-memory devices and iOS memory-pressure behavior



Assume a large user population and bursts of concurrent activity. Evaluate client-side behavior and request patterns; do not claim that a mobile app alone determines server concurrency capacity.



Review:



Mobile App



\- unnecessary renders

\- unnecessary state updates

\- re-render loops

\- expensive computations

\- missing memoization

\- incorrect useMemo

\- incorrect useCallback

\- incorrect React.memo

\- memory leaks

\- event listener leaks

\- stale closures

\- unnecessary useEffect

\- dependency issues

\- large JavaScript bundle and native binary size

\- bundle duplication

\- dead-code elimination and Metro bundler optimization

\- lazy loading and supported code-splitting strategies

\- lazy loading

\- Suspense usage where supported by the current React Native stack

\- dynamic imports and lazy loading where supported

\- large assets

\- font loading

\- image optimization

\- app startup and initial render issues

\- startup-blocking work and expensive initialization



Network



\- duplicate requests

\- waterfalls

\- caching

\- compression

\- CDN opportunities

\- batching

\- debounce

\- throttle

\- request deduplication



Estimate:



\- largest device, rendering, network, and startup bottlenecks

\- Expected latency

\- JavaScript bundle and native binary size improvements

\- Estimated performance gains



\---



**# PHASE 5 — LOAD TEST ANALYSIS**



Assume a large user population and bursts of concurrent activity. Evaluate client-side behavior and request patterns; do not claim that a mobile app alone determines server concurrency capacity.



Identify:



\- breaking points

\- device memory exhaustion

\- CPU spikes

\- excessive rendering

\- excessive API traffic

\- connection saturation

\- cache bottlenecks

\- race conditions

\- retry storms

\- rendering bottlenecks

\- UI freezes

\- long tasks

\- app crashes



Estimate:



\- client request rate and request burst patterns

\- client-side transaction flow limits and backend-dependent throughput

\- Expected latency

\- Failure scenarios

\- Recovery strategies



\---



**# PHASE 6 — SECURITY AUDIT**

Also review mobile-specific security:

- Keychain / Android Keystore-backed secure storage
- AsyncStorage must not be used for secrets or sensitive tokens
- deep links and universal links / Android App Links
- Android exported components, intent handling, and permissions
- iOS entitlements, URL schemes, and privacy permissions
- certificate pinning only where justified and safely maintainable
- rooted/jailbroken device assumptions (avoid treating detection as a complete security boundary)
- screenshots, clipboard, app-switcher previews, and sensitive screen handling where required
- WebView configuration and JavaScript bridge exposure
- local database and cached-file protection
- push notification payloads containing sensitive information
- third-party SDK privacy and data collection
- signing keys, provisioning profiles, and CI secret handling



Perform a complete OWASP Top 10 review focused on the mobile app.



Review:



\- XSS

\- WebView content risks, unsafe HTML rendering, and JavaScript bridge exposure where applicable

\- unsafe HTML rendering in WebViews or third-party rendering libraries

\- CSRF considerations

\- Token leakage

\- AsyncStorage and secure storage usage

\- in-memory and persisted storage usage

\- cookie handling in networking libraries and WebViews

\- JWT handling

\- Refresh token flow

\- Route protection

\- Authorization

\- Role-based rendering

\- Permission leaks

\- Secret exposure

\- Environment variable exposure

\- source map and release bundle exposure

\- Sensitive logging

\- API key exposure

\- Input sanitization

\- Output encoding

\- File upload validation

\- deep-link abuse and overlay/tapjacking considerations

\- CSP compatibility

\- CORS assumptions

\- Open redirects

\- Client-side validation bypass



Identify every possible vulnerability.



\---



**# PHASE 7 — REFACTORING REVIEW**



Suggest improvements using:



\- SOLID

\- DRY

\- KISS

\- Clean Architecture

\- Feature-based Architecture

\- feature-based architecture and reusable native UI primitives (where appropriate)

\- Reusable Components

\- Reusable Hooks

\- Reusable Services

\- Utility extraction

\- Better TypeScript

\- Dependency inversion



Recommend:



\- Folder restructuring

\- Component splitting

\- Hook extraction

\- Utility extraction

\- Shared services

\- Validation improvements

\- Error boundaries

\- Loading architecture

\- Skeleton loaders

\- Caching strategy

\- Optimistic updates

\- Better separation of concerns



\---



**# PHASE 8 — REACT NATIVE BEST PRACTICES**



Review:



\- useEffect

\- useMemo

\- useCallback

\- React.memo

\- Suspense

\- Lazy loading

\- Dynamic imports

\- Error Boundaries

\- Context API

\- Redux

\- Zustand

\- React Query

\- TanStack Query

\- Component composition

\- State lifting

\- Prop drilling

\- Native modules and platform-specific components

\- Android/iOS platform-specific behavior

\- background/foreground lifecycle and app state transitions

\- app startup and initial render behavior

\- Layout optimization

\- app metadata, permissions, and platform configuration

\- React Native and React version compatibility



\---



**# PHASE 9 — STATE MANAGEMENT REVIEW**



Review:



\- Global state

\- Local state

\- Derived state

\- Context overuse

\- Store organization

\- Selector optimization

\- Cache duplication

\- State normalization

\- Memory usage

\- State synchronization

\- Optimistic updates

\- Data consistency



\---



**# PHASE 10 — UX & ACCESSIBILITY REVIEW**

Also review:

- safe areas, notches, status bars, and navigation bars
- Android back button and gesture navigation
- keyboard avoidance, focus, and text-input behavior
- touch target sizes and gesture conflicts
- permission prompts and denial/retry flows
- offline, poor-network, airplane-mode, and reconnect states
- app background/foreground transitions
- VoiceOver, TalkBack, font scaling, and reduced motion
- platform conventions and Android/iOS UI differences



Review:



\- responsive layouts across phone, tablet, foldable, and orientation changes

\- mobile usability

\- tablet and foldable usability

\- hardware keyboard navigation and focus management

\- VoiceOver and TalkBack compatibility

\- accessible React Native components and roles

\- Focus management

\- ARIA labels

\- color contrast, dynamic type/font scaling, and reduced-motion support

\- Empty states

\- Loading states

\- Skeleton loaders

\- Error messaging

\- Form usability

\- accessibility findings and platform-specific validation

\- mobile performance and accessibility audit recommendations



\---



**# PHASE 11 — DEPENDENCY AUDIT**

Also inspect native dependency health:

- React Native version compatibility
- native module compatibility with the New Architecture, if enabled
- CocoaPods and Podfile configuration
- Gradle and Android Gradle Plugin compatibility
- Hermes compatibility
- autolinking and manually linked modules
- native SDK permissions and privacy disclosures
- Android and iOS minimum supported versions



Review:



\- Outdated packages

\- Vulnerable packages

\- Duplicate packages

\- Heavy dependencies

\- Bundle contribution

\- Tree-shaking compatibility

\- License concerns

\- Better alternatives



\---



**# PHASE 12 — TESTING REVIEW**

Review React Native testing options as appropriate to the existing stack:

- Jest and React Native Testing Library
- Detox or Maestro for end-to-end tests
- Android and iOS device/simulator coverage
- native permission and deep-link flows
- network failure, offline, retry, and app lifecycle scenarios
- release-build smoke tests and upgrade/regression coverage



Review:



\- Unit testing

\- Component testing

\- Integration testing

\- End-to-end testing

\- Detox / Maestro / React Native Testing Library (as appropriate)

\- Detox / Maestro (as appropriate)

\- Mock strategy

\- Coverage percentage

\- Missing scenarios

\- Edge cases

\- Error scenarios



Recommend missing tests.



\---



**# PHASE 13 — OBSERVABILITY**

Also review mobile observability:

- crash reporting and native crash symbolication
- JavaScript error tracking
- crash-free sessions and app-not-responding metrics
- startup time, frame rate, memory, and network telemetry
- release/version tracking and staged rollout monitoring
- privacy-safe logs and personally identifiable information redaction



Review:



\- Logging

\- Error tracking

\- Monitoring

\- Analytics

\- mobile startup time, JS thread responsiveness, frame rate, memory, crash-free sessions, and network metrics

\- Performance metrics

\- Crash reporting

\- Sentry compatibility

\- User diagnostics

\- Feature flags



\---



**# PHASE 14 — CODE QUALITY**



Review:



\- Naming

\- Formatting

\- Readability

\- Maintainability

\- Cyclomatic complexity

\- Magic numbers

\- Constants

\- Enums

\- Interfaces

\- Type safety

\- Documentation

\- Comments

\- File organization

\- Consistency



\---



**# PHASE 15 — SCALABILITY REVIEW**



Determine whether the mobile app can scale from:



100 users



↓



1,000 users



↓



10,000 users



↓



100,000 concurrent users



↓



1,000,000 users



If not,



Explain:



\- Why

\- Breaking points

\- Required improvements

\- Estimated scaling impact



\---



**# PHASE 16 — PRODUCTION READINESS**

Also verify mobile release requirements:

- Android debug/release variants, signing, R8/ProGuard, and Android App Bundle
- iOS schemes/configurations, signing, provisioning, and archive validation
- permissions and privacy manifests/disclosures as applicable
- app icons, splash screen, version/build numbers, and deep links
- release configuration and environment separation
- crash reporting, staged rollout, rollback/mitigation plan
- Google Play and Apple App Store submission readiness
- physical-device validation on representative low-, mid-, and high-end devices



Verify:



\- Android and iOS release builds

\- Environment configuration

\- Bundle optimization

\- Tree shaking

\- Source maps

\- Build optimization

\- Asset optimization

\- Android/iOS device and OS compatibility

\- Error handling

\- Feature flags

\- Versioning

\- Android/iOS CI/CD readiness

\- Monitoring readiness

\- Logging readiness

\- Google Play and Apple App Store deployment readiness



\---



**# PHASE 17 — CODE GENERATION OPPORTUNITIES**



Identify opportunities to create reusable abstractions:



\- reusable CRUD screens and native form/list patterns

\- Generic forms

\- Generic modal system

\- reusable native lists and data presentation components

\- Generic pagination

\- Generic filters

\- Generic API hooks

\- Generic mutation hooks

\- Generic validation schemas

\- Generic layouts

\- Generic dialogs

\- Shared utilities



\---



**# FINAL REPORT FORMAT**



**## Executive Summary**



Overall Code Score:

/10



Architecture:

/10



Performance:

/10



Security:

/10



Maintainability:

/10



Scalability:

/10



Accessibility:

/10



Testing:

/10



API Integration:

/10



Production Readiness:

/10



\---



**## File-by-File Review**



Review **\*\*every React Native source file individually\*\***.



For each file include:



\- File Path

\- Purpose

\- Issues Found

\- Severity

\- Technical Debt

\- Recommended Changes



\---



**## Critical Issues (Must Fix)**



For every issue provide:



\- File Name

\- Line Number (if possible)

\- Severity

\- Current Issue

\- Why it is a problem

\- Better implementation

\- Refactored code example

\- Performance impact

\- Security impact

\- Scalability impact

\- Estimated improvement (%)

\- Breaking change risk

\- Priority



\---



**## Architecture Improvements**



\---



**## API Integration Issues**



\---



**## Performance Bottlenecks**



\---



**## Security Vulnerabilities**



\---



**## Accessibility Issues**



\---



**## Dependency Issues**



\---



**## Testing Gaps**



\---



**## Refactoring Opportunities**



\---



**## Scalability Risks**



\---



**## Suggested Folder Structure**



\---



**## Recommended Libraries**



Include only libraries that provide clear value, explaining why each is recommended and whether it replaces an existing dependency.



\---



**## Production Readiness Assessment**



Include:



\- Readiness percentage

\- Major blockers

\- Minor blockers

\- Risks before deployment



\---



**## Action Plan**



Priority 1 — Critical (Must fix before production)



Priority 2 — High (Fix before launch)



Priority 3 — Medium (Improve in the next sprint)



Priority 4 — Low (Technical debt and future enhancements)



\---



**# FINAL INSTRUCTIONS**



\- Review every React Native source file recursively.

\- Do not skip files because they appear simple or repetitive.

\- Be extremely critical and assume the application will be deployed tomorrow.

\- Base recommendations on proven enterprise engineering practices, not personal preference.

\- Do not suggest backend changes unless absolutely required to explain a mobile app limitation; assume the backend contract is immutable.

\- Prefer measurable, actionable recommendations over generic advice.

\- Continue reviewing until the entire React Native application has been covered from A to Z.
