# Changelog

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/).

## [2.1.0] - 2026-06-27

### Added

- **28 CSS design tokens** for complete visual customization (`--ngx-dadata-*` custom properties).
- **Automatic dark mode** via `light-dark()` CSS function -- adapts to `prefers-color-scheme` with zero configuration.
- **Dropdown animation** using `@starting-style` CSS (progressive enhancement).
- **Touch target sizing** via `@media (pointer: coarse)` -- 48px minimum height on touch devices.
- **Standard scrollbar styling** (`scrollbar-width: thin`, `scrollbar-color`) on dropdown panel.
- **`overscroll-behavior: contain`** prevents scroll leaking from dropdown to page.
- **High contrast mode** support via `@media (forced-colors: active)`.
- **`prefers-reduced-motion`** support -- disables all transitions.
- **`effectiveConfig` merge logic** -- DI config (`provideNgxDadata`) and per-component `[config]` now merge properly. `apiKey` from DI is used when input config has empty apiKey.

### Changed

- CSS custom properties expanded from 8 to 28 (see Theming section in README).
- Input border-radius default changed from 4px to 8px.
- Focus indicator uses `:focus-visible` instead of `:focus` (keyboard-only).
- Placeholder styling normalized across browsers (Firefox `opacity: 1`).
- Demo app fully supports dark mode via `light-dark()`.
- Demo app API key configured via `provideNgxDadata()` (DI) instead of hardcoded in component.

### Fixed

- `effectiveConfig` now merges input config with DI config instead of "input wins all". Empty `apiKey` in `[config]` correctly falls back to DI-provided key.
- README: `(selected)` output type corrected from `EventEmitter` to `OutputEmitterRef`.
- Demo app dark mode mismatch (light page + dark components) resolved.

## [2.0.0] - 2026-06-26

### Breaking Changes

- Minimum Angular version raised to **19.0.0** (was 13.0.0).
- TypeScript **5.5+** required (was 4.5).
- RxJS **7.x** required (was 6.x).
- Node.js **18+** required (was 14).
- `NgxDadataModule` is now deprecated. Import `NgxDadataComponent` directly as a standalone component.
- Removed `safevalues` dependency. Trusted Types are handled by Angular's built-in sanitizer.
- Removed Karma/Jasmine test infrastructure (replaced by Vitest).
- Removed Travis CI configuration (replaced by GitHub Actions).
- Removed Protractor e2e test infrastructure.
- `DadataConfig.bounds` field now uses `fromBound`/`toBound` properties instead of the previous structure.
- `DadataSuggestion` data types are now properly discriminated (includes `DadataCountry`).
- Deprecated type aliases `Location`, `Bound`, `Bounds` -- use `DadataLocation`, `DadataBound`, `DadataBounds` instead.

### Added

- **Standalone component** with Angular signal-based `input()`, `output()`, `signal()`, and `computed()`.
- **`provideNgxDadata()`** function for global DI-based configuration.
- **`NGX_DADATA_CONFIG`** injection token for providing `DadataConfig` at the application level.
- **WAI-ARIA combobox** pattern: `role="combobox"`, `role="listbox"`, `role="option"`, `aria-expanded`, `aria-activedescendant`, `aria-selected`.
- **Keyboard navigation**: ArrowUp, ArrowDown, Enter, Escape, Home, End with wrapping behavior.
- **`DadataType` enum** expanded to **24 types**: address, fio, party, bank, email, fias, country, postal_unit, party_by, party_kz, currency, okved2, okpd2, oktmo, mktu, metro, fms_unit, fns_unit, fts_unit, court, car_brand, okpdtr_profession, okpdtr_position, medical_position.
- **`findById()`** service method for looking up entities by identifier (FIAS ID, INN, OGRN, BIC).
- **`geolocate()`** service method for finding nearest addresses by GPS coordinates.
- **`iplocate()`** service method for determining location by IP address.
- **Extended Dadata API parameters**: `restrictValue`, `language`, `locationsGeo`, `division`, `entityType`, `status`, `okved`, `branchType`, `bankStatus`, `bankType`, `gender`, `parts`.
- **Web Components support** via `registerNgxDadataElement()` (Angular Elements). Use `<ngx-dadata>` in React, Vue, or plain HTML.
- **CSS custom properties** for theming: `--ngx-dadata-border-color`, `--ngx-dadata-border-radius`, `--ngx-dadata-bg`, `--ngx-dadata-focus-color`, `--ngx-dadata-hover-bg`, `--ngx-dadata-active-bg`, `--ngx-dadata-active-color`, `--ngx-dadata-detail-color`.
- **`DadataCountry`** interface for country suggestion data.
- **`DadataIplocateResponse`** interface for IP locate responses.
- **`GeolocateOptions`** and **`IplocateOptions`** interfaces.
- **Complete TypeScript models** for all Dadata response types (address, FIO, party, bank, email, country).
- **Comprehensive Vitest test suite**: 182 tests with 93%+ code coverage.
- **GitHub Actions CI** workflow: lint, build, test with coverage.
- **ESLint flat config** with `angular-eslint` and `typescript-eslint`.
- **Prettier** for code formatting.

