# WINSTON COMMAND — Cinematic rebuild integration contract

## Release boundary
- Build only on `feature/winston-cinematic-v5-preview` until the owner approves production.
- Keep existing Firebase project, authentication, Firestore document paths, firm/account identifiers and saved data unchanged.
- Keep existing production entrypoint operational; add cinematic modules behind an explicit preview switch until validated.
- Do not expose Schwab credentials or market data to unauthorized users. The backend's owner-only authorization and exact CORS allowlist remain in force.

## Parallel workstreams
1. **Room scene:** Panoramic curved architecture, stage, ceiling, lighting and floor; prioritize actual perspective and legibility over decorative CSS overlays.
2. **Globe:** Real browser-rendered 3D Earth, atmosphere, orbit animation and graceful WebGL/reduced-motion fallback.
3. **Firm/account layer:** Reuse existing Firestore-driven data and action handlers. Do not duplicate data stores or replace account identifiers. Ensure account controls remain clickable and readable.
4. **Market intelligence:** Reuse authenticated Schwab endpoint. ES/NQ verified with specific December 2026 symbols; MES/MNQ and rollover transitions remain unverified. Never present illustrative data as live.
5. **Navigation:** Preserve existing tabs, journal, settings, firm editor and all non-network tools.

## Integration gates
- Sign in/out and session recovery work.
- Seven firms / 35 accounts remain consistent with the user's current data, including after reload.
- Account edit, status changes and journal flows work; verify on safe test records before touching production data.
- Schwab SPY, ES and NQ show verified quotes; missing quotes clear stale values.
- Responsive at desktop widths and usable when WebGL is unavailable.
- No console exceptions, broken selectors, or persistent performance issues.
- User approves visual comparison against the supplied cinematic concept before merge.

## Implementation principle
The image is a **visual target**, not a source of live figures or a promise of pixel-identical 3D output. Build a new scene layer, preserve the proven application logic, and integrate only after both pass testing.
