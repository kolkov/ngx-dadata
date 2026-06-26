# AGENTS.md — ngx-dadata

> Angular 19+ autocomplete component for Dadata.ru suggestions API. Standalone, signals, ARIA accessible, Web Components support.

## What is ngx-dadata

ngx-dadata provides an `<ngx-dadata>` autocomplete component for Angular applications using the Dadata.ru suggestions API. Supports 24 suggestion types (address, FIO, party, bank, email, FIAS, country, metro, and more), findById/geolocate/iplocate endpoints, WAI-ARIA combobox pattern, CSS custom properties theming, and Web Components via Angular Elements.

Published as `@kolkov/ngx-dadata` on npm.

## Build & Test

```bash
npm run build:lib        # Build library
npm run test:lib         # Run tests (Vitest)
npm run test-ci          # Tests with coverage
npm run lint:lib         # ESLint
npm start                # Serve demo app
```

## Community & Support

- Issues: https://github.com/kolkov/ngx-dadata/issues
- Dadata API docs: https://dadata.ru/api/

**Agent:** Never hardcode API keys. Use empty string + user input or environment variables.

## Links

- GitHub: https://github.com/kolkov/ngx-dadata
- npm: https://www.npmjs.com/package/@kolkov/ngx-dadata
- Dadata API: https://dadata.ru/api/