### Changed

- Component rewritten from NgModule-based to **standalone** with `ChangeDetectionStrategy.OnPush`.
- All inputs migrated to **signal inputs** (`input()`, `input.required()`).
- All outputs migrated to **signal outputs** (`output()`).
- Internal state uses **signals** (`signal()`, `computed()`) instead of mutable class fields.
- RxJS subscription cleanup uses **`takeUntilDestroyed()`** via `DestroyRef` instead of manual `ngOnDestroy`.
- Outside-click detection uses **host binding** `(document:click)` instead of `document.getElementById()`.
- Suggestion panel uses **`@if`/`@for`** control flow instead of `*ngIf`/`*ngFor`.
- `NgxDadataService` uses **`inject()`** function instead of constructor-based DI.
- Service is now `providedIn: 'root'` (tree-shakeable).
- Template class `autocomplele-item` corrected to `autocomplete-item`.
- Workspace upgraded to **Angular 22** (library peer deps remain `>=19.0.0` for broad compatibility).
- Build tooling: **ng-packagr 22** with APF partial compilation.
- Test runner: **Vitest 4** with `@angular/build:unit-test` builder and jsdom.

### Fixed

- **Memory leak**: `inputString$` RxJS Subject was never unsubscribed in `ngOnDestroy`. Now cleaned up via `takeUntilDestroyed()`.
- **Null reference**: `document.getElementById()` in `setFocus`/`removeFocus` could return null, causing runtime errors. Replaced with signal-based active index tracking and template bindings.
- **Array out-of-bounds**: `onEnter()` accessed `data[-1]` when `currentFocusIndex` was `0` and no item was focused. Now guarded by `activeIndex() >= 0` check.
- **Invalid TypeScript syntax**: `data.ts:121` contained `latinstring: | null;` (missing type before union). All model types now have correct syntax.
- **Template typo**: CSS class `autocomplele-item` renamed to `autocomplete-item`.
- **Wrong decorator**: `@Output() selectedSuggestion` was not backed by `EventEmitter`. Now uses signal-based `output<DadataSuggestion>()`.

### Removed

- `safevalues` dependency and manual TrustedType handling.
- Karma, Jasmine, and karma-chrome-launcher test dependencies.
- Travis CI configuration (`.travis.yml`).
- Protractor and e2e test infrastructure.
- Direct DOM access via `document.getElementById()`.

## [1.0.4] - 2025-01-15

### Fixed

- Remove extra alert from library code.

## [1.0.3] - 2024-12-20

### Fixed

- Remove unused DOM sanitizer import.

### Security

- TrustedType HTML assignment fix.

## [1.0.2] - 2024-06-10

### Changed

- Update Angular to latest v13 patch.

## [1.0.1] - 2024-03-15

### Fixed

- Add `safevalues` to handle `TrustedHTML` assignment requirement.

## [1.0.0] - 2023-11-01

### Changed

- Update Angular to v13.
- Fix local npm version.

## [0.7.0] - 2020-03-15

### Fixed

- Fix Enter key on suggestion selection.

### Added

- Additional options to config (location constraints, bounds).

### Changed

- Update Angular to 9.0.1.

## [0.6.0] - 2019-12-01

### Added

- Address search sector limitation via API locations.
- Config enhancement for advanced filtering.

## [0.5.0] - 2019-09-01

### Fixed

- Fix container styles.

### Added

- INN and address display in party suggestion mode.
- Output data type for selected suggestion.

### Changed

- Code cleanup and template refactoring.

## [0.4.0] - 2019-05-01

### Fixed

- Fix badge URLs after Travis CI migration.
- Remove fixed `id` property from template.

### Changed

- Extract library to separate project within Angular CLI workspace.
- Add demo application.

## [0.3.0] - 2019-01-01

### Changed

- Angular 7+ support.
- Changed event emitter implementation.

## [0.2.0] - 2018-10-01

### Fixed

- Multiple initialization and configuration fixes.
- Linter warnings resolved.

## [0.1.0] - 2018-08-01

### Added

- Initial release.
- Dadata address autocomplete component.
- NgModel support via ControlValueAccessor.
- Basic configuration (API key, type, locations).

[2.0.0]: https://github.com/kolkov/ngx-dadata/compare/v1.0.4...v2.0.0
[1.0.4]: https://github.com/kolkov/ngx-dadata/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/kolkov/ngx-dadata/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/kolkov/ngx-dadata/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/kolkov/ngx-dadata/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/kolkov/ngx-dadata/compare/v0.7.0...v1.0.0
[0.7.0]: https://github.com/kolkov/ngx-dadata/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/kolkov/ngx-dadata/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/kolkov/ngx-dadata/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/kolkov/ngx-dadata/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/kolkov/ngx-dadata/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/kolkov/ngx-dadata/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/kolkov/ngx-dadata/releases/tag/v0.1.0
