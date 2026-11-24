# Bugfix Requirements Document

## Introduction

The `/app/loading.tsx` file currently uses `AuthSkeleton`, which displays authentication-specific UI elements (sign-in form, welcome message, user/lock icons) during loading states for all routes in the application. This creates a confusing user experience where users briefly see authentication UI when navigating to non-auth routes like the gallery, profile, or generate pages.

The fix will replace `AuthSkeleton` with a neutral, global skeleton component that provides a generic loading state without authentication-specific styling or elements.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN any route in the application is loading THEN the system displays `AuthSkeleton` with authentication-specific elements (sign-in form, "Welcome" text, user/lock icons, "Sign in to continue" message)

1.2 WHEN navigating to non-authentication routes (e.g., /gallery, /profile, /generate) THEN the system briefly shows authentication UI elements during the loading state

### Expected Behavior (Correct)

2.1 WHEN any route in the application is loading THEN the system SHALL display a neutral skeleton component without authentication-specific elements

2.2 WHEN navigating to non-authentication routes THEN the system SHALL show a generic loading state that does not resemble the sign-in page

### Unchanged Behavior (Regression Prevention)

3.1 WHEN the application is loading THEN the system SHALL CONTINUE TO display a loading skeleton (just not authentication-specific)

3.2 WHEN routes finish loading THEN the system SHALL CONTINUE TO render the actual page content as expected
