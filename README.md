# @kolkov/ngx-dadata

[![npm version](https://badge.fury.io/js/%40kolkov%2Fngx-dadata.svg)](https://www.npmjs.com/package/@kolkov/ngx-dadata)
[![CI](https://github.com/kolkov/ngx-dadata/actions/workflows/ci.yml/badge.svg)](https://github.com/kolkov/ngx-dadata/actions/workflows/ci.yml)
[![Coverage](https://codecov.io/gh/kolkov/ngx-dadata/branch/master/graph/badge.svg)](https://codecov.io/gh/kolkov/ngx-dadata)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/kolkov/ngx-dadata/blob/master/LICENSE)

Angular autocomplete component for the [Dadata.ru](https://dadata.ru/api/suggest/) suggestions API.

## Features

- **Angular 19+** standalone component with signal-based inputs and outputs
- **24 Dadata suggestion types**: address, FIO, party, bank, email, country, FIAS, and 17 more
- **WAI-ARIA combobox** pattern, WCAG AA accessible
- **Keyboard navigation**: ArrowUp/Down, Enter, Escape, Home, End
- **ControlValueAccessor**: works with both `ngModel` and reactive forms
- **CSS custom properties** for theming -- no style overrides needed
- **Service API**: `getSuggestions`, `findById`, `geolocate`, `iplocate`
- **Web Components** support via Angular Elements
- **Tree-shakeable**, `OnPush` change detection, SSR-safe (no direct DOM access)
- **182 tests**, 93%+ code coverage

## Requirements

| Dependency | Version |
|------------|---------|
| Angular    | >= 19.0.0 |
| TypeScript | >= 5.5 |
| RxJS       | >= 7.0 |
| Node.js    | >= 18 |

## Installation

```bash
npm install @kolkov/ngx-dadata
```

## Quick Start (Standalone)

This is the recommended approach for Angular 19+.

**1. Configure providers** in your application config:

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideNgxDadata, DadataType } from '@kolkov/ngx-dadata';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideNgxDadata({ apiKey: 'YOUR_DADATA_API_KEY', type: DadataType.address }),
  ],
};
```

**2. Import the component** and use it in your template:

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxDadataComponent, DadataSuggestion, DadataAddress } from '@kolkov/ngx-dadata';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, NgxDadataComponent],
  template: `
    <ngx-dadata
      placeholder="Enter address"
      [(ngModel)]="address"
      (selected)="onSelected($event)"
    />
  `,
})
export class AppComponent {
  address = '';

  onSelected(suggestion: DadataSuggestion): void {
    const data = suggestion.data as DadataAddress;
    console.log('Selected:', suggestion.value, data);
  }
}
```

## Quick Start (NgModule)

For projects that still use NgModule, the deprecated `NgxDadataModule` is available:

```typescript
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgxDadataModule } from '@kolkov/ngx-dadata';

@NgModule({
  imports: [HttpClientModule, NgxDadataModule],
})
export class AppModule {}
```

Then use `<ngx-dadata>` in your templates as shown above.

> **Note**: `NgxDadataModule` is deprecated and will be removed in a future major version.
> Migrate to the standalone import with `provideNgxDadata()`.

## Configuration

### Per-Component Config

Pass config directly via the `[config]` input:

```html
<ngx-dadata
  [config]="{ apiKey: 'KEY', type: DadataType.party, limit: 5 }"
  (selected)="onSelected($event)"
/>
```

### Global Config via DI

Use `provideNgxDadata()` at the application level. Per-component `[config]` takes priority over the DI config.

### DadataConfig Reference

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `apiKey` | `string` | `''` | **Required.** Your Dadata API key. |
| `type` | `DadataType` | `'address'` | Suggestion type (see DadataType enum below). |
| `delay` | `number` | `500` | Debounce delay in milliseconds before sending a request. |
| `limit` | `number` | `10` | Maximum number of suggestions returned. |
| `partyAddress` | `'city' \| 'full'` | `'city'` | Address detail level shown for party suggestions. |
| `locations` | `DadataLocation[]` | -- | Restrict suggestions to specific locations. |
| `locationsBoost` | `DadataLocation[]` | -- | Boost suggestions from specific locations. |
| `bounds` | `DadataBounds` | -- | Restrict granularity (`fromBound` / `toBound`). |
| `restrictValue` | `boolean` | -- | (Address) Restrict displayed value to `locations`. |
| `language` | `'ru' \| 'en'` | -- | (Address) Response language. |
| `locationsGeo` | `DadataLocationGeo[]` | -- | (Address) Geo-based location constraints. |
| `division` | `'administrative' \| 'municipal'` | -- | (Address) Administrative or municipal division. |
| `entityType` | `'LEGAL' \| 'INDIVIDUAL'` | -- | (Party) Filter by entity type. |
| `status` | `string[]` | -- | (Party) Filter by organization status. |
| `okved` | `string[]` | -- | (Party) Filter by OKVED codes. |
| `branchType` | `'MAIN' \| 'BRANCH'` | -- | (Party) Filter by branch type. |
| `bankStatus` | `string[]` | -- | (Bank) Filter by bank status. |
| `bankType` | `string[]` | -- | (Bank) Filter by bank type. |
| `gender` | `'MALE' \| 'FEMALE' \| 'UNKNOWN'` | -- | (FIO) Filter by gender. |
| `parts` | `('SURNAME' \| 'NAME' \| 'PATRONYMIC')[]` | -- | (FIO) Which name parts to suggest. |

### DadataType Enum

```typescript
enum DadataType {
  // Primary
  address, fio, party, bank, email,
  // Extended
  fias, country, postal_unit,
  // International
  party_by, party_kz,
  // Classifiers
  currency, okved2, okpd2, oktmo, mktu,
  metro, fms_unit, fns_unit, fts_unit,
  court, car_brand,
  okpdtr_profession, okpdtr_position,
  medical_position,
}
```

### Component Inputs and Outputs

| Binding | Type | Description |
|---------|------|-------------|
| `[config]` | `DadataConfig` | Configuration (optional if `provideNgxDadata()` is used). |
| `[placeholder]` | `string` | Input placeholder text. Default: `''`. |
| `[disabled]` | `boolean` | Disables the input. Default: `false`. |
| `(selected)` | `EventEmitter<DadataSuggestion>` | Emitted when a suggestion is selected. |
| `ngModel` / `formControlName` | `string` | Form binding for the input value. |

## Service API

Inject `NgxDadataService` for direct API access. When `provideNgxDadata()` is configured, the service picks up the global config automatically -- or you can pass a config per call.

### getSuggestions

```typescript
import { NgxDadataService, DadataType } from '@kolkov/ngx-dadata';

@Component({ /* ... */ })
export class MyComponent {
  private readonly dadata = inject(NgxDadataService);

  search(query: string): void {
    this.dadata.getSuggestions(query, {
      apiKey: 'KEY',
      type: DadataType.address,
      limit: 5,
      locations: [{ city: 'Moscow' }],
    }).subscribe(suggestions => {
      console.log(suggestions);
    });
  }
}
```

### findById

Look up an entity by its identifier (FIAS ID, INN, OGRN, BIC, etc.):

```typescript
this.dadata.findById('7707083893', DadataType.party).subscribe(results => {
  console.log(results);
});
```

### geolocate

Find nearest addresses by coordinates:

```typescript
this.dadata.geolocate(55.878, 37.653, {
  apiKey: 'KEY',
  radius_meters: 100,
  count: 5,
}).subscribe(suggestions => {
  console.log(suggestions);
});
```

### iplocate

Determine address by IP:

```typescript
this.dadata.iplocate('92.38.45.22', {
  apiKey: 'KEY',
  language: 'en',
}).subscribe(location => {
  console.log(location); // DadataSuggestion | null
});
```

## Web Components

Use `<ngx-dadata>` in any HTML page, React, Vue, or other framework via Custom Elements.

**1. Install the library** and import the registration function:

```typescript
import { registerNgxDadataElement } from '@kolkov/ngx-dadata/elements';

await registerNgxDadataElement({
  config: { apiKey: 'YOUR_API_KEY', type: 'address' },
});
```

**2. Use in plain HTML**:

```html
<ngx-dadata placeholder="Enter address"></ngx-dadata>

<script type="module">
  import { registerNgxDadataElement } from './path/to/elements.js';
  await registerNgxDadataElement({ config: { apiKey: 'KEY' } });

  document.querySelector('ngx-dadata')
    .addEventListener('selected', (e) => {
      console.log('Selected:', e.detail);
    });
</script>
```

Calling `registerNgxDadataElement()` multiple times is safe -- subsequent calls are no-ops.

## Theming

The component exposes CSS custom properties for styling. Override them on the host element or any ancestor:

```css
ngx-dadata {
  --ngx-dadata-border-color: #d4d4d4;
  --ngx-dadata-border-radius: 4px;
  --ngx-dadata-bg: #fff;
  --ngx-dadata-focus-color: #4a90d9;
  --ngx-dadata-hover-bg: #f0f0f0;
  --ngx-dadata-active-bg: #4a90d9;
  --ngx-dadata-active-color: #fff;
  --ngx-dadata-detail-color: #888;
}
```

| Property | Default | Description |
|----------|---------|-------------|
| `--ngx-dadata-border-color` | `#d4d4d4` | Border color for input and dropdown. |
| `--ngx-dadata-border-radius` | `4px` | Border radius for input and dropdown corners. |
| `--ngx-dadata-bg` | `#fff` | Background color for input and dropdown. |
| `--ngx-dadata-focus-color` | `#4a90d9` | Outline color when input is focused. |
| `--ngx-dadata-hover-bg` | `#f0f0f0` | Background color of hovered suggestion. |
| `--ngx-dadata-active-bg` | `#4a90d9` | Background color of active (keyboard-selected) suggestion. |
| `--ngx-dadata-active-color` | `#fff` | Text color of active suggestion. |
| `--ngx-dadata-detail-color` | `#888` | Text color for secondary details (e.g., INN in party mode). |

## Accessibility

The component implements the [WAI-ARIA Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) pattern:

- `role="combobox"` on the container with `aria-expanded`, `aria-owns`, `aria-haspopup`
- `role="searchbox"` on the input with `aria-autocomplete="list"` and `aria-activedescendant`
- `role="listbox"` on the suggestion panel
- `role="option"` on each suggestion with `aria-selected`

**Keyboard shortcuts**:

| Key | Action |
|-----|--------|
| ArrowDown | Move to next suggestion (wraps to first) |
| ArrowUp | Move to previous suggestion (wraps to last) |
| Enter | Select the active suggestion |
| Escape | Close the suggestion panel |
| Home | Jump to the first suggestion |
| End | Jump to the last suggestion |

## API Reference

### Exports from `@kolkov/ngx-dadata`

| Export | Kind | Description |
|--------|------|-------------|
| `NgxDadataComponent` | Component | Standalone autocomplete component. |
| `NgxDadataModule` | NgModule | Deprecated wrapper for NgModule-based apps. |
| `NgxDadataService` | Service | Injectable service for direct API calls. |
| `DadataType` | Enum | Suggestion type identifiers. |
| `DadataConfigDefault` | Const | Default configuration object. |
| `provideNgxDadata` | Function | Provider factory for global DI config. |
| `NGX_DADATA_CONFIG` | InjectionToken | Token for providing `DadataConfig` via DI. |
| `DadataConfig` | Interface | Configuration interface. |
| `DadataLocation` | Interface | Location constraint. |
| `DadataLocationGeo` | Interface | Geo-based location constraint. |
| `DadataBound` | Interface | Single bound value. |
| `DadataBounds` | Interface | From/to bound pair. |
| `GeolocateOptions` | Interface | Options for `geolocate()`. |
| `IplocateOptions` | Interface | Options for `iplocate()`. |
| `DadataSuggestion` | Interface | A single suggestion from the API. |
| `DadataResponse` | Interface | API response wrapper. |
| `DadataIplocateResponse` | Interface | IP locate API response. |
| `DadataAddress` | Interface | Address data model. |
| `DadataFIO` | Interface | FIO (person name) data model. |
| `DadataParty` | Interface | Party (organization) data model. |
| `DadataBank` | Interface | Bank data model. |
| `DadataEmail` | Interface | Email data model. |
| `DadataCountry` | Interface | Country data model. |
| `DadataFinance` | Interface | Financial data (within party). |
| `DadataPartyRef` | Interface | Party reference (predecessors/successors). |
| `DadataMetro` | Interface | Metro station data (within address). |

### Exports from `@kolkov/ngx-dadata/elements`

| Export | Kind | Description |
|--------|------|-------------|
| `registerNgxDadataElement` | Function | Registers `<ngx-dadata>` as a Custom Element. |
| `NgxDadataElementOptions` | Interface | Options for element registration. |

## Contributing

Please read our [Contributing Guide](https://github.com/kolkov/ngx-dadata/blob/master/CONTRIBUTING.md) before submitting issues or pull requests.

## License

MIT -- see [LICENSE](https://github.com/kolkov/ngx-dadata/blob/master/LICENSE) for details.

Copyright (c) 2018-present Andrey Kolkov
