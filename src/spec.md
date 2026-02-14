# Specification

## Summary
**Goal:** Add continuous background music across the full Valentine experience with an accessible mute/unmute control.

**Planned changes:**
- Add a local static audio file under `frontend/public/assets/audio/` and play it from a stable `/assets/...` URL (no YouTube streaming/embedding).
- Implement a background music player that persists across stage transitions (question ↔ celebration) without restarting, and loops continuously.
- Add a discoverable, accessible “Music: On/Off” toggle (keyboard + aria-label) that immediately mutes/unmutes and persists the setting across reloads (e.g., localStorage).
- Handle modern browser autoplay restrictions gracefully by starting playback only after a user interaction when required, without console errors.

**User-visible outcome:** Users hear looping background music throughout both stages, can toggle it on/off at any time, and their preference is remembered after reloading the page.
