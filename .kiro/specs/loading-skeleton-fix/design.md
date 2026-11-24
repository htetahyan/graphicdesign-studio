# Loading Skeleton Fix - Bugfix Design

## Overview

The bug occurs when users navigate to any route in the application - they briefly see authentication-specific UI elements (sign-in form, "Welcome" text, user/lock icons) during the loading state, even when navigating to non-auth routes like gallery, profile, or generate pages. This creates a confusing user experience.

The fix will replace the `AuthSkeleton` component in `/app/loading.tsx` with a new neutral `GlobalSkeleton` component that provides a generic loading state without authentication-specific styling or elements. The implementation will be minimal - creating a simple, neutral skeleton and updating the import in loading.tsx.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when any route is loading and displays authentication-specific UI elements
- **Property (P)**: The desired behavior - loading states should display neutral skeleton UI without authentication-specific elements
- **Preservation**: The loading skeleton display mechanism and route loading behavior must remain unchanged
- **AuthSkeleton**: The component in `components/ui/skeletons.tsx` that displays authentication-specific UI (sign-in form, welcome message, user/lock icons)
- **GlobalSkeleton**: The new neutral skeleton component that will replace AuthSkeleton for global loading states
- **loading.tsx**: The Next.js app-level loading file at `/app/loading.tsx` that defines the loading UI for all routes

## Bug Details

### Fault Condition

The bug manifests when any route in the application is loading. The `loading.tsx` file imports and renders `AuthSkeleton`, which contains authentication-specific elements (sign-in form structure, "Welcome" text, "Sign in to continue" message, User and Lock icons, "Create Account" link).

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type { route: string, isLoading: boolean }
  OUTPUT: boolean
  
  RETURN input.isLoading === true
         AND input.route IN [any application route]
         AND currentSkeletonComponent === "AuthSkeleton"
         AND skeletonDisplaysAuthElements === true
