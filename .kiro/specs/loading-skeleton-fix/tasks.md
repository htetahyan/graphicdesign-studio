# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Fault Condition** - Authentication Elements in Global Loading State
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate authentication-specific elements appear in loading states
  - **Scoped PBT Approach**: Scope the property to concrete failing cases - loading states for non-auth routes (e.g., /gallery, /profile, /generate)
  - Test that loading.tsx renders AuthSkeleton with authentication-specific elements (User/Lock icons, "Welcome" text, "Sign in to continue" message)
  - The test assertions should verify NO authentication elements are present (this will fail on unfixed code)
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found: which auth elements appear (icons, text, form structure)
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 1.2_

- [ ] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Loading Mechanism Behavior
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for loading mechanism (timing, transitions, skeleton display)
  - Write property-based tests capturing observed behavior patterns:
    - A skeleton is displayed during loading (not blank screen)
    - Routes transition correctly from loading to loaded content
    - Loading states trigger at appropriate times
    - loading.tsx exports a default component correctly
  - Property-based testing generates many test cases for stronger guarantees across different routes and navigation patterns
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2_

- [ ] 3. Fix for authentication-specific elements in global loading state

  - [ ] 3.1 Create GlobalSkeleton component
    - Add new GlobalSkeleton component to components/ui/skeletons.tsx
    - Use simple, centered layout with neutral colors (gray-based palette)
    - Include 2-3 generic skeleton bars/cards using existing Skeleton component
    - NO icons, NO text labels, NO form-like structure
    - Keep implementation minimal (under 30 lines)
    - Ensure responsive design for all screen sizes
    - _Bug_Condition: isBugCondition(input) where input.isLoading === true AND currentSkeletonComponent === "AuthSkeleton"_
    - _Expected_Behavior: Display neutral skeleton without authentication-specific elements (no User/Lock icons, no "Welcome" text, no "Sign in to continue" message, no form structure)_
    - _Preservation: Loading skeleton display mechanism, Next.js loading.tsx structure, route transition behavior must remain unchanged_
    - _Requirements: 2.1, 2.2, 3.1, 3.2_

  - [ ] 3.2 Update loading.tsx to use GlobalSkeleton
    - Change import from AuthSkeleton to GlobalSkeleton in app/loading.tsx
    - Update component usage from <AuthSkeleton /> to <GlobalSkeleton />
    - Verify loading.tsx still exports default component correctly
    - _Bug_Condition: isBugCondition(input) where input.isLoading === true AND currentSkeletonComponent === "AuthSkeleton"_
    - _Expected_Behavior: Display neutral skeleton without authentication-specific elements_
    - _Preservation: Loading mechanism timing, triggering, and transitions must remain unchanged_
    - _Requirements: 2.1, 2.2, 3.1, 3.2_

  - [ ] 3.3 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Neutral Loading State Display
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior (no auth elements)
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed - no auth elements in loading state)
    - _Requirements: 2.1, 2.2_

  - [ ] 3.4 Verify preservation tests still pass
    - **Property 2: Preservation** - Loading Mechanism Behavior
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions in loading mechanism)
    - Confirm all tests still pass after fix (skeleton display, route transitions, timing preserved)

- [ ] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
