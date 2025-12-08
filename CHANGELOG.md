# Changelog

## [v0.2.0] - 2025-12-01
### Added
- Microsoft Edge eBay bridge (extension + `/integrations/edge-ebay/link`) that downloads listing imagery, merges scraped specs, tags items, and can push copies to `data/training_ingest`.
- PWA support with manifest + service worker for offline/Pages installs.
- Gallery personalization controls (auto-optimization based on device specs, performance/battery presets, image-fit and metadata toggles) for a compact or detailed layout.

### Changed
- Expanded CORS policy to allow extension calls and external clients.

### Testing & Release
- Lint the frontend to validate UI updates before packaging.

## [v0.1.0] - 2025-12-01
### Added
- Adaptive gallery controls (category-aware filters, search, adjustable columns, compact/comfortable density) to keep thumbnails tidy and responsive.
- Image fallback handling and refreshed metadata badges for more reliable previews.
- Planning artifacts: `Future-Upgrades.csv`, `Future_Implements.csv`, and `AvailableActions.md` for roadmap and CI guidance.
- GitHub Pages setup guide and expanded README content with dependency map and architecture overview.

### Changed
- Gallery fetch now respects `NEXT_PUBLIC_API_BASE_URL` to align frontend-backend environments.

### Testing & Release
- Linting to validate frontend changes; tagged this release as the initial semantic version.
