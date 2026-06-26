# Contributing to ngx-dadata

Thank you for your interest in contributing to `@kolkov/ngx-dadata`. This document explains how to report issues, set up a development environment, and submit changes.

## Reporting Issues

Before creating an issue, search [existing issues](https://github.com/kolkov/ngx-dadata/issues) to avoid duplicates.

When filing a bug report, include:

- Angular and `@kolkov/ngx-dadata` version numbers
- A minimal reproduction (StackBlitz preferred)
- Expected vs. actual behavior
- Browser and OS

For questions about usage, consider asking on [StackOverflow](https://stackoverflow.com/questions/ask?tags=angular,ngx-dadata) first.

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm 9 or later
- Git

### Clone and Install

```bash
git clone https://github.com/kolkov/ngx-dadata.git
cd ngx-dadata
npm install
```

### Project Structure

This is an Angular CLI workspace with two projects:

```
ngx-dadata/
├── projects/
│   ├── ngx-dadata/          # Library source
│   │   ├── src/lib/         # Components, services, models
│   │   └── elements/src/    # Web Components (Angular Elements)
│   └── ngx-dadata-app/      # Demo application
├── .github/workflows/       # GitHub Actions CI/CD
├── eslint.config.mjs        # ESLint flat config
└── angular.json             # Workspace configuration
```

### Common Commands

| Command | Description |
|---------|-------------|
| `npm start` | Serve the demo app at `http://localhost:4200` |
| `npm run build:lib` | Build the library (production) to `dist/ngx-dadata/` |
| `npm run build-watch:lib` | Build the library in watch mode |
| `npm run test:lib` | Run library tests (watch mode) |
| `npm run test-ci` | Run library tests with coverage (single run) |
| `npm run lint:lib` | Lint the library |
| `npm run lint` | Lint all projects |
| `npm run format` | Format all source files with Prettier |
| `npm run format:check` | Check formatting without modifying files |

### Running a Single Test

Use `fdescribe` or `fit` in a spec file to focus on specific tests, then run `npm run test:lib`.

## Tooling

- **Framework**: Angular 22 (library peer deps `>=19.0.0`)
- **Test runner**: [Vitest](https://vitest.dev/) via `@angular/build:unit-test` builder
- **Linter**: [ESLint](https://eslint.org/) with `angular-eslint` and `typescript-eslint` (flat config)
- **Formatter**: [Prettier](https://prettier.io/)
- **Build**: [ng-packagr](https://github.com/ng-packagr/ng-packagr) with APF partial compilation
- **CI**: [GitHub Actions](https://github.com/kolkov/ngx-dadata/actions) -- lint, build, test with coverage

## Submitting Changes

### Workflow

1. Fork the repository and create a feature branch from `master`:

   ```bash
   git checkout -b feat/my-feature
   ```

2. Make your changes. Ensure:

   - New features have test coverage
   - Existing tests pass (`npm run test-ci`)
   - Code passes linting (`npm run lint:lib`)
   - Library builds (`npm run build:lib`)

3. Commit using [Conventional Commits](https://www.conventionalcommits.org/) format:

   ```
   feat: add support for XYZ
   fix: prevent null reference in suggestion click
   docs: update config table in README
   test: add coverage for keyboard navigation
   refactor: extract suggestion filtering logic
   chore: update dev dependencies
   ```

4. Push and open a pull request against `master`.

### Code Standards

- **TypeScript strict mode** -- no `any`, no implicit returns, no unused variables
- **Standalone components** with `ChangeDetectionStrategy.OnPush`
- **Signal-based** inputs (`input()`), outputs (`output()`), and internal state (`signal()`, `computed()`)
- **No direct DOM access** -- use template bindings or `afterRender()` for SSR safety
- **ARIA attributes** on all interactive elements
- **`ngx` selector prefix** enforced by ESLint (element: `ngx-*`, directive: `ngx`+camelCase)

### Testing Guidelines

Tests use Vitest and `@angular/core/testing`. The test suite includes:

- **Unit tests** for the service (HTTP calls, error handling, parameter mapping)
- **Integration tests** for the component (rendering, keyboard navigation, form binding)
- **Accessibility tests** (ARIA attributes, roles, keyboard interaction)

When adding a feature or fixing a bug, write tests that cover:

- The expected behavior (happy path)
- Edge cases and error conditions
- Accessibility implications (if the change affects the DOM)

### Pull Request Checklist

- [ ] Library builds without errors: `npm run build:lib`
- [ ] All tests pass: `npm run test-ci`
- [ ] Linting passes: `npm run lint:lib`
- [ ] New features have tests
- [ ] Bug fixes include a regression test
- [ ] Commit messages follow Conventional Commits

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
