# Migrating from v1.x to v2.0

This guide covers every change needed to upgrade from `@kolkov/ngx-dadata` v1.x to v2.0.

## Requirements

Before upgrading, ensure your project meets these minimum versions:

| Dependency | v1.x | v2.0 |
|------------|------|------|
| Angular    | 13+  | 19+  |
| TypeScript | 4.5+ | 5.5+ |
| RxJS       | 6.x  | 7.x  |
| Node.js    | 14+  | 18+  |

If your project is on Angular 14-18, you must upgrade Angular first. See the [Angular update guide](https://angular.dev/update-guide).

## Step 1: Update the Package

```bash
npm install @kolkov/ngx-dadata@latest
```

If you were using `safevalues`, you can remove it -- v2.0 no longer depends on it:

```bash
npm uninstall safevalues
```

## Step 2: Update Imports

### Standalone Components (Recommended)

Replace `NgxDadataModule` with direct component imports and `provideNgxDadata()`.

**Before (v1.x):**

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgxDadataModule } from '@kolkov/ngx-dadata';

@NgModule({
  imports: [HttpClientModule, NgxDadataModule],
})
export class AppModule {}
```

**After (v2.0):**

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideNgxDadata, DadataType } from '@kolkov/ngx-dadata';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideNgxDadata({ apiKey: 'YOUR_API_KEY', type: DadataType.address }),
  ],
};
```

```typescript
// your.component.ts
import { NgxDadataComponent } from '@kolkov/ngx-dadata';

@Component({
  standalone: true,
  imports: [NgxDadataComponent],
  // ...
})
export class YourComponent {}
```

### Keeping NgModule (Temporary)

If you cannot migrate to standalone components yet, `NgxDadataModule` still works but is deprecated:

```typescript
import { NgxDadataModule } from '@kolkov/ngx-dadata'; // deprecated

@NgModule({
  imports: [NgxDadataModule],
})
export class AppModule {}
```

Plan to migrate away from `NgxDadataModule` before the next major version.

## Step 3: Update Configuration

### Config Interface Changes

The `DadataConfig` interface has new fields but remains backward compatible for the properties that existed in v1.x, with one exception:

**Bounds property structure changed:**

```typescript
// Before (v1.x) -- if you used bounds
config: DadataConfig = {
  apiKey: 'KEY',
  bounds: {
    from_bound: { value: 'city' },
    to_bound: { value: 'settlement' },
  },
};

// After (v2.0)
config: DadataConfig = {
  apiKey: 'KEY',
  bounds: {
    fromBound: { value: 'city' },
    toBound: { value: 'settlement' },
  },
};
```

### DadataType Import

`DadataType` is now exported from the main entry point alongside the service:

```typescript
// Before (v1.x)
import { DadataType } from '@kolkov/ngx-dadata';

// After (v2.0) -- same import, no change needed
import { DadataType } from '@kolkov/ngx-dadata';
```

The enum values remain the same (`DadataType.address`, `DadataType.fio`, etc.), with 19 new types added.

## Step 4: Update Event Handling

The `(selected)` output emits the same `DadataSuggestion` interface as before. No changes needed.

```html
<ngx-dadata (selected)="onSelected($event)" />
```

```typescript
onSelected(suggestion: DadataSuggestion): void {
  const address = suggestion.data as DadataAddress;
  console.log(address.city);
}
```

## Step 5: Update Styles (if customized)

If you were overriding component styles, the class names have changed slightly:

| v1.x | v2.0 | Notes |
|------|------|-------|
| `.ngx-da-data-container` | `.ngx-dadata` | Renamed |
| `.autocomplele-item` | `.ngx-dadata-item` | Typo fixed, renamed |
| Custom CSS overrides | CSS custom properties | Use `--ngx-dadata-*` properties |

**Before (v1.x):**

```css
::ng-deep .ngx-da-data-container input {
  border: 1px solid #ccc;
  border-radius: 8px;
}
```

**After (v2.0):**

```css
ngx-dadata {
  --ngx-dadata-border-color: #ccc;
  --ngx-dadata-border-radius: 8px;
}
```

All available CSS custom properties are documented in the [README](README.md#theming).

## Step 6: Review Deprecated APIs

The following type aliases are deprecated and will be removed in a future version. Update your imports:

| Deprecated | Replacement |
|------------|-------------|
| `Location` | `DadataLocation` |
| `Bound` | `DadataBound` |
| `Bounds` | `DadataBounds` |

## Breaking Changes Summary

1. **Angular 19+ required** -- apps on Angular 13-18 must upgrade Angular first.
2. **TypeScript 5.5+ required** -- follows Angular 19 requirements.
3. **RxJS 7.x required** -- RxJS 6 is no longer supported.
4. **Node.js 18+ required** -- Node 14 and 16 are EOL.
5. **`NgxDadataModule` deprecated** -- use standalone imports with `provideNgxDadata()`.
6. **`safevalues` removed** -- if your app depended on it transitively, install it separately.
7. **Bounds property renamed** -- `from_bound`/`to_bound` became `fromBound`/`toBound` in `DadataBounds`.
8. **CSS class names changed** -- use CSS custom properties instead of `::ng-deep` overrides.
9. **Karma/Jasmine removed** -- library tests now use Vitest (affects contributors only).
10. **Travis CI removed** -- CI now runs on GitHub Actions (affects contributors only).

## New Features Available After Migration

After upgrading, you gain access to features not available in v1.x:

- **`provideNgxDadata()`** -- configure once, use everywhere.
- **Service API** -- `findById()`, `geolocate()`, `iplocate()` methods.
- **24 suggestion types** -- country, FIAS, classifiers, international, and more.
- **WCAG AA accessibility** -- full keyboard navigation and ARIA support.
- **Web Components** -- use `<ngx-dadata>` in React, Vue, or plain HTML.
- **CSS custom properties** -- theme without `::ng-deep`.
- **Extended API parameters** -- `restrictValue`, `language`, `locationsGeo`, `division`, gender/parts filtering, bank/party status filtering.

## Getting Help

If you encounter issues during migration:

1. Check the [CHANGELOG](CHANGELOG.md) for the full list of changes.
2. Search [existing issues](https://github.com/kolkov/ngx-dadata/issues).
3. Open a [new issue](https://github.com/kolkov/ngx-dadata/issues/new) with the `migration` label.