END FUNCTION
```

### Examples

- User navigates to `/gallery` → Loading state shows "Welcome", "Sign in to continue", user/lock icons (incorrect)
- User navigates to `/profile` → Loading state shows authentication form skeleton (incorrect)
- User navigates to `/generate` → Loading state shows "Create Account" link and auth-specific styling (incorrect)
- User navigates to `/auth/signin` → After fix, should show neutral skeleton (acceptable trade-off for consistency)

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- A loading skeleton must continue to be displayed when routes are loading
- The loading skeleton must continue to use the Next.js app-level loading.tsx mechanism
- Routes must continue to render their actual content after loading completes
- The loading skeleton must continue to be visually polished and professional

**Scope:**
All aspects of the loading mechanism that do NOT involve the specific UI elements displayed should be completely unaffected by this fix. This includes:
- The Next.js loading.tsx file structure and export pattern
- The timing and triggering of loading states
- The transition from loading state to loaded content
- Other skeleton components (GallerySkeleton, ProfileSkeleton, etc.) used in specific pages

## Hypothesized Root Cause

Based on the bug description and code analysis, the root cause is clear:

1. **Incorrect Component Selection**: The `/app/loading.tsx` file imports and uses `AuthSkeleton`, which was designed specifically for authentication pages but is being used as the global loading state for all routes.

2. **Missing Neutral Alternative**: There is no neutral, global skeleton component in the codebase. The available skeletons are all page-specific (GallerySkeleton, ProfileSkeleton, GenerateSkeleton, etc.) or authentication-specific (AuthSkeleton).

3. **Design Oversight**: The loading.tsx file was likely created with AuthSkeleton as a placeholder or because it was the most visually polished skeleton available, without considering that it would be shown for all routes.

## Correctness Properties

Property 1: Fault Condition - Neutral Loading State Display

_For any_ route loading state where the application is transitioning between routes, the fixed loading.tsx SHALL display a neutral skeleton component without authentication-specific elements (no sign-in form structure, no "Welcome" text, no "Sign in to continue" message, no user/lock icons, no "Create Account" link).

**Validates: Requirements 2.1, 2.2**

Property 2: Preservation - Loading Mechanism Behavior

_For any_ loading state that is NOT related to the specific UI elements displayed (timing, triggering, transitions, file structure), the fixed code SHALL produce exactly the same behavior as the original code, preserving the Next.js loading mechanism, route transition behavior, and loading-to-loaded content transitions.

**Validates: Requirements 3.1, 3.2**

## Fix Implementation

### Changes Required

The root cause analysis indicates we need to create a neutral skeleton and update the import.

**File 1**: `components/ui/skeletons.tsx`

**Function**: New `GlobalSkeleton` component

**Specific Changes**:
1. **Create GlobalSkeleton Component**: Add a new exported function `GlobalSkeleton()` that renders a neutral loading skeleton
   - Use simple, centered layout with neutral colors (gray-based palette)
   - Include generic skeleton elements (no icons, no text, no form structure)
   - Use the existing `Skeleton` component for consistency
   - Keep styling minimal and professional
   - Avoid any authentication-specific or page-specific elements

**File 2**: `app/loading.tsx`

**Function**: `Loading` component

**Specific Changes**:
1. **Update Import Statement**: Change `import { AuthSkeleton }` to `import { GlobalSkeleton }`
2. **Update Component Usage**: Change `<AuthSkeleton />` to `<GlobalSkeleton />`

### Implementation Details

The GlobalSkeleton component should follow this pattern:
- Centered layout with neutral background
- 2-3 simple skeleton bars/cards for visual feedback
- No icons, no text labels, no form-like structure
- Subtle animation (shimmer effect from existing Skeleton component)
- Responsive design that works on all screen sizes
- Minimal code (under 30 lines)

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code by observing authentication-specific elements during loading, then verify the fix displays neutral elements and preserves the loading mechanism.

### Exploratory Fault Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm that authentication-specific elements are displayed during loading states for non-auth routes.

**Test Plan**: Manually navigate to various routes and observe the loading state. Take screenshots or note the specific authentication elements that appear. Run automated tests that render the loading.tsx component and assert that authentication-specific elements are present in the UNFIXED code.

**Test Cases**:
1. **Gallery Route Loading**: Navigate to `/gallery` and observe "Welcome" text appears (will fail on unfixed code - shows auth elements)
2. **Profile Route Loading**: Navigate to `/profile` and observe user/lock icons appear (will fail on unfixed code - shows auth elements)
3. **Generate Route Loading**: Navigate to `/generate` and observe "Sign in to continue" message appears (will fail on unfixed code - shows auth elements)
4. **Component Render Test**: Render `<Loading />` component and assert it contains AuthSkeleton with User/Lock icons (will pass on unfixed code, confirming the bug)

**Expected Counterexamples**:
- Authentication-specific text ("Welcome", "Sign in to continue", "Create Account") appears in loading states for non-auth routes
- User and Lock icons from lucide-react are rendered in the loading skeleton
- Sign-in form structure (input fields, button) is visible during loading
- Possible causes: AuthSkeleton is imported and used in loading.tsx, no neutral alternative exists

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds (any route loading), the fixed function produces the expected behavior (neutral skeleton without auth elements).

**Pseudocode:**
```
FOR ALL route WHERE route.isLoading === true DO
  loadingUI := renderLoading_fixed(route)
  ASSERT NOT containsAuthElements(loadingUI)
  ASSERT containsNeutralSkeleton(loadingUI)
  ASSERT NOT containsText(loadingUI, ["Welcome", "Sign in", "Create Account"])
  ASSERT NOT containsIcons(loadingUI, [User, Lock])
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold (loading mechanism behavior, timing, transitions), the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL behavior WHERE behavior NOT IN [displayed UI elements] DO
  ASSERT loadingMechanism_original(behavior) = loadingMechanism_fixed(behavior)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across different routes and loading scenarios
- It catches edge cases like rapid navigation, concurrent loading states, or race conditions
- It provides strong guarantees that the loading mechanism behavior is unchanged

**Test Plan**: Observe behavior on UNFIXED code first for loading timing, route transitions, and content rendering, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Loading Display Preservation**: Verify that a skeleton continues to be displayed during loading (not blank screen)
2. **Route Transition Preservation**: Verify that routes continue to load and render content correctly after loading state
3. **Loading Timing Preservation**: Verify that loading states trigger at the same times as before
4. **File Structure Preservation**: Verify that loading.tsx continues to export a default component correctly

### Unit Tests

- Test that GlobalSkeleton renders without authentication-specific elements
- Test that loading.tsx imports and renders GlobalSkeleton correctly
- Test that no User, Lock, or Sparkles icons are present in the loading UI
- Test that no authentication-specific text is present in the loading UI

### Property-Based Tests

- Generate random route paths and verify loading state shows neutral skeleton for all routes
- Generate random navigation sequences and verify loading states never show auth elements
- Test that loading mechanism timing and behavior is preserved across many scenarios

### Integration Tests

- Test full navigation flow from one route to another, verifying neutral loading state appears
- Test rapid navigation between multiple routes, verifying consistent neutral loading UI
- Test that after loading completes, the correct page content is displayed (not affected by skeleton change)
