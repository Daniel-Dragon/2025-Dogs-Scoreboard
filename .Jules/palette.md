# Palette's Journal

## 2025-01-28 - Leaderboard Keyboard Accessibility
**Learning:** `tr` elements with `cursor: pointer` are often not accessible to keyboard users by default, effectively blocking them from core navigation.
**Action:** When making entire rows clickable for better mouse UX, always ensure they are focusable (`tabindex="0"`) and have keyboard event handlers (`keydown.enter`), or wrap the primary content in a link/button.

## 2025-01-29 - Accessible Loading States
**Learning:** Visual-only loading text ("Fetching Tasty Data...") is invisible to screen reader users, leaving them unsure if the application is broken or processing.
**Action:** Always wrap loading indicators in a container with `role="status"` and `aria-live="polite"` to ensure status updates are announced without interrupting the user.
