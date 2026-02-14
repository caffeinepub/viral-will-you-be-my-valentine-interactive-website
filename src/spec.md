# Specification

## Summary
**Goal:** Make background music start reliably after the first user gesture across modern browsers (including mobile), and clearly communicate audio loading/blocked/error states.

**Planned changes:**
- Add a robust “user gesture unlock” flow: when autoplay is blocked and music is enabled, register a one-time global input listener (tap/click/keyboard) that retries `audio.play()` and removes itself once playback succeeds.
- Ensure playback loops and continues across stage transitions (question → celebration) without unexpected restarts, while still respecting the existing music on/off preference.
- Improve audio readiness detection and loading/error handling for `/assets/audio/glue-song-sped-up-pitched.mp3`, including a distinct error state (e.g., missing file, 404, decode error) instead of silently waiting.
- Update the UI with an unobtrusive, accessible prompt (e.g., “Tap to enable sound”) when music is enabled but blocked by autoplay policy; the prompt triggers playback and disappears on success, without breaking the existing header toggle or mobile layout.

**User-visible outcome:** If music is enabled, the first tap/click anywhere (including Yes/No) starts the background music even on browsers that block autoplay; if audio can’t load or is blocked, the UI clearly indicates the status and provides a direct way to start playback.
